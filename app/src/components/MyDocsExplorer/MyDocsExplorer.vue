<template>
  <div class="flex-1 p-4 text-xs md:text-sm bg-white overflow-auto relative h-full">
    <p class="font-semibold text-slate-800 mb-3">
      Mis documentos
    </p>

    <!-- Tres carpetas -->
    <div class="flex flex-wrap gap-6">
      <!-- Carpeta Proyectos -->
      <div
        class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
        @dblclick="$emit('navigate', 'proyectos')"
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
        @dblclick="$emit('navigate', 'imagenes')"
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
        @dblclick="$emit('navigate', 'musica')"
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
</template>

<script setup>
import { useMyDocsExplorer } from '../../composables/MyDocsExplorer/useMyDocsExplorer';
import '../../styles/MyDocsExplorer/MyDocsExplorer.css';

const emit = defineEmits(['navigate']);

const myDocsLogic = useMyDocsExplorer();
</script>