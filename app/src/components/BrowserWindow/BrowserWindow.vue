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

        <div class="flex items-center gap-[2px]">
          <!-- Min -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="7" width="8" height="2" fill="currentColor"/></svg>
          </button>
          <!-- Max / Restore -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            @click.stop="toggleMaximize"
          >
            <svg v-if="!isMaximized" width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="1" width="8" height="2" fill="currentColor"/></svg>
            <svg v-else width="9" height="9" viewBox="0 0 10 10"><rect x="3" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>
          </button>
          <!-- Close -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#d93025] hover:bg-[#e8574d] border border-[#a1231a] rounded-sm text-white"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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