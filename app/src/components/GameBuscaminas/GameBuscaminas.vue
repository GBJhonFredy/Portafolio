<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
    <div
      class="window-pop bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-gray-800 border-r-gray-800 pointer-events-auto"
      :style="windowStyle"
    >
      <!-- Title Bar -->
      <div
        class="flex items-center justify-between px-2 py-0.5 bg-gradient-to-r from-blue-800 to-blue-600 text-white cursor-move select-none"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-1">
          <svg viewBox="0 0 32 32" class="w-4 h-4">
            <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#fff" stroke-width="2"/>
            <path d="M4 28V4h24" stroke="#808080" stroke-width="2" fill="none"/>
            <circle cx="16" cy="16" r="8" fill="#000"/>
            <path d="M12 12l8 8m0-8l-8 8" stroke="#000" stroke-width="2"/>
          </svg>
          <span class="text-xs font-bold">Buscaminas</span>
        </div>
        <div class="flex items-center gap-[2px] text-[9px]">
          <button class="w-5 h-4 flex items-center justify-center bg-[#c0c0c0] text-black border border-gray-600 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#000] hover:active:shadow-[inset_1px_1px_#000,inset_-1px_-1px_#fff]" @click.stop="$emit('minimize')">_</button>
          <button class="w-5 h-4 flex items-center justify-center bg-[#c0c0c0] text-black border border-gray-600 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#000] hover:active:shadow-[inset_1px_1px_#000,inset_-1px_-1px_#fff]" @click.stop="toggleMaximize">☐</button>
          <button class="w-5 h-4 flex items-center justify-center bg-[#c0c0c0] text-black border border-gray-600 shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#000] hover:active:shadow-[inset_1px_1px_#000,inset_-1px_-1px_#fff]" @click.stop="$emit('close')">✕</button>
        </div>
      </div>

      <!-- Menu Bar -->
      <div class="flex items-center text-xs px-2 py-1 bg-[#c0c0c0] border-b border-gray-500 gap-3 select-none">
        <div class="relative group cursor-pointer">
          <span class="hover:bg-blue-600 hover:text-white px-1">Juego</span>
          <div class="absolute hidden group-hover:flex flex-col bg-[#c0c0c0] border border-gray-500 shadow-md py-1 mt-1 z-50 text-black">
            <button class="px-4 py-1 hover:bg-blue-600 hover:text-white text-left whitespace-nowrap" @click="initGame">Nuevo</button>
            <div class="border-t border-gray-400 my-1"></div>
            <button class="px-4 py-1 hover:bg-blue-600 hover:text-white text-left whitespace-nowrap flex items-center" @click="setDifficulty('beginner')"><span class="w-4">{{ rows === 9 ? '✓' : '' }}</span>Principiante</button>
            <button class="px-4 py-1 hover:bg-blue-600 hover:text-white text-left whitespace-nowrap flex items-center" @click="setDifficulty('intermediate')"><span class="w-4">{{ rows === 16 && cols === 16 ? '✓' : '' }}</span>Intermedio</button>
            <button class="px-4 py-1 hover:bg-blue-600 hover:text-white text-left whitespace-nowrap flex items-center" @click="setDifficulty('expert')"><span class="w-4">{{ cols === 30 ? '✓' : '' }}</span>Experto</button>
            <div class="border-t border-gray-400 my-1"></div>
            <button class="px-4 py-1 hover:bg-blue-600 hover:text-white text-left whitespace-nowrap" @click="$emit('close')">Salir</button>
          </div>
        </div>
      </div>

      <!-- Game Area -->
      <div class="p-2 bg-[#c0c0c0] flex flex-col items-center select-none">
        <div class="border-[3px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-1.5 flex flex-col bg-[#c0c0c0] gap-1.5 w-max">
          
          <!-- Header -->
          <div class="border-[2px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white p-1 flex justify-between items-center bg-[#c0c0c0] h-10 min-w-[150px]">
            <div class="bg-black text-red-500 font-mono font-bold text-xl px-1 leading-none tracking-widest">{{ formatNumber(minesLeft) }}</div>
            <button 
              class="w-7 h-7 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 bg-[#c0c0c0] flex items-center justify-center text-lg active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white outline-none" 
              @click="initGame"
            >
              {{ faceIcon }}
            </button>
            <div class="bg-black text-red-500 font-mono font-bold text-xl px-1 leading-none tracking-widest">{{ formatNumber(timer) }}</div>
          </div>
          
          <!-- Grid -->
          <div 
            class="border-[3px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white bg-[#c0c0c0]"
            @mouseleave="isMouseDown = false"
          >
            <div v-for="(row, r) in grid" :key="r" class="flex">
              <button 
                v-for="(cell, c) in row" :key="c"
                class="w-[20px] h-[20px] flex items-center justify-center text-[13px] font-bold font-mono outline-none"
                :class="[
                  !cell.isRevealed ? 'bg-[#c0c0c0] border-[2px] border-t-white border-l-white border-b-gray-500 border-r-gray-500 hover:active:border-t-gray-500 hover:active:border-l-gray-500 hover:active:border-b-white hover:active:border-r-white' : 'bg-[#c0c0c0] border border-gray-400',
                  cell.isRevealed && cell.isMine && gameState === 'lost' && !cell.isFlagged ? 'bg-red-500' : ''
                ]"
                @click="revealCell(r, c)"
                @contextmenu="toggleFlag($event, r, c)"
                @mousedown="isMouseDown = true"
                @mouseup="isMouseDown = false"
              >
                <span v-if="cell.isFlagged && cell.isRevealed && !cell.isMine" class="text-red-600">❌</span>
                <span v-else-if="cell.isRevealed && cell.isMine">💣</span>
                <span v-else-if="cell.isFlagged" class="text-red-600">🚩</span>
                <span v-else-if="cell.isRevealed && cell.neighborMines > 0" :class="numberColor(cell.neighborMines)">{{ cell.neighborMines }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useGameBuscaminas } from '../../composables/GameBuscaminas/useGameBuscaminas';

const emit = defineEmits(['close', 'minimize']);

const { windowStyle, centerWindow, onMouseDown, toggleMaximize, isMaximized } = useWindowManager(
  { defaultWidth: 'auto', defaultHeight: 'auto' },
  'buscaminas'
);

const {
  rows, cols, grid, gameState, minesLeft, timer, isMouseDown,
  initGame, revealCell, toggleFlag, setDifficulty, formatNumber, faceIcon, numberColor
} = useGameBuscaminas();

onMounted(() => {
  centerWindow();
});
</script>