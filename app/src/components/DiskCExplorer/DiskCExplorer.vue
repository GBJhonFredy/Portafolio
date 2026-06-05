<template>
  <div class="flex flex-col h-full animate-fade-in relative" @click="closeContextMenu" @contextmenu="closeContextMenu">
    <!-- Barra de navegacion de ruta -->
    <div class="flex items-center gap-3 mb-4 bg-slate-100 p-1.5 border border-slate-300 rounded shadow-sm">
      <button 
        @click="currentPath === 'C:' ? $emit('back') : goBack()" 
        class="flex items-center justify-center w-6 h-6 hover:bg-slate-200 border border-transparent hover:border-slate-400 rounded text-slate-600 transition-colors"
        title="Atras"
      >
        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"/></svg>
      </button>
      <div class="h-4 w-px bg-slate-300"></div>
      <span class="text-slate-600 font-mono text-[11px] truncate">{{ currentPath }}</span>
    </div>

    <!-- Contenido en la raiz del disco C: -->
    <div v-if="currentPath === 'C:'" class="flex flex-wrap gap-6 p-2">
      <div 
        class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-2 transition-colors w-20" 
        @dblclick="openRepos"
      >
        <svg viewBox="0 0 32 32" class="w-12 h-12 drop-shadow-sm">
          <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M11 16h10M16 11l5 5-5 5" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[11px] text-slate-800 text-center leading-tight">Repos Code Studio</span>
      </div>
    </div>

    <!-- Contenido en C:\Repos Code Studio -->
    <div v-else-if="currentPath === 'C:\\Repos Code Studio'" class="flex flex-wrap gap-6 p-2 content-start">
      <div v-if="isLoading" class="w-full text-[11px] text-slate-500 py-4">Cargando repositorios desde Supabase...</div>
      <div v-else-if="projects.length === 0" class="w-full text-[11px] text-slate-500 py-4">No hay proyectos creados en Code Studio.</div>
      
      <div 
        v-for="proj in projects" 
        :key="proj.id" 
        class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-2 transition-colors w-20"
        @contextmenu.stop.prevent="handleContextMenu($event, proj)"
      >
        <svg viewBox="0 0 32 32" class="w-12 h-12 drop-shadow-sm">
          <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="10" y="16" width="12" height="8" rx="1" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/>
          <path d="M12 19l2 2 4-4" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[11px] text-slate-800 text-center w-full truncate" :title="proj.name">{{ proj.name }}</span>
      </div>
    </div>

    <!-- Menu Contextual -->
    <div
      v-if="contextMenu.visible"
      class="fixed z-50 w-48 bg-slate-50 border border-slate-400 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] py-1 text-slate-800 text-[11px]"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click.stop
    >
      <button
        class="w-full text-left px-4 py-1.5 hover:bg-sky-600 hover:text-white"
        @click="handleDelete"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDiskCExplorer } from '../../composables/DiskCExplorer/useDiskCExplorer';
import { supabase } from '../../supabaseClient';

const emit = defineEmits(['back']);
const { currentPath, projects, isLoading, openRepos, goBack } = useDiskCExplorer();

const contextMenu = ref({ visible: false, x: 0, y: 0, project: null });

const handleContextMenu = (e, proj) => {
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    project: proj
  };
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

const handleDelete = async () => {
  const proj = contextMenu.value.project;
  if (!proj) return;
  
  if (confirm(`¿Mover "${proj.name}" a la Papelera de reciclaje?`)) {
    try {
      const { error } = await supabase.from('code_projects').update({ is_deleted: true }).eq('id', proj.id);
      await supabase.from('code_files').update({ is_deleted: true }).eq('project_id', proj.id);
      if (!error) projects.value = projects.value.filter(p => p.id !== proj.id);
    } catch (e) {}
  }
  closeContextMenu();
};
</script>
