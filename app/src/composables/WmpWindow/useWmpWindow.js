import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '../../supabaseClient';

const wmpTracks = ref([]);
const isLoading = ref(false);
const loadError = ref(null);
const currentWmpId = ref(null);
const isWmpPlaying = ref(false);
const wmpVolume = ref(1);
const wmpProgress = ref(0); // 0 to 100
const wmpCurrentTime = ref(0);
const wmpDuration = ref(0);

const currentWmpTrack = computed(() =>
  wmpTracks.value.find((t) => t.id === currentWmpId.value) || null
);

let wmpAudio = null;
let isAudioSetup = false;

export function useWmpWindow() {
  const loadSongsFromSupabase = async () => {
    if (wmpTracks.value.length > 0) return;
    try {
      isLoading.value = true;
      loadError.value = null;

      const { data, error } = await supabase
        .from('songs')
        .select('id, title, artist, file_path')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error al cargar canciones de Supabase:', error);
        loadError.value = 'Error al cargar canciones';
        return;
      }

      if (!data || data.length === 0) {
        wmpTracks.value = [];
        currentWmpId.value = null;
        return;
      }

      const tracksWithUrl = data.map((song) => {
        const filePath = song.file_path;
        const { data: publicData } = supabase.storage.from('music').getPublicUrl(filePath);
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          url: publicData?.publicUrl || '',
        };
      });

      wmpTracks.value = tracksWithUrl;

      if (wmpTracks.value.length > 0) {
        currentWmpId.value = wmpTracks.value[0].id;
      }
    } catch (err) {
      console.error('Excepción al cargar canciones:', err);
      loadError.value = 'Error inesperado al cargar canciones';
   } finally {
      isLoading.value = false;
    }
  };

  const handleWmpEnded = () => {
    nextWmpTrack();
  };

  const handleTimeUpdate = () => {
    if (!wmpAudio) return;
    wmpCurrentTime.value = wmpAudio.currentTime;
    wmpDuration.value = wmpAudio.duration || 0;
    if (wmpDuration.value > 0) {
      wmpProgress.value = (wmpCurrentTime.value / wmpDuration.value) * 100;
    }
  };

  const setupWmpAudio = () => {
    if (isAudioSetup) return;
    wmpAudio = new Audio();
    wmpAudio.addEventListener('ended', handleWmpEnded);
    wmpAudio.addEventListener('timeupdate', handleTimeUpdate);
    wmpAudio.volume = wmpVolume.value;
    isAudioSetup = true;
  };

  const playCurrentWmpAudio = () => {
    if (!wmpAudio || !currentWmpTrack.value) return;

    if (!currentWmpTrack.value.url) {
      console.error('La canción actual no tiene URL pública');
      return;
    }

    wmpAudio.src = currentWmpTrack.value.url;
    wmpAudio.currentTime = 0;
    wmpAudio
      .play()
      .then(() => {
        isWmpPlaying.value = true;
      })
      .catch((err) => {
        console.error('Error al reproducir audio WMP:', err);
        isWmpPlaying.value = false;
      });
  };

  const toggleWmpPlay = () => {
    if (!currentWmpTrack.value || !wmpAudio) return;

    if (isWmpPlaying.value) {
      wmpAudio.pause();
      isWmpPlaying.value = false;
    } else {
      if (wmpAudio.src !== currentWmpTrack.value.url) {
        playCurrentWmpAudio();
      } else {
        wmpAudio
          .play()
          .then(() => {
            isWmpPlaying.value = true;
          })
          .catch((err) => {
            console.error('Error al reanudar audio WMP:', err);
            isWmpPlaying.value = false;
          });
      }
    }
  };

  const nextWmpTrack = () => {
    if (wmpTracks.value.length === 0) return;
    if (!currentWmpTrack.value) {
      currentWmpId.value = wmpTracks.value[0].id;
      playCurrentWmpAudio();
      return;
    }
    const currentIndex = wmpTracks.value.findIndex((t) => t.id === currentWmpId.value);
    const nextIndex = (currentIndex + 1) % wmpTracks.value.length;
    currentWmpId.value = wmpTracks.value[nextIndex].id;
    playCurrentWmpAudio();
  };

  const prevWmpTrack = () => {
    if (wmpTracks.value.length === 0) return;
    if (!currentWmpTrack.value) {
      currentWmpId.value = wmpTracks.value[0].id;
      playCurrentWmpAudio();
      return;
    }
    const currentIndex = wmpTracks.value.findIndex((t) => t.id === currentWmpId.value);
    const prevIndex = (currentIndex - 1 + wmpTracks.value.length) % wmpTracks.value.length;
    currentWmpId.value = wmpTracks.value[prevIndex].id;
    playCurrentWmpAudio();
  };

  const isCurrentTrack = (track) => {
    return currentWmpTrack.value && currentWmpTrack.value.id === track.id;
  };

  const toggleWmpPlayFromRow = (track) => {
    if (!wmpAudio) return;
    if (!isCurrentTrack(track)) {
      currentWmpId.value = track.id;
      playCurrentWmpAudio();
      return;
    }
    toggleWmpPlay();
  };

  const playFromRow = (track) => {
    if (!wmpAudio) return;
    currentWmpId.value = track.id;
    playCurrentWmpAudio();
  };

  const seekWmp = (percentage) => {
    if (!wmpAudio || wmpDuration.value === 0) return;
    const time = (percentage / 100) * wmpDuration.value;
    wmpAudio.currentTime = time;
  };

  const setWmpVolume = (vol) => {
    wmpVolume.value = vol;
    if (wmpAudio) wmpAudio.volume = vol;
  };

  onMounted(async () => {
    setupWmpAudio();
    await loadSongsFromSupabase();
  });

  return {
    wmpTracks,
    isLoading,
    loadError,
    currentWmpTrack,
    isWmpPlaying,
    wmpProgress,
    wmpCurrentTime,
    wmpDuration,
    wmpVolume,
    isCurrentTrack,
    toggleWmpPlay,
    nextWmpTrack,
    prevWmpTrack,
    toggleWmpPlayFromRow,
    playFromRow,
    seekWmp,
    setWmpVolume
  };
}
