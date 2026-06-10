<template>
  <!-- Capa que ocupa toda la zona de trabajo de Mi PC -->
  <div
    class="absolute inset-0 pointer-events-none"
  >
    <!-- Ventana PowerShell: normal (centrada/movible) o maximizada -->
     <div
      class="pointer-events-auto bg-black border border-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título PowerShell (zona draggable) -->
      <div
        class="h-7 bg-[#0F172A] flex items-center justify-between px-2 cursor-pointer border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          Windows PowerShell
        </span>
 
        <!-- Botones tipo Windows (min, max, close) -->
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
import { onMounted } from 'vue';
import { useTerminalHero } from '../../composables/TerminalHero/useTerminalHero';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import '../../styles/TerminalHero/TerminalHero.css';

const emit = defineEmits([
  'close',
  'minimize',
  'maximize',
  'continue',
]);

const {
  banner,
  typedSummary,
  isTyping,
  emitClose,
  emitMinimize
} = useTerminalHero(emit);

const {
  isMaximized,
  windowStyle,
  centerWindow,
  onMouseDown,
  toggleMaximize
} = useWindowManager({ defaultWidth: '900px', defaultHeight: '500px', maxWidth: '1100px' }, 'powershell');

onMounted(() => {
  centerWindow();
});
</script>