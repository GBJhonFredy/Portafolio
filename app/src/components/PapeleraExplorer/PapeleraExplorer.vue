<template>
  <div :class="embedded ? 'flex flex-col h-full w-full' : 'absolute inset-0 pointer-events-none'" @click="closeContextMenu">
         <div class="flex items-center gap-3 bg-slate-100 p-2 border-b border-slate-300 shadow-sm text-xs pointer-events-auto">
            <button @click="handleEmptyTrash" class="px-2 py-1 bg-slate-200 border border-slate-300 hover:bg-slate-300 rounded text-slate-700">Vaciar Papelera</button>
         </div>
         
         <!-- Contenido -->
         <div class="flex flex-wrap gap-6 p-4 content-start overflow-auto flex-1 pointer-events-auto">
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

         <!-- Menú Contextual -->
         <div v-if="contextMenu.visible"
              class="fixed bg-white border border-slate-300 shadow-md py-1 z-50 text-xs text-slate-800 flex flex-col min-w-[120px] pointer-events-auto"
              :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
              @click.stop>
            <button class="px-4 py-1.5 text-left hover:bg-sky-500 hover:text-white transition-colors" @click="handleRestore">Restaurar</button>
            <button class="px-4 py-1.5 text-left hover:bg-sky-500 hover:text-white transition-colors" @click="handleHardDelete">Eliminar</button>
         </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePapeleraExplorer } from '../../composables/PapeleraExplorer/usePapeleraExplorer';
import { useWindowManager } from '../../composables/shared/useWindowManager';

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'minimize']);
const { deletedItems, isLoading, restoreItem, hardDeleteItem, emptyTrash } = usePapeleraExplorer();

const { isMaximized, windowStyle, centerWindow, onMouseDown, toggleMaximize } = useWindowManager({ defaultWidth: '700px', defaultHeight: '400px' }, 'papelera-explorer');

const contextMenu = ref({ visible: false, x: 0, y: 0, item: null });

const handleContextMenu = (e, item) => {
  contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, item: item };
};
const closeContextMenu = () => { contextMenu.value.visible = false; };

const handleEmptyTrash = () => {
  if (deletedItems.value.length === 0) return;
  if (confirm('¿Seguro que desea eliminar de forma permanente todos los archivos?')) {
    emptyTrash();
  }
};

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