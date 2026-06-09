<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div class="h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move" @mousedown="onMouseDown">
        <div class="flex items-center gap-2 text-xs md:text-sm text-white font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          <span class="font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">Papelera de reciclaje</span>
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
      <div class="flex flex-col h-[calc(100%-30px)] animate-fade-in relative bg-white" @click="closeContextMenu" @contextmenu="closeContextMenu">
         <!-- Herramientas -->
         <div class="flex items-center gap-3 bg-slate-100 p-2 border-b border-slate-300 shadow-sm text-xs">
            <button @click="emptyTrash" class="px-2 py-1 bg-slate-200 border border-slate-300 hover:bg-slate-300 rounded text-slate-700">Vaciar Papelera</button>
            <button @click="loadItems" class="px-2 py-1 bg-slate-200 border border-slate-300 hover:bg-slate-300 rounded text-slate-700">Refrescar</button>
         </div>
         
         <!-- Contenido -->
         <div class="flex flex-wrap gap-6 p-4 content-start overflow-auto flex-1">
            <div v-if="isLoading" class="w-full text-slate-500 text-xs">Cargando elementos eliminados...</div>
            <div v-else-if="deletedItems.length === 0" class="w-full text-slate-500 text-xs">La papelera está vacía.</div>
            
            <div v-for="item in deletedItems" :key="item.id + item._type" 
                 class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-2 transition-colors w-20"
                 @contextmenu.stop.prevent="handleContextMenu($event, item)">
               
               <!-- SVG Iconos Desvanecidos -->
               <svg v-if="item._type === 'project'" viewBox="0 0 32 32" class="w-10 h-10 drop-shadow-sm opacity-50">
                  <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
               </svg>
               <svg v-else viewBox="0 0 24 24" class="w-10 h-10 drop-shadow-sm opacity-50" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
               </svg>
               <span class="text-[11px] text-slate-800 text-center w-full truncate" :title="item.name">{{ item.name }}</span>
            </div>
         </div>

         <!-- Context Menu -->
         <div v-if="contextMenu.visible" class="fixed z-50 w-48 bg-slate-50 border border-slate-400 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] py-1 text-slate-800 text-[11px]" :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }" @click.stop>
            <button class="w-full text-left px-4 py-1.5 hover:bg-sky-600 hover:text-white" @click="handleRestore">Restaurar</button>
            <button class="w-full text-left px-4 py-1.5 hover:bg-red-600 hover:text-white" @click="handleHardDelete">Eliminar definitivamente</button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePapeleraExplorer } from '../../composables/PapeleraExplorer/usePapeleraExplorer';
import { useWindowManager } from '../../composables/shared/useWindowManager';

const emit = defineEmits(['close', 'minimize']);
const { deletedItems, isLoading, restoreItem, hardDeleteItem, emptyTrash, loadItems } = usePapeleraExplorer();

const { isMaximized, windowStyle, centerWindow, onMouseDown, toggleMaximize } = useWindowManager({ defaultWidth: '700px', defaultHeight: '400px' }, 'papelera-explorer');

const contextMenu = ref({ visible: false, x: 0, y: 0, item: null });

const handleContextMenu = (e, item) => {
  contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, item: item };
};
const closeContextMenu = () => { contextMenu.value.visible = false; };

const handleRestore = () => {
  if (contextMenu.value.item) restoreItem(contextMenu.value.item);
  closeContextMenu();
};
const handleHardDelete = () => {
  if (contextMenu.value.item && confirm(`¿Eliminar permanentemente "${contextMenu.value.item.name}"?`)) {
    hardDeleteItem(contextMenu.value.item);
  }
  closeContextMenu();
};

onMounted(() => { centerWindow(); });
</script>