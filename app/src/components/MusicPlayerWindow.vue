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
          Música - Tus Me gusta de Spotify
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

      <!-- Contenido (se adapta al tamaño de la ventana) -->
      <div
        class="flex flex-col bg-white"
        :class="isMaximized ? 'w-full h-[calc(100%-0px)]' : 'w-[640px] h-[380px] max-w-[90vw] max-h-[80vh]'"
      >
        <!-- Encabezado -->
        <div class="px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs md:text-sm">
          <div class="min-w-0">
            <p class="font-semibold text-slate-800 truncate">
              Tus canciones favoritas (Me gusta)
            </p>
            <p class="text-[11px] text-slate-500">
              Haz clic en una fila para abrir la canción directamente en Spotify.
            </p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <div class="text-[10px] text-slate-500">
              <span v-if="isLoading">Cargando canciones...</span>
              <span v-else-if="tracks.length">{{ tracks.length }} canciones</span>
              <span v-else>Sin datos aún</span>
            </div>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div
          v-if="errorMessage"
          class="px-4 py-2 bg-red-50 text-[11px] text-red-700 border-b border-red-200"
        >
          {{ errorMessage }}
        </div>

        <!-- Lista de canciones (Me gusta de Spotify) -->
        <div class="flex-1 overflow-auto">
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
                @click="openInSpotify(track)"
              >
                <td class="px-3 py-1 text-[11px] text-slate-500">
                  {{ index + 1 }}
                </td>
                <td class="px-3 py-1">
                  <div class="flex flex-col">
                    <span class="text-[11px] md:text-xs text-slate-900 underline decoration-sky-400/70">
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
            v-if="!isLoading && tracks.length === 0 && !errorMessage"
            class="px-4 py-6 text-center text-[12px] text-slate-500"
          >
            No hemos podido cargar tus Me gusta todavía.
          </div>
        </div>

        <!-- Barra inferior estilo XP -->
        <div class="h-6 bg-sky-700/90 border-t border-sky-900 flex items-center px-3 text-[10px] text-sky-100">
          <span>
            Cada fila abre la canción original en Spotify (web o app), usando la URL oficial.
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
import {
  fetchLikedTracks,
} from '../services/spotify.js';

const emit = defineEmits(['close', 'minimize']);

/* ---------- VENTANA: DRAG + MAXIMIZAR/RESTAURAR ---------- */

// posición relativa dentro del viewport
const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

// estado maximizado
const isMaximized = ref(false);
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('640px');
const savedHeight = ref('380px');

// estilo aplicado al contenedor de la ventana
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
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

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
  loadLikedTracks();
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

const toggleMaximize = () => {
  if (!isMaximized.value) {
    // guardar posición actual para restaurar luego
    savedPosX.value = posX.value;
    savedPosY.value = posY.value;
    isMaximized.value = true;
  } else {
    // restaurar posición y tamaño anteriores
    isMaximized.value = false;
    posX.value = savedPosX.value;
    posY.value = savedPosY.value;
  }
};

savedWidth.value = '640px';
savedHeight.value = '380px';

/* ---------- DATOS DE CANCIONES DESDE SPOTIFY ---------- */

const tracks = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const loadLikedTracks = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const result = await fetchLikedTracks(20);
    tracks.value = result;
  } catch (err) {
    console.error(err);
    errorMessage.value =
      'Error al cargar tus Me gusta. Puede que el token haya caducado. Vuelve a generar un access token.';
  } finally {
    isLoading.value = false;
  }
};

savedWidth.value = '640px';
savedHeight.value = '380px';

/* ---------- ABRIR CANCIÓN EN SPOTIFY ---------- */

const openInSpotify = (track) => {
  if (!track.spotifyUrl) {
    console.warn('Esta canción no tiene spotifyUrl');
    return;
  }
  window.open(track.spotifyUrl, '_blank');
};
</script> 