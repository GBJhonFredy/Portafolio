<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 select-none cursor-move" @mousedown="onMouseDown">
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <span class="font-semibold">Imágenes - Visor de Tecnologías</span>
        </div>
        <div class="flex items-center gap-[2px]">
           <button class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white" @click.stop="$emit('minimize')"><svg width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="7" width="8" height="2" fill="currentColor"/></svg></button>
           <button class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white" @click.stop="toggleMaximize">
             <svg v-if="!isMaximized" width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="1" width="8" height="2" fill="currentColor"/></svg>
             <svg v-else width="9" height="9" viewBox="0 0 10 10"><rect x="3" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>
           </button>
           <button class="w-6 h-5 flex items-center justify-center bg-[#d93025] hover:bg-[#e8574d] border border-[#a1231a] rounded-sm text-white" @click.stop="$emit('close')"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
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