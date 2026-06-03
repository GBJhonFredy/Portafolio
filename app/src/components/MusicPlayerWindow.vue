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
          Música - Biblioteca del sistema
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
              Música de Portafolio XP 
            </p>
            <p class="text-[11px] text-slate-500">
              Canciones en formato MP3 desde la carpeta <code>public/music</code>.
            </p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <div class="text-[10px] text-slate-500">
              {{ demoTracks.length }} canciones del sistema
            </div>
          </div>
        </div>

        <!-- Lista de canciones locales -->
        <div class="flex-1 overflow-auto">
          <table class="w-full text-xs md:text-sm">
            <thead class="bg-slate-100 border-b border-slate-200">
              <tr class="text-left text-[11px] text-slate-500">
                <th class="w-8 px-3 py-1"></th>
                <th class="px-3 py-1">Título</th>
                <th class="px-3 py-1 hidden md:table-cell">Artista</th>
                <th class="w-24 px-3 py-1 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="track in demoTracks"
                :key="track.id"
                class="border-b border-slate-100 hover:bg-sky-50 cursor-pointer"
                @click="playFromRow(track)"
              >
                <!-- Botón play/pausa -->
                <td class="px-3 py-1 text-[11px] text-slate-500">
                  <button
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                    :class="isCurrentTrack(track) && isDemoPlaying
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'"
                    @click.stop="toggleDemoPlayFromRow(track)"
                  >
                    <span v-if="isCurrentTrack(track) && isDemoPlaying">⏸</span>
                    <span v-else>▶</span>
                  </button>
                </td>

                <!-- Título -->
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

                <!-- Artista -->
                <td class="px-3 py-1 text-[11px] text-slate-600 hidden md:table-cell">
                  {{ track.artist }}
                </td>

                <!-- Estado -->
                <td class="px-3 py-1 text-[11px] text-slate-500 text-right">
                  <span v-if="isCurrentTrack(track) && isDemoPlaying">
                    Reproduciendo
                  </span>
                  <span v-else-if="isCurrentTrack(track) && !isDemoPlaying">
                    Pausado
                  </span>
                  <span v-else>
                    Listo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="demoTracks.length === 0"
            class="px-4 py-6 text-center text-[12px] text-slate-500"
          >
            No hay canciones locales configuradas. Añade MP3 en <code>public/music/</code>.
          </div>
        </div>

        <!-- Controles inferiores estilo reproductor -->
        <div class="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-[11px] text-slate-500">
              Ahora sonando:
            </p>
            <p class="text-[12px] font-semibold text-slate-800 truncate">
              <span v-if="currentDemoTrack">
                {{ currentDemoTrack.title }}
              </span>
              <span v-else>
                Nada aún. Elige una canción o pulsa ▶.
              </span>
            </p>
            <p class="text-[11px] text-slate-500 truncate">
              <span v-if="currentDemoTrack">
                {{ currentDemoTrack.artist }}
              </span>
              <span v-else>
                Biblioteca local sin depender de Spotify.
              </span>
            </p>
          </div>

          <!-- Controles demo -->
          <div class="flex items-center gap-2">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
              title="Anterior"
              @click="prevDemoTrack"
            >
              ⏮
            </button>
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-[14px] text-white font-bold"
              :title="currentDemoTrack && isDemoPlaying ? 'Pausar' : 'Reproducir'"
              @click="toggleDemoPlay"
              :disabled="!currentDemoTrack"
            >
              {{ currentDemoTrack && isDemoPlaying ? '⏸' : '▶' }}
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
              title="Siguiente"
              @click="nextDemoTrack"
            >
              ⏭
            </button>
          </div>
        </div>

        <!-- Barra inferior estilo XP -->
        <div class="h-6 bg-sky-700/90 border-t border-sky-900 flex items-center px-3 text-[10px] text-sky-100">
          <span>
            Reproductor local: hasta 10 canciones MP3 en la carpeta de música del sistema.
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

// centrar ventana en pantalla cuando NO está maximizada
const centerWindow = () => {
  posX.value = 0;
  posY.value = 0;
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
  setupDemoAudio();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('resize', handleResize);
  cleanupDemoAudio();
});

const handleResize = () => {
  if (!isMaximized.value) {
    centerWindow();
  }
};

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

/* ---------- PLAYLIST LOCAL (MP3 EN public/music/) ---------- */

const demoTracks = ref([
  {
    id: 'local-1',
    title: 'One More Road to Cross',
    artist: 'DMX',
    url: '/music/One More Road to Cross.mp3',
  },
  {
    id: 'local-2',
    title: 'Go To Sleep',
    artist: 'Eminem · DMX',
    url: '/music/Go To Sleep.mp3',
  },
  {
    id: 'local-3',
    title: 'Dale Hasta Abajo',
    artist: 'Divino',
    url: '/music/Dale Hasta Abajo.mp3',
  },
  {
    id: 'local-4',
    title: 'Salgo Filoteau',
    artist: 'Wisin & Yandel · Divino & Baby Ranks',
    url: '/music/Salgo Filoteau.mp3',
  },
  {
    id: 'local-5',
    title: 'Bandera Negra',
    artist: 'Mägo de Oz ',
    url: '/music/Bandera Negra.mp3',
  },
  {
    id: 'local-6',
    title: 'La dama del Mar',
    artist: 'Mägo de Oz ',
    url: '/music/La dama del Mar.mp3',
  },
  {
    id: 'local-7',
    title: 'Sexy Btch',
    artist: 'David Guetta, Akon',
    url: '/music/Sexy Btch.mp3',
  },
  {    id: 'local-8',
    title: 'Alan Walker',
    artist: 'Faded',
    url: '/music/Alan Walker.mp3',
  },
  {
    id: 'local-9',
    title: 'Bones',
    artist: 'Imagine Dragonsr',
    url: '/music/Bones.mp3',
  },
  {
    id: 'local-10',
    title: 'Thunder',
    artist: 'Imagine Dragonsr',
    url: '/music/Thunder.mp3',
  }
]);

const currentDemoId = ref(demoTracks.value.length ? demoTracks.value[0].id : null);
const isDemoPlaying = ref(false);

const currentDemoTrack = computed(() =>
  demoTracks.value.find((t) => t.id === currentDemoId.value) || null
);

let demoAudio = null;

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

  const currentIndex = demoTracks.value.findIndex(
    (t) => t.id === currentDemoId.value
  );
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

  const currentIndex = demoTracks.value.findIndex(
    (t) => t.id === currentDemoId.value
  );
  const prevIndex =
    (currentIndex - 1 + demoTracks.value.length) % demoTracks.value.length;
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
</script>