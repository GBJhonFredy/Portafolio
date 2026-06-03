<template>
  <!-- Ventana Música -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-22"
  >
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título estilo Windows (draggable) -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-semibold">
          Música - Playlist favorita
        </span>

        <div class="flex items-center gap-[2px] text-[9px]">
          <!-- Min -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-sky-500 border border-slate-900 hover:bg-sky-400"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            ▃
          </button>
          <!-- Max / Restore -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-sky-500 border border-slate-900 hover:bg-sky-400"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            @click.stop="toggleMaximize"
          >
            ☐
          </button>
          <!-- Close -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-red-600 border border-slate-900 hover:bg-red-500"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Contenido: lista + reproductor -->
      <div class="flex flex-col bg-white min-w-[360px] max-w-[720px]">
        <!-- Encabezado -->
        <div class="px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs md:text-sm">
          <div>
            <p class="font-semibold text-slate-800">
              Playlist: Mis canciones favoritas
            </p>
            <p class="text-[11px] text-slate-500">
              (Luego conectaremos esto con Spotify real)
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="hidden md:block text-[11px] text-slate-500">
              {{ tracks.length }} canciones
            </div>
            <button
              class="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] text-white"
              @click="connectSpotify"
            >
              Conectar con Spotify
            </button>
          </div>
        </div>

        <!-- Lista de canciones -->
        <div class="flex-1 max-h-[260px] overflow-auto">
          <table class="w-full text-xs md:text-sm">
            <thead class="bg-slate-100 border-b border-slate-200">
              <tr class="text-left text-[11px] text-slate-500">
                <th class="w-10 px-3 py-1">#</th>
                <th class="px-3 py-1">Título</th>
                <th class="px-3 py-1 hidden md:table-cell">Artista</th>
                <th class="w-16 px-3 py-1 text-right">Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(track, index) in tracks"
                :key="track.id"
                class="border-b border-slate-100 cursor-pointer hover:bg-sky-50"
                :class="track.id === currentTrackId ? 'bg-sky-100/70' : ''"
                @dblclick="playTrack(track.id)"
              >
                <td class="px-3 py-1 text-[11px] text-slate-500">
                  <span v-if="track.id !== currentTrackId">
                    {{ index + 1 }}
                  </span>
                  <span v-else>
                    ▶
                  </span>
                </td>
                <td class="px-3 py-1">
                  <div class="flex flex-col">
                    <span class="text-[11px] md:text-xs text-slate-900">
                      {{ track.title }}
                    </span>
                    <span class="text-[10px] text-slate-500 md:hidden">
                      {{ track.artist }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-1 text-[11px] text-slate-600 hidden md:table-cell">
                  {{ track.artist }}
                </td>
                <td class="px-3 py-1 text-[11px] text-slate-500 text-right">
                  {{ track.duration }}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="tracks.length === 0"
            class="px-4 py-6 text-center text-[12px] text-slate-500"
          >
            No hay canciones todavía.
          </div>
        </div>

        <!-- Reproductor -->
        <div class="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-[11px] text-slate-500">
              Reproduciendo ahora:
            </p>
            <p class="text-[12px] font-semibold text-slate-800 truncate">
              <span v-if="currentTrack">
                {{ currentTrack.title }}
              </span>
              <span v-else>
                Ninguna canción seleccionada
              </span>
            </p>
            <p class="text-[11px] text-slate-500 truncate">
              <span v-if="currentTrack">
                {{ currentTrack.artist }}
              </span>
              <span v-else>
                Haz doble clic en una canción para reproducirla
              </span>
            </p>
          </div>

          <!-- Controles -->
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
              title="Anterior"
              @click="prevTrack"
            >
              ⏮
            </button>
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-[14px] text-white font-bold"
              :title="isPlaying ? 'Pausar' : 'Reproducir'"
              @click="togglePlay"
              :disabled="!currentTrack"
            >
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
              title="Siguiente"
              @click="nextTrack"
            >
              ⏭
            </button>
          </div>
        </div>

        <!-- Barra inferior estilo XP -->
        <div class="h-6 bg-sky-700/90 border-t border-sky-900 flex items-center px-3 text-[10px] text-sky-100">
          <span v-if="currentTrack">
            Simulando reproducción local (luego se conectará a Spotify)
          </span>
          <span v-else>
            Lista de reproducción lista para conectar a Spotify
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { getSpotifyAuthUrl } from '../services/spotify.js';

const emit = defineEmits(['close', 'minimize']);

/* ---------- VENTANA: DRAG + MAXIMIZAR/RESTAURAR ---------- */

const posX = ref(60);
const posY = ref(60);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

const isMaximized = ref(false);
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('640px');
const savedHeight = ref('380px');

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      width: '100%',
      height: '100%',
      transform: 'translate(0, 0)',
    };
  }

  return {
    width: savedWidth.value,
    height: savedHeight.value,
    maxWidth: '900px',
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

const centerWindow = () => {
  posX.value = 60;
  posY.value = 60;
  savedWidth.value = '640px';
  savedHeight.value = '380px';
};

const onMouseMove = (event) => {
  if (!isDragging.value || isMaximized.value) return;

  const dx = event.clientX - startMouseX;
  const dy = event.clientY - startMouseY;

  posX.value = startPosX + dx;
  posY.value = startPosY + dy;
};

const onMouseUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const onMouseDown = (event) => {
  if (event.button !== 0 || isMaximized.value) return;

  isDragging.value = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  startPosX = posX.value;
  startPosY = posY.value;

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

onMounted(() => {
  centerWindow();
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

const toggleMaximize = () => {
  if (!isMaximized.value) {
    savedPosX.value = posX.value;
    savedPosY.value = posY.value;
    isMaximized.value = true;
  } else {
    isMaximized.value = false;
    posX.value = savedPosX.value;
    posY.value = savedPosY.value;
  }
};

/* ---------- DATOS DE CANCIONES (SIMULACIÓN) ---------- */

const tracks = ref([
  {
    id: '1',
    title: 'Lofi Coding Session',
    artist: 'Beat Maker',
    duration: '3:21',
  },
  {
    id: '2',
    title: 'Frontend Focus',
    artist: 'JS Waves',
    duration: '4:05',
  },
  {
    id: '3',
    title: 'CSS Dreams',
    artist: 'Flexbox FM',
    duration: '2:48',
  },
  {
    id: '4',
    title: 'Vue Vibes',
    artist: 'Component Crew',
    duration: '3:57',
  },
  {
    id: '5',
    title: 'Neon Nights',
    artist: 'Pixel Lights',
    duration: '4:12',
  },
]);

const currentTrackId = ref(null);
const isPlaying = ref(false);

const currentTrack = computed(() =>
  tracks.value.find((t) => t.id === currentTrackId.value) || null
);

/* ---------- LÓGICA DEL REPRODUCTOR ---------- */

const playTrack = (id) => {
  currentTrackId.value = id;
  isPlaying.value = true;
};

const togglePlay = () => {
  if (!currentTrack.value) return;
  isPlaying.value = !isPlaying.value;
};

const nextTrack = () => {
  if (tracks.value.length === 0) return;

  if (!currentTrack.value) {
    currentTrackId.value = tracks.value[0].id;
    isPlaying.value = true;
    return;
  }

  const currentIndex = tracks.value.findIndex(
    (t) => t.id === currentTrackId.value
  );
  const nextIndex = (currentIndex + 1) % tracks.value.length;
  currentTrackId.value = tracks.value[nextIndex].id;
  isPlaying.value = true;
};

const prevTrack = () => {
  if (tracks.value.length === 0) return;

  if (!currentTrack.value) {
    currentTrackId.value = tracks.value[0].id;
    isPlaying.value = true;
    return;
  }

  const currentIndex = tracks.value.findIndex(
    (t) => t.id === currentTrackId.value
  );
  const prevIndex =
    (currentIndex - 1 + tracks.value.length) % tracks.value.length;
  currentTrackId.value = tracks.value[prevIndex].id;
  isPlaying.value = true;
};

/* ---------- CONECTAR CON SPOTIFY ---------- */

const connectSpotify = () => {
  const url = getSpotifyAuthUrl();
  window.location.href = url;
};
</script>