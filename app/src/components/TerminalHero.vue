<template>
  <!-- Capa que ocupa toda la zona de trabajo de Mi PC -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <!-- Ventana PowerShell: normal (centrada/movible) o maximizada -->
     <div
      class="pointer-events-auto bg-black border border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título PowerShell (zona draggable) -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 cursor-move select-none"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-semibold">
          Windows PowerShell
        </span>

        <!-- Botones tipo Windows (min, max, close) -->
        <div class="flex items-center gap-[2px] text-[9px]">
          <!-- Min -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-sky-500 border border-slate-900 hover:bg-sky-400"
            title="Minimizar"
            @click.stop="emitMinimize"
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
            @click.stop="emitClose"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Área de consola (todo negro) -->
      <div
        class="px-4 md:px-6 py-4 md:py-5 bg-black font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed text-white overflow-auto h-full box-border"
      >
        <!-- Texto informativo tipo PowerShell -->
        <p class="text-[11px] md:text-xs text-slate-200 mb-3">
          Windows PowerShell
          <br />
          Copyright (C)
          Microsoft Corporation. Todos los derechos reservados.
        </p>

        <!-- Banner ASCII -->
        <pre
          class="text-[10px] sm:text-[11px] md:text-xs text-sky-300 mb-4 overflow-x-auto leading-tight font-bold"
        >{{ banner }}</pre>

        <!-- Comando -->
        <p class="text-sky-300 mb-1">
          PS C:\Portfolio&gt;
          <span class="text-white">
            Get-ResumenFrontend
          </span>
        </p>

        <!-- Texto animado -->
        <p class="text-white mb-3">
          {{ typedSummary }}
          <span
            v-if="isTyping"
            class="inline-block w-2 h-4 align-baseline bg-white ml-1 animate-pulse"
          ></span>
        </p>

        <!-- Mensaje de presionar ENTER cuando termina -->
        <p
          v-if="!isTyping"
          class="text-[11px] md:text-xs text-slate-200 mt-2"
        >
          Presiona ENTER para continuar...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';

const emit = defineEmits([
  'close',
  'minimize',
  'maximize',
  'continue',
]);

/* ---------- TEXTO Y EFECTO ESCRITURA ---------- */

const banner = String.raw`
  _____            _        __       _ _       
 |  __ \          | |      / _|     | (_)      
 | |__) |__  _ __ | |_ __ _| |_ ___ | |_  ___  
 |  ___/ _ \| '__|| __/ _\`|  _/ _ \| | |/ _ \ 
 | |  | (_) | |   | || (_| | || (_) | | | (_) |
 |_|   \___/|_|    \__\__,_|_| \___/|_|_|\___/ 


             Portafolio · GBJhonFredy
`;

const summary =
  '> Desarrollador Frontend orientado a interfaces claras, consistentes y preparadas para uso continuo en producción.';

const typedSummary = ref('');
const isTyping = ref(true);

let index = 0;
let intervalId = null;

const startTyping = () => {
  typedSummary.value = '';
  index = 0;
  isTyping.value = true;

  intervalId = setInterval(() => {
    if (index < summary.length) {
      typedSummary.value += summary[index];
      index++;
    } else {
      isTyping.value = false;

      clearInterval(intervalId);
      intervalId = null;
    }
  }, 22);
};

onMounted(() => {
  startTyping();
});

/* ---------- DETECTAR ENTER PARA CONTINUAR ---------- */

const handleKeyDown = (event) => {
  if (!isTyping.value && event.key === 'Enter') {
    emit('continue');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

/* ---------- DRAG + MAXIMIZAR/RESTAURAR ---------- */

const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

const isMaximized = ref(false);
// Guardamos posición/tamaño antes de maximizar
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('900px');
const savedHeight = ref('auto');

/*
  En modo normal:
    - width fija 900px
    - centrada con translate (desde el centro del overlay)
  En modo maximizado:
    - ocupa TODO el alto disponible del overlay (que ya respeta la barra de tareas)
    - sin translate (pegada arriba)
*/
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
    maxWidth: '1100px',
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

const centerWindow = () => {
  posX.value = 0;
  posY.value = 0;
  savedWidth.value = '900px';
  savedHeight.value = 'auto';
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
  if (event.button !== 0 || isMaximized.value) return; // solo botón izq. y no maximizado

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

const toggleMaximize = () => {
  if (!isMaximized.value) {
    // guardar estado actual
    savedPosX.value = posX.value;
    savedPosY.value = posY.value;
    isMaximized.value = true;
    emit('maximize');
  } else {
    // restaurar
    isMaximized.value = false;
    posX.value = savedPosX.value;
    posY.value = savedPosY.value;
  }
};

/* ---------- BOTONES VENTANA (emitimos eventos) ---------- */

const emitClose = () => {
  emit('close');
};

const emitMinimize = () => {
  emit('minimize');
};
</script>