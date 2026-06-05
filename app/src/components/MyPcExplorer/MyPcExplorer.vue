<template>
  <!-- Ventana Explorador de archivos dentro de Mi PC -->
  <div
    class="absolute inset-0 pointer-events-none"
  >
    <div
      class="pointer-events-auto bg-slate-50 text-slate-900 border border-slate-400 shadow-[0_10px_30px_rgba(15,23,42,0.7)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título estilo Windows (draggable) -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-sky-700 text-white border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <span class="text-xs md:text-sm font-semibold">
          Explorador del Sistema
        </span>

        <div class="flex items-center gap-[2px]">
          <!-- Min -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="7" width="8" height="2" fill="currentColor"/></svg>
          </button>
          <!-- Max / Restore -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#2a65d5] hover:bg-[#437de5] border border-[#1b4db1] rounded-sm text-white"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            @click.stop="toggleMaximize"
          >
            <svg v-if="!isMaximized" width="9" height="9" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="1" width="8" height="2" fill="currentColor"/></svg>
            <svg v-else width="9" height="9" viewBox="0 0 10 10"><rect x="3" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="3" width="6" height="2" fill="currentColor"/></svg>
          </button>
          <!-- Close -->
          <button
            class="w-6 h-5 flex items-center justify-center bg-[#d93025] hover:bg-[#e8574d] border border-[#a1231a] rounded-sm text-white"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <!-- Contenido del explorador -->
      <div class="flex h-full">
        <!-- Panel izquierdo (árbol simple) -->
        <div
          class="w-1/3 min-w-[220px] border-r border-slate-300 bg-slate-100/80 p-3 text-xs md:text-sm"
        >
          <p class="font-semibold text-slate-800 mb-2">
            Mis sitios
          </p>

          <ul class="space-y-1">
            <li class="flex items-center gap-2 text-slate-800">
              <svg viewBox="0 0 32 32" class="w-4 h-4 inline-block align-middle shrink-0">
                <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
                <path d="M10 18.5h8v3h-8z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
                <path d="M6 21.5h16v2H6z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
                <rect x="23" y="6" width="6" height="16" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <circle cx="26" cy="9" r="1" fill="#10b981"/>
              </svg>
              <span>Mi PC</span>
            </li>
            <li class="flex items-center gap-2 text-slate-800">
              <svg viewBox="0 0 32 32" class="w-4 h-4 inline-block align-middle shrink-0">
                <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              <span>Mis documentos</span>
            </li>
            <li class="flex items-center gap-2 text-slate-800">
              <svg viewBox="0 0 32 32" class="w-4 h-4 inline-block align-middle shrink-0">
                <rect x="3" y="10" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                <path d="M5 14h22v4H5v-4z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
                <circle cx="8" cy="16" r="1.5" fill="#10b981"/>
              </svg>
              <span>Disco local (C:)</span>
            </li>
          </ul>
        </div>

        <!-- Panel derecho (contenido de Mi PC) -->
        <div class="flex-1 p-4 text-xs md:text-sm bg-white overflow-auto">
          <p class="font-semibold text-slate-800 mb-3">
            {{ currentRootPath }}
          </p>

          <template v-if="currentRootPath === 'Mi PC'">
          <!-- Fila de iconos: Mis documentos + Disco C -->
          <div class="flex flex-wrap gap-6 mb-6">
            <!-- Mis documentos: ahora avisa al escritorio, no abre ventana aquí -->
            <div
              class="flex flex-col items-center gap-1 cursor-pointer select-none hover:bg-slate-100 rounded-md p-1"
              @dblclick="$emit('open-my-docs')"
            >
              <div
                class="w-12 h-12 flex items-center justify-center text-2xl"
              >
              <svg viewBox="0 0 32 32" class="w-11 h-11 drop-shadow-sm">
                <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              </div>
              <span class="text-[11px] md:text-xs text-slate-800">
                Mis documentos
              </span>
            </div>
          </div>

          <!-- Estado del disco C (Barra) -->
          <div
            class="flex items-center gap-4 border border-slate-300 rounded-md p-3 max-w-md bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none"
            @dblclick="currentRootPath = 'Disco local (C:)'"
          >
            <!-- Icono dentro del contenedor -->
            <div class="flex flex-col items-center gap-1 shrink-0">
              <div class="w-12 h-12 flex items-center justify-center text-2xl">
                <svg viewBox="0 0 32 32" class="w-11 h-11 drop-shadow-sm">
                  <rect x="3" y="10" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                  <path d="M5 14h22v4H5v-4z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
                  <circle cx="8" cy="16" r="1.5" fill="#10b981"/>
                </svg>
              </div>
            </div>

            <!-- Barra e info -->
            <div class="flex-1">
              <p class="text-[11px] md:text-xs text-slate-800 font-semibold mb-1">
                Disco local (C:)
              </p>

              <div class="w-full h-4 bg-slate-200 rounded-sm overflow-hidden mb-1 border border-slate-300">
              <div
                class="h-full bg-sky-500 transition-all duration-1000 ease-out"
                :style="{ width: storagePercentage + '%' }"
              ></div>
            </div>

            <p class="text-[11px] md:text-xs text-slate-600">
              Almacenamiento en Base de Datos usado: {{ storagePercentage }}%
            </p>
            </div>
          </div>
          </template>

          <template v-else-if="currentRootPath === 'Disco local (C:)'">
            <DiskCExplorer @back="currentRootPath = 'Mi PC'" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabaseClient';
import { useMyPcExplorer } from '../../composables/MyPcExplorer/useMyPcExplorer';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import DiskCExplorer from '../DiskCExplorer/DiskCExplorer.vue';
import '../../styles/MyPcExplorer/MyPcExplorer.css';

const emit = defineEmits(['close', 'minimize', 'open-my-docs']);

const myPcLogic = useMyPcExplorer();

const currentRootPath = ref('Mi PC');
const storagePercentage = ref(0);

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize,
  centerWindow
} = useWindowManager({ defaultWidth: '900px', defaultHeight: '350px', maxWidth: '1100px' }, 'my-pc-explorer');

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