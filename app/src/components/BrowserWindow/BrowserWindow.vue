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
        class="h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 text-xs md:text-sm text-white font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          <span>🦊</span>
          <span class="font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
            Firefox Preview
          </span>
        </div>

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
import { useBrowserWindow } from '../../composables/BrowserWindow/useBrowserWindow';
import '../../styles/BrowserWindow/BrowserWindow.css';

const props = defineProps({
  htmlDocument: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'minimize']);

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize
} = useBrowserWindow();
</script>