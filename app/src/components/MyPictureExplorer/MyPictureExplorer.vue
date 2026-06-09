<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div class="h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move" @mousedown="onMouseDown">
        <div class="flex items-center gap-2 text-xs md:text-sm text-white font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          <span class="font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">Imágenes - Visor de Tecnologías</span>
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

      <!-- Cuerpo -->
      <div class="flex flex-col h-[calc(100%-30px)] animate-fade-in relative bg-white">
         <!-- Navegación -->
         <div class="flex items-center gap-3 bg-slate-100 p-1.5 border-b border-slate-300 shadow-sm">
            <button 
              @click="goBack" 
              class="flex items-center justify-center w-6 h-6 hover:bg-slate-200 border border-transparent hover:border-slate-400 rounded text-slate-600 transition-colors"
              :disabled="currentPath === 'Imágenes'"
              :class="{ 'opacity-50 cursor-not-allowed': currentPath === 'Imágenes' }"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"/></svg>
            </button>
            <div class="h-4 w-px bg-slate-300"></div>
            <span class="text-slate-600 font-mono text-[11px] truncate">{{ currentPath }}</span>
         </div>
         
         <!-- Contenido -->
         <div class="flex flex-wrap gap-8 p-6 content-start overflow-auto flex-1 bg-white">
            <template v-if="currentPath === 'Imágenes'">
              <!-- Carpeta Aprendizaje -->
              <div 
                class="flex flex-col items-center gap-2 cursor-pointer select-none hover:bg-sky-50 rounded-lg p-3 transition-colors w-28 border border-transparent hover:border-sky-200"
                @dblclick="openFolder('Aprendizaje')"
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

            <template v-else-if="currentPath === 'Imágenes\\Aprendizaje'">
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
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useMyPictureExplorer } from '../../composables/MyPictureExplorer/useMyPictureExplorer';

const emit = defineEmits(['close', 'minimize']);

const { isMaximized, windowStyle, centerWindow, onMouseDown, toggleMaximize } = useWindowManager({ defaultWidth: '760px', defaultHeight: '480px' }, 'picture-explorer');

const { currentPath, openFolder, goBack, openLink, mainImages, learningImages } = useMyPictureExplorer();

onMounted(() => {
  centerWindow();
});
</script>