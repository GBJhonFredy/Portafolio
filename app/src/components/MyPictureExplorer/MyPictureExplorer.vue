<template>
  <div class="flex flex-col h-full bg-white relative">
    <div class="flex flex-wrap gap-8 p-6 content-start overflow-auto flex-1">
      <template v-if="view === 'imagenes'">
        <!-- Carpeta Aprendizaje -->
        <div 
          class="flex flex-col items-center gap-2 cursor-pointer select-none hover:bg-sky-50 rounded-lg p-3 transition-colors w-28 border border-transparent hover:border-sky-200"
          @dblclick="$emit('navigate', 'imagenes-aprendizaje')"
        >
            <div class="w-16 h-16 flex items-center justify-center drop-shadow-sm">
              <svg viewBox="0 0 32 32" class="w-full h-full drop-shadow-sm">
                <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="text-[12px] font-medium text-slate-800 text-center w-full truncate">Aprendizaje</span>
        </div>

        <!-- Archivos Raiz -->
        <div 
          v-for="img in mainImages" :key="img.name" 
          class="flex flex-col items-center gap-2 cursor-pointer select-none hover:bg-sky-50 rounded-lg p-3 transition-colors w-28 border border-transparent hover:border-sky-200"
          @dblclick="openLink(img.url)"
          :title="'Doble clic para visitar ' + img.name"
        >
            <div class="w-16 h-16 flex items-center justify-center drop-shadow-md bg-white p-2 rounded-lg border border-slate-200" v-html="img.svg"></div>
            <span class="text-[12px] font-medium text-slate-800 text-center w-full truncate">{{ img.name }}</span>
        </div>
      </template>

      <template v-else-if="view === 'imagenes-aprendizaje'">
        <!-- Archivos Aprendizaje -->
        <div 
          v-for="img in learningImages" :key="img.name" 
          class="flex flex-col items-center gap-2 cursor-pointer select-none hover:bg-sky-50 rounded-lg p-3 transition-colors w-28 border border-transparent hover:border-sky-200"
          @dblclick="openLink(img.url)"
          :title="'Doble clic para visitar ' + img.name"
        >
            <div class="w-16 h-16 flex items-center justify-center drop-shadow-md bg-white p-2 rounded-lg border border-slate-200" v-html="img.svg"></div>
            <span class="text-[12px] font-medium text-slate-800 text-center w-full truncate">{{ img.name }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useMyPictureExplorer } from '../../composables/MyPictureExplorer/useMyPictureExplorer';

const props = defineProps({
  view: {
    type: String,
    default: 'imagenes'
  }
});

const emit = defineEmits(['navigate']);

const { openLink, mainImages, learningImages } = useMyPictureExplorer();
</script>