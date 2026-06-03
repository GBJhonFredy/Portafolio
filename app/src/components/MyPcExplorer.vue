<template>
  <!-- Ventana Explorador de archivos dentro de Mi PC -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
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
          Explorador del Sistema
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

      <!-- Contenido del explorador -->
      <div class="flex h-full">
        <!-- Panel izquierdo (árbol simple) -->
        <div
          class="w-1/3 min-w-[220px] border-r border-slate-300 bg-slate-100/80 p-3 text-xs md:text-sm"
        >
          <p class="font-semibold text-slate-800 mb-2">
            Mis sitios
          </p>

          <ul class="space-y-1">
            <li class="flex items-center gap-2 text-slate-800">
              <span>💻</span>
              <span>Mi PC</span>
            </li>
            <li class="flex items-center gap-2 text-slate-800">
              <span>📁</span>
              <span>Mis documentos</span>
            </li>
            <li class="flex items-center gap-2 text-slate-800">
              <span>💽</span>
              <span>Disco local (C:)</span>
            </li>
          </ul>
        </div>

        <!-- Panel derecho (contenido de Mi PC) -->
        <div class="flex-1 p-4 text-xs md:text-sm bg-white overflow-auto">
          <p class="font-semibold text-slate-800 mb-3">
            Mi PC
          </p>

          <!-- Fila de iconos: Mis documentos + Disco C -->
          <div class="flex flex-wrap gap-6 mb-6">
            <!-- Mis documentos: ahora avisa al escritorio, no abre ventana aquí -->
            <div
              class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
              @dblclick="$emit('open-my-docs')"
            >
              <div
                class="w-12 h-12 flex items-center justify-center text-2xl"
              >
                📁
              </div>
              <span class="text-[11px] md:text-xs text-slate-800">
                Mis documentos
              </span>
            </div>

            <!-- Disco local C -->
            <div class="flex flex-col items-center gap-1 select-none">
              <div
                class="w-12 h-12 flex items-center justify-center text-2xl"
              >
                💽
              </div>
              <span class="text-[11px] md:text-xs text-slate-800">
                Disco local (C:)
              </span>
            </div>
          </div>

          <!-- Estado del disco C (95% usado) -->
          <div
            class="border border-slate-300 rounded-md p-3 max-w-md bg-slate-50"
          >
            <p class="text-[11px] md:text-xs text-slate-700 mb-1">
              Disco local (C:)
            </p>

            <div class="w-full h-4 bg-slate-200 rounded-sm overflow-hidden mb-1">
              <div
                class="h-full bg-red-500"
                style="width: 95%;"
              ></div>
            </div>

            <p class="text-[11px] md:text-xs text-slate-600">
              Espacio usado: 95% · Espacio libre: 5%
            </p>
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

const emit = defineEmits(['close', 'minimize', 'open-my-docs']);

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
    - centrada con translate
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
    maxWidth: '1100px',
    transform: `translate(${posX.value}px, ${posY.value}px)`,
  };
});

const centerWindow = () => {
  posX.value = 0;
  posY.value = 0;
  savedWidth.value = '900px';
  savedHeight.value = '350px';
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