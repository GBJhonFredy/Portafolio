<template>
  <!-- Ventana Explorador de archivos Unificado -->
  <div
    class="absolute inset-0 pointer-events-none z-20"
  >
    <div
      class="window-pop bg-[#192438] p-[3px] shadow-[0_10px_30px_rgba(15,23,42,0.75)] pointer-events-auto rounded-t-xl rounded-b-md flex flex-col overflow-hidden"
      :style="windowStyle"
    >
      <!-- Barra de título estilo Windows (draggable) -->
      <div
        class="h-8 shrink-0 bg-[#192438] flex items-center justify-between px-2 cursor-pointer select-none cursor-move rounded-t-lg mb-[2px]"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          {{ nav.currentPath.value }}
        </span>

        <div class="flex items-center gap-0.5 shrink-0">
          <button
            class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#3d557d] to-[#192438] border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
            @click.stop="$emit('minimize')"
          >
            <div class="w-2.5 h-0.5 bg-white"></div>
          </button>
          <button
            class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#3d557d] to-[#192438] border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
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

      <!-- Contenedor interior beige -->
      <div class="flex-1 bg-[#ece9d8] overflow-hidden rounded-b-sm flex flex-col">
        <div class="bg-white h-full border border-[#aca899]  flex flex-col overflow-hidden rounded-sm shadow-inner relative">
          <!-- Barra de navegación -->
          <ExplorerNavBar 
            class="shrink-0"
            :can-go-back="nav.canGoBack.value"
            :can-go-forward="nav.canGoForward.value"
            :current-path="nav.currentPath.value"
            :current-icon="nav.currentIcon.value"
            @back="nav.goBack"
            @forward="nav.goForward"
            @up="nav.goUp"
          />

          <!-- Contenido del explorador -->
          <div class="flex flex-1 min-h-0 relative border-t border-[#aca899]">
            <!-- Panel izquierdo -->
            <ExplorerSidebar @navigate="handleNavigate" />

            <!-- Panel derecho (Contenido Dinámico) -->
            <div class="flex-1 text-xs md:text-sm bg-white overflow-auto relative flex flex-col">
              
              <div v-if="currentId === 'mi-pc'" class="p-4">
                <p class="font-semibold text-slate-800 mb-3">Mi PC</p>
                <!-- Fila de iconos: Mis documentos + Disco C -->
                <div class="flex flex-wrap gap-6 mb-6">
                  <!-- Mis documentos -->
                  <div
                    class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
                    @dblclick="handleNavigate('mis-documentos')"
                  >
                    <div class="w-12 h-12 flex items-center justify-center text-2xl">
                    <svg viewBox="0 0 32 32" class="w-11 h-11 drop-shadow-sm">
                      <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    <span class="text-[11px] md:text-xs text-slate-800">Mis documentos</span>
                  </div>
                </div>

                <!-- Estado del disco C (Barra) -->
                <div
                  class="flex items-center gap-4 border border-slate-300 rounded-md p-3 max-w-md bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  @dblclick="handleNavigate('disco-c')"
                >
                  <div class="flex flex-col items-center gap-1 shrink-0">
                    <div class="w-12 h-12 flex items-center justify-center text-2xl">
                      <svg viewBox="0 0 32 32" class="w-11 h-11 drop-shadow-sm">
                        <rect x="3" y="10" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                        <path d="M5 14h22v4H5v-4z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
                        <circle cx="8" cy="16" r="1.5" fill="#10b981"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-[11px] md:text-xs text-slate-800 font-semibold mb-1">Disco local (C:)</p>
                    <div class="w-full h-4 bg-slate-200 rounded-sm overflow-hidden mb-1 border border-slate-300">
                      <div class="h-full bg-sky-500 transition-all duration-1000 ease-out" :style="{ width: storagePercentage + '%' }"></div>
                    </div>
                    <p class="text-[11px] md:text-xs text-slate-600">Almacenamiento en Base de Datos usado: {{ storagePercentage }}%</p>
                  </div>
                </div>
              </div>

              <DiskCExplorer 
                v-else-if="currentId === 'disco-c' || currentId === 'disco-c-repos'"
                class="!absolute !inset-0 !z-10 !border-0 !shadow-none bg-white" 
                :view="currentId === 'disco-c' ? 'root' : 'repos'" 
                @navigate="handleNavigate" 
              />

              <MyDocsExplorer 
                v-else-if="currentId === 'mis-documentos'"
                class="!absolute !inset-0 !z-10 !border-0 !shadow-none bg-white" 
                @navigate="handleNavigate" 
              />

              <MyPictureExplorer 
                v-else-if="currentId === 'imagenes' || currentId === 'imagenes-aprendizaje'"
                class="!absolute !inset-0 !z-10 !border-0 !shadow-none bg-white" 
                :view="currentId"
                @navigate="handleNavigate" 
              />

              <MusicPlayerWindow 
                v-else-if="currentId === 'musica'"
                class="!absolute !inset-0 !z-10 !border-0 !shadow-none bg-white" 
                @navigate="handleNavigate" 
                @open-wmp="$emit('open-wmp')"
              />

              <PapeleraExplorer 
                v-else-if="currentId === 'papelera'"
                class="!absolute !inset-0 !z-10 !border-0 !shadow-none bg-white" 
                :embedded="true"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { supabase } from '../../supabaseClient';
import { useMyPcExplorer } from '../../composables/MyPcExplorer/useMyPcExplorer';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useExplorerNavigation } from '../../composables/ExplorerNavigation/useExplorerNavigation';
import DiskCExplorer from '../DiskCExplorer/DiskCExplorer.vue';
import MyDocsExplorer from '../MyDocsExplorer/MyDocsExplorer.vue';
import MyPictureExplorer from '../MyPictureExplorer/MyPictureExplorer.vue';
import MusicPlayerWindow from '../MusicPlayerWindow/MusicPlayerWindow.vue';
import PapeleraExplorer from '../PapeleraExplorer/PapeleraExplorer.vue';
import ExplorerNavBar from '../ExplorerNavBar/ExplorerNavBar.vue';
import ExplorerSidebar from '../ExplorerSidebar/ExplorerSidebar.vue';
import '../../styles/MyPcExplorer/MyPcExplorer.css';

const props = defineProps({
  initialPath: {
    type: String,
    default: 'mi-pc'
  }
});

const emit = defineEmits(['close', 'minimize', 'open-my-docs', 'navigate-to', 'open-wmp']);

const myPcLogic = useMyPcExplorer();

const currentId = ref(props.initialPath);
const storagePercentage = ref(0);

const handleNavigationEvent = (eventName, targetId) => {
  // Manejamos todas las rutas internas de exploración
  const internalRoutes = [
    'mi-pc', 'disco-c', 'disco-c-repos', 
    'mis-documentos', 'imagenes', 'imagenes-aprendizaje', 'musica',
    'papelera'
  ];
  
  if (internalRoutes.includes(targetId)) {
    currentId.value = targetId;
  } else {
    // Es una ruta externa (ej. 'proyectos' o 'wmp'), delegamos a XpDesktop
    emit('navigate-to', targetId);
  }
};

const nav = useExplorerNavigation(currentId, handleNavigationEvent);

// Y si cambia la prop initialPath externamente (para deep-linking)
watch(() => props.initialPath, (newVal) => {
  handleNavigationEvent('navigate', newVal);
});

const handleNavigate = (targetId) => {
  nav.navigateTo(targetId);
};

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize,
  centerWindow
} = useWindowManager({ defaultWidth: '900px', defaultHeight: '500px', maxWidth: '1100px' }, 'my-pc-explorer');

onMounted(() => {
  centerWindow();

  // Calcular aproximaciÃ³n del almacenamiento en base de datos
  const fetchStorage = async () => {
    try {
      const { data } = await supabase.from('code_files').select('content');
      let totalLength = 0;
      if (data) data.forEach(f => totalLength += (f.content?.length || 0));
      const MAX_CHARS = 100000; // Representa 100% de la capacidad de tu base de datos de "prueba"
      let percent = (totalLength / MAX_CHARS) * 100;
      storagePercentage.value = Math.min(percent, 100).toFixed(1);
    } catch (e) { console.error(e); }
  };
  fetchStorage();
});
</script>