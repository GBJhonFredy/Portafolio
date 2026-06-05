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
        class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 cursor-move select-none"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-semibold">
          Windows PowerShell
        </span>
 
        <!-- Botones tipo Windows (min, max, close) -->
        <div class="flex items-center gap-[2px]">
          <!-- Min -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            title="Minimizar"
            @click.stop="emitMinimize"
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
            @click.stop="emitClose"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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