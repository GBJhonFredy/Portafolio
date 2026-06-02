<template>
  <!-- Ventana "Mis documentos" -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
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
          Mis documentos
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

      <!-- Contenido de la ventana "Mis documentos" -->
      <div class="p-4 text-xs md:text-sm bg-white overflow-auto min-w-[360px]">
        <p class="font-semibold text-slate-800 mb-3">
          Mis documentos
        </p>

        <!-- Tres carpetas -->
        <div class="flex flex-wrap gap-6">
          <!-- Carpeta Proyectos -->
          <div
            class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
          >
            <div
              class="w-10 h-10 flex items-center justify-center text-xl"
            >
              📁
            </div>
            <span class="text-[11px] md:text-xs text-slate-800">
              Proyectos
            </span>
          </div>

          <!-- Carpeta Imágenes -->
          <div
            class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
          >
            <div
              class="w-10 h-10 flex items-center justify-center text-xl"
            >
              🖼️
            </div>
            <span class="text-[11px] md:text-xs text-slate-800">
              Imágenes
            </span>
          </div>

          <!-- Carpeta Música -->
          <div
            class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
          >
            <div
              class="w-10 h-10 flex items-center justify-center text-xl"
            >
              🎵
            </div>
            <span class="text-[11px] md:text-xs text-slate-800">
              Música
            </span>
          </div>
        </div>
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

// declaramos los eventos que puede emitir esta ventana
const emit = defineEmits(['close', 'minimize']);

/* ---------- DRAG + MAXIMIZAR/RESTAURAR ---------- */

const posX = ref(40);  // pequeño offset para que no quede exactamente encima
const posY = ref(40);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

const isMaximized = ref(false);
// Guardamos posición/tamaño antes de maximizar
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('600px');
const savedHeight = ref('auto');

/*
  En modo normal:
    - width fija 600px
    - centrada con translate (con pequeño offset)
  En modo maximizado:
    - ocupa todo el alto del overlay (que ya deja ver la barra de tareas)
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
    maxWidth: '900px',
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

const centerWindow = () => {
  posX.value = 40;
  posY.value = 40;
  savedWidth.value = '600px';
  savedHeight.value = '300px';
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

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

const toggleMaximize = () => {
  if (!isMaximized.value) {
    // guardar estado actual
    savedPosX.value = posX.value;
    savedPosY.value = posY.value;
    isMaximized.value = true;
  } else {
    // restaurar
    isMaximized.value = false;
    posX.value = savedPosX.value;
    posY.value = savedPosY.value;
  }
};
</script>