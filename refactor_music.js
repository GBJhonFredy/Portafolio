const fs = require('fs');
const path = require('path');

function createDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const baseDir = 'd:/Github/Portafolio/app/src';

const compDir = path.join(baseDir, 'components/MusicPlayerWindow');
const compoDir = path.join(baseDir, 'composables/MusicPlayerWindow');
const styleDir = path.join(baseDir, 'styles/MusicPlayerWindow');

createDir(compDir);
createDir(compoDir);
createDir(styleDir);

fs.writeFileSync(path.join(styleDir, 'MusicPlayerWindow.css'), '/* Estilos para MusicPlayerWindow */\n');

const jsContent = `import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '../../supabaseClient';

export function useMusicPlayerWindow() {
  const demoTracks = ref([]);
  const isLoading = ref(false);
  const loadError = ref(null);
  const currentDemoId = ref(null);
  const isDemoPlaying = ref(false);

  const currentDemoTrack = computed(() =>
    demoTracks.value.find((t) => t.id === currentDemoId.value) || null
  );

  let demoAudio = null;

  const loadSongsFromSupabase = async () => {
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
        demoTracks.value = [];
        currentDemoId.value = null;
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

      demoTracks.value = tracksWithUrl;

      if (demoTracks.value.length > 0) {
        currentDemoId.value = demoTracks.value[0].id;
      }
    } catch (err) {
      console.error('Excepción al cargar canciones:', err);
      loadError.value = 'Error inesperado al cargar canciones';
   } finally {
      isLoading.value = false;
    }
  };

  const setupDemoAudio = () => {
    demoAudio = new Audio();
    demoAudio.addEventListener('ended', handleDemoEnded);
  };

  const cleanupDemoAudio = () => {
    if (!demoAudio) return;
    demoAudio.pause();
    demoAudio.removeEventListener('ended', handleDemoEnded);
    demoAudio = null;
  };

  const handleDemoEnded = () => {
    nextDemoTrack();
  };

  const playCurrentDemoAudio = () => {
    if (!demoAudio || !currentDemoTrack.value) return;

    if (!currentDemoTrack.value.url) {
      console.error('La canción actual no tiene URL pública');
      return;
    }

    demoAudio.src = currentDemoTrack.value.url;
    demoAudio.currentTime = 0;
    demoAudio
      .play()
      .then(() => {
        isDemoPlaying.value = true;
      })
      .catch((err) => {
        console.error('Error al reproducir audio demo:', err);
        isDemoPlaying.value = false;
      });
  };

  const toggleDemoPlay = () => {
    if (!currentDemoTrack.value || !demoAudio) return;

    if (isDemoPlaying.value) {
      demoAudio.pause();
      isDemoPlaying.value = false;
    } else {
      if (demoAudio.src !== currentDemoTrack.value.url) {
        playCurrentDemoAudio();
      } else {
        demoAudio
          .play()
          .then(() => {
            isDemoPlaying.value = true;
          })
          .catch((err) => {
            console.error('Error al reanudar audio demo:', err);
            isDemoPlaying.value = false;
          });
      }
    }
  };

  const nextDemoTrack = () => {
    if (demoTracks.value.length === 0) return;
    if (!currentDemoTrack.value) {
      currentDemoId.value = demoTracks.value[0].id;
      playCurrentDemoAudio();
      return;
    }
    const currentIndex = demoTracks.value.findIndex((t) => t.id === currentDemoId.value);
    const nextIndex = (currentIndex + 1) % demoTracks.value.length;
    currentDemoId.value = demoTracks.value[nextIndex].id;
    playCurrentDemoAudio();
  };

  const prevDemoTrack = () => {
    if (demoTracks.value.length === 0) return;
    if (!currentDemoTrack.value) {
      currentDemoId.value = demoTracks.value[0].id;
      playCurrentDemoAudio();
      return;
    }
    const currentIndex = demoTracks.value.findIndex($t) => t.id === currentDemoId.value);
    const prevIndex = (currentIndex - 1 + demoTracks.value.length) % demoTracks.value.length;
    currentDemoId.value = demoTracks.value[prevIndex].id;
    playCurrentDemoAudio();
  };

  const isCurrentTrack = (track) => {
    return currentDemoTrack.value && currentDemoTrack.value.id === track.id;
  };

  const toggleDemoPlayFromRow = (track) => {
    if (!demoAudio) return;
    if (!isCurrentTrack(track)) {
      currentDemoId.value = track.id;
      playCurrentDemoAudio();
      return;
    }
    toggleDemoPlay();
  };

  const playFromRow = (track) => {
    if (!demoAudio) return;
    currentDemoId.value = track.id;
    playCurrentDemoAudio();
  };

  onMounted(async () => {
    setupDemoAudio();
    await loadSongsFromSupabase();
  });

  onBeforeUnmount(() => {
    cleanupDemoAudio();
  });

  return {
    demoTracks,
    isLoading,
    loadError,
    currentDemoTrack,
    isDemoPlaying,
    isCurrentTrack,
    toggleDemoPlay,
    nextDemoTrack,
    prevDemoTrack,
    toggleDemoPlayFromRow,
    playFromRow
  };
}
`;
fs.writeFileSync(path.join(compoDir, 'useMusicPlayerWindow.js'), jsContent);
console.log('Done');