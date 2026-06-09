<template>
  <!-- Ventana "Mis documentos" -->
  <div
    class="absolute inset-0 pointer-events-none z-20"
  >
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título estilo Windows (draggable) -->
      <div
        class="h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          Mis documentos
        </span>

              <div class="flex items-center gap-0.5">
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="$emit('minimize')"
        >
          <div class="w-2.5 h-0.5 bg-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="toggleMaximize"
        >
          <div class="w-2.5 h-2.5 border-2 border-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm ml-0.5"
          @click.stop="$emit('close')"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      </div>

      <!-- Contenido de la ventana "Mis documentos" -->
      <div class="p-4 text-xs md:text-sm bg-white overflow-auto min-w-[360px] h-[calc(100%-30px)]">
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
            <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            </div>
            <span class="text-[11px] md:text-xs text-slate-800">
              Proyectos
            </span>
          </div>

          <!-- Carpeta Imágenes -->
          <div
            class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
            @dblclick="$emit('open-pictures')"
          >
            <div
              class="w-10 h-10 flex items-center justify-center text-xl"
            >
            <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <rect x="10" y="15" width="12" height="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
              <circle cx="13" cy="18" r="1.5" fill="#fde047"/>
              <path d="M10 23l4-3 2 1 3-4 3 6z" fill="#10b981"/>
            </svg>
            </div>
            <span class="text-[11px] md:text-xs text-slate-800">
              Imágenes
            </span>
          </div>

          <!-- Carpeta Música -->
          <div
            class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
            @dblclick="$emit('open-music')"
          >
            <div
              class="w-10 h-10 flex items-center justify-center text-xl"
            >
            <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M14 22a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm0 0v-7h6v2h-4v5z" fill="#ef4444" stroke="#991b1b" stroke-width="1" stroke-linejoin="round"/>
            </svg>
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
import { onMounted } from 'vue';
import { useMyDocsExplorer } from '../../composables/MyDocsExplorer/useMyDocsExplorer';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import '../../styles/MyDocsExplorer/MyDocsExplorer.css';

const emit = defineEmits(['close', 'minimize', 'open-music', 'open-pictures']);

const myDocsLogic = useMyDocsExplorer();

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize,
  centerWindow
} = useWindowManager({ defaultWidth: '600px', defaultHeight: '300px', maxWidth: '900px' }, 'my-docs');

onMounted(() => {
  centerWindow();
});
</script>