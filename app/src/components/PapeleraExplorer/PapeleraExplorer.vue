<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 select-none cursor-move" @mousedown="onMouseDown">
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <span class="font-semibold">Papelera de reciclaje</span>
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