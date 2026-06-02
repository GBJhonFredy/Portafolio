<template>
  <!-- Ventana navegador tipo Firefox -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
  >
    <div
      class="pointer-events-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título navegador -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-100 border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <span>🦊</span>
          <span class="font-semibold">
            Firefox Preview
          </span>
        </div>

        <div class="flex items-center gap-[2px] text-[9px]">
          <!-- Min -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-700 border border-slate-900 hover:bg-slate-600"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            ▃
          </button>
          <!-- Max / Restore -->
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-700 border border-slate-900 hover:bg-slate-600"
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

      <!-- Barra de dirección simple -->
      <div class="px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
        <span class="text-slate-500">Dirección:</span>
        <div class="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-700 truncate">
          preview://local-code
        </div>
      </div>

      <!-- Contenido: iframe con la página -->
      <div class="w-full h-full bg-slate-900">
        <iframe
          class="w-full h-full bg-white"
          :srcdoc="htmlDocument"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
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

const props = defineProps({
  htmlDocument: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'minimize']);

const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

const isMaximized = ref(true);
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('900px');
const savedHeight = ref('600px');

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
    maxHeight: '700px',
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

const centerWindow = () => {
  posX.value = 40;
  posY.value = 40;
  savedWidth.value = '960px';
  savedHeight.value = '600px';
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
</script>