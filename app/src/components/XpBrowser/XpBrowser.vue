<template>
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
  >
    <div
      class="pointer-events-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-100 border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <span>🦊</span>
          <span class="font-semibold">Navegador XP</span>
        </div>

        <div class="flex items-center gap-[2px]">
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="7" width="8" height="2" fill="currentColor"/></svg>
          </button>
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            @click.stop="toggleMaximize"
          >
            <svg v-if="!isMaximized" width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="1" width="8" height="2" fill="currentColor"/></svg>
            <svg v-else width="9" height="9" viewBox="0 0 10 10"><rect x="3" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>
          </button>
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#d93025] hover:bg-[#e8574d] border border-[#a1231a] rounded-sm text-white"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <!-- Barra de dirección -->
      <div class="px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px] flex gap-2 items-center">
        <span class="text-slate-400">Dirección:</span>
        <input
          v-model="url"
          type="text"
          class="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none text-[11px]"
          @keydown.enter.prevent="goToUrl"
        />
        <button
          class="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-[11px]"
          @click="goToUrl"
        >
          Ir
        </button>
      </div>

      <!-- Contenido: iframe -->
      <div class="w-full h-full bg-slate-900">
        <iframe
          class="w-full h-full bg-white"
          :src="iframeSrc"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useXpBrowser } from '../../composables/XpBrowser/useXpBrowser';
import '../../styles/XpBrowser/XpBrowser.css';

const emit = defineEmits(['close', 'minimize']);

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize,
  url,
  iframeSrc,
  goToUrl
} = useXpBrowser();
</script>