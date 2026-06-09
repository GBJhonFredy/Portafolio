<template>
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
  >
    <div
      class="pointer-events-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] window-pop flex flex-col overflow-hidden"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div
        class="h-8 shrink-0 bg-slate-950 flex items-center justify-between px-3 cursor-pointer border-b border-slate-800 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 overflow-hidden text-xs text-slate-300">
          <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0">
            <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#1e3a8a" stroke-width="1"/>
            <path d="M16 4v24M4 16h24" stroke="#60a5fa" stroke-width="0.5"/>
            <path d="M4 16c0-8 15-12 24-4M8 26c10 8 20 2 20-10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" fill="none"/>
            <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">e</text>
          </svg>
          <span class="font-medium text-slate-200">
            Internet Explorer
          </span>
        </div>

        <!-- Controles de Ventana (Estilo Plano) -->
        <div class="flex items-center ml-1">
          <button
            class="w-8 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors rounded"
            @click.stop="$emit('minimize')"
            title="Minimizar"
          >
            <div class="w-2.5 h-[1px] bg-current"></div>
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors rounded"
            @click.stop="toggleMaximize"
            title="Maximizar"
          >
            <div class="w-2.5 h-2.5 border border-current"></div>
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-400 transition-colors rounded"
            @click.stop="$emit('close')"
            title="Cerrar"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de dirección -->
      <div class="shrink-0 px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px] flex gap-2 items-center">
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
      <div class="flex-1 min-h-0 bg-slate-900">
        <iframe
          class="w-full h-full bg-white border-none"
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