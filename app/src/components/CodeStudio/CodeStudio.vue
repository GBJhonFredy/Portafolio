<template>
  <!-- Ventana tipo VS Code -->
  <div
    class="absolute inset-0 pointer-events-none z-30"
  >
    <div
      class="pointer-events-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] window-pop flex flex-col overflow-hidden"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div
        class="h-8 shrink-0 bg-[#1e1e1e] flex items-center justify-between px-3 cursor-pointer border-b border-[#2d2d2d] select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 overflow-hidden text-xs text-slate-300">
          <svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC"/></svg>
          <span class="font-medium text-slate-200">
            Code Studio
          </span>
          <span v-if="activeProject" class="text-slate-400">
            - {{ activeProject.name }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <!-- Botón Ejecutar -->
          <button
            class="flex items-center gap-1.5 px-2 py-1 rounded text-slate-300 hover:bg-[#333333] hover:text-white transition-colors text-[11px]"
            title="Ejecutar / Vista previa"
            @click="runPreview"
            :disabled="!activeFile"
            :class="{ 'opacity-50 cursor-not-allowed': !activeFile }"
          >
            <svg viewBox="0 0 24 24" class="w-3 h-3 text-emerald-500" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Ejecutar
          </button>

          <!-- Controles de Ventana (Estilo Plano) -->
          <div class="flex items-center ml-1">
            <button
              class="w-8 h-8 flex items-center justify-center hover:bg-[#333333] text-slate-400 hover:text-slate-200 transition-colors rounded"
              @click.stop="$emit('minimize')"
              title="Minimizar"
            >
              <div class="w-2.5 h-[1px] bg-current"></div>
            </button>
            <button
              class="w-8 h-8 flex items-center justify-center hover:bg-[#333333] text-slate-400 hover:text-slate-200 transition-colors rounded"
              @click.stop="toggleMaximize"
              title="Maximizar"
            >
              <div class="w-2.5 h-2.5 border border-current"></div>
            </button>
            <button
              class="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-400 transition-colors rounded"
              @click.stop="$emit('close')"
              title="Cerrar"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Cuerpo de la ventana -->
      <div class="flex flex-1 min-h-0 overflow-hidden">
        <!-- Activity bar -->
        <div
          class="w-10 bg-slate-950 flex flex-col items-center py-3 gap-3 text-[14px]"
        >
          <button
            class="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-100"
            title="Explorer"
          >
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.3-4.3"></path>
          </svg>
          </button>
        </div>

        <!-- Explorer -->
        <div
          class="w-48 md:w-56 bg-slate-900 border-r border-slate-800 text-xs md:text-sm flex flex-col"
        >
          <div
            class="px-3 py-2 border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-400 flex items-center justify-between"
          >
            <span>Explorer</span>
            <button
              class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
              title="Nuevo proyecto"
              @click="createProject"
            >
              +
            </button>
          </div>

          <div
            class="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400"
          >
            Proyecto actual:
            <span class="text-slate-200 font-semibold">
              {{ activeProject ? activeProject.name : 'Sin proyecto' }}
            </span>
          </div>

          <!-- Estado de carga / error -->
          <div
            v-if="isLoading"
            class="px-3 py-2 text-[11px] text-slate-400 border-b border-slate-800"
          >
            Cargando proyectos desde Supabase...
          </div>
          <div
            v-else-if="loadError"
            class="px-3 py-2 text-[11px] text-red-400 border-b border-slate-800"
          >
            Error al cargar proyectos. Revisa la consola.
          </div>

          <!-- Panel nuevo archivo -->
          <div
            v-if="showNewFilePanel"
            class="px-3 py-2 border-b border-slate-800 flex flex-col gap-2 text-[11px] text-slate-200"
          >
            <label class="flex flex-col gap-1">
              <span>Nombre del archivo</span>
              <input
                v-model="newFileName"
                type="text"
                class="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] outline-none focus:border-sky-500"
                placeholder="ej
                : index.html"
              />
            </label>

            <label class="flex flex-col gap-1">
              <span>Tipo</span>
              <select
                v-model="newFileType"
                class="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] outline-none focus:border-sky-500"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
            </label>

            <div class="flex gap-2 mt-1">
              <button
                class="flex-1 px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-[11px]"
                @click="createFile"
              >
                Crear
              </button>
              <button
                class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px]"
                @click="cancelCreateFile"
              >
                Cancelar
              </button>
            </div>

            <p v-if="errorMessage" class="text-[10px] text-red-400 mt-1">
              {{ errorMessage }}
            </p>
          </div>

          <!-- Carpetas con sus archivos -->
          <div class="flex-1 overflow-auto">
            <div
              v-if="projects.length === 0 && !isLoading"
              class="px-3 py-3 text-[11px] text-slate-500"
            >
              No hay carpetas. Usa el botÃ³n "+" arriba para crear una.
            </div>

            <div
              v-else
              class="px-3 py-2 text-[11px] md:text-xs space-y-2"
            >
              <div
                v-for="project in projects"
                :key="project.id"
                class="space-y-1 group/project"
              >
                <!-- Fila de carpeta -->
                <div
                  class="w-full flex items-center justify-between px-1 py-0.5 rounded hover:bg-slate-800"
                  :class="
                    project.id === activeProjectId
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-300'
                  "
                >
                  <button
                    class="flex-1 text-left flex items-center gap-1 overflow-hidden"
                    @click="setActiveProject(project.id); toggleProjectCollapse(project.id)"
                  >
                    <div class="w-4 h-4 flex items-center justify-center shrink-0 rounded transition-transform" :class="{ '-rotate-90': isProjectCollapsed(project.id) }">
                      <svg viewBox="0 0 24 24" class="w-3 h-3 fill-current"><path d="M7 10l5 5 5-5z"/></svg>
                    </div>
                    <svg viewBox="0 0 32 32" class="w-3.5 h-3.5 shrink-0">
                      <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                      <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                    <span class="truncate">{{ project.name }}</span>
                  </button>
                  <div class="hidden group-hover/project:flex items-center gap-1.5 shrink-0 px-1">
                    <button @click.stop="renameProject(project.id, project.name)" class="text-slate-400 hover:text-sky-400" title="Renombrar">
                      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button @click.stop="deleteProject(project.id)" class="text-slate-400 hover:text-red-400" title="Eliminar">
                      <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>

                <!-- Archivos de esa carpeta -->
                <ul
                  v-if="!isProjectCollapsed(project.id)"
                  class="pl-4 space-y-0.5"
                >
                  <li v-if="projectFiles(project.id).length === 0" class="px-1 py-0.5 text-[10px] text-slate-500 italic select-none">
                    Carpeta vacía
                  </li>
                  <li
                    v-for="file in projectFiles(project.id)"
                    :key="file.id"
                    class="group/file flex items-center justify-between w-full px-1 py-0.5 rounded hover:bg-slate-800"
                    :class="
                      file.id === activeFileId
                        ? 'bg-slate-800 text-slate-100'
                        : 'text-slate-400'
                    "
                  >
                    <button
                      class="flex-1 text-left flex items-center gap-1 overflow-hidden"
                      @click="setActiveFile(file.id)"
                    >
                      <svg v-if="file.type === 'html'" viewBox="0 0 24 24" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l-2 2 2 2"></path><path d="M15 19l2-2-2-2"></path></svg>
                      <svg v-else-if="file.type === 'css'" viewBox="0 0 24 24" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#f472b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="10" cy="15" r="2"></circle><circle cx="14" cy="15" r="2"></circle></svg>
                      <svg v-else viewBox="0 0 24 24" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      <span class="truncate">{{ file.name }}</span>
                    </button>
                    <div class="hidden group-hover/file:flex items-center gap-1.5 shrink-0 px-1">
                      <button @click.stop="renameFile(file.id, file.name)" class="text-slate-500 hover:text-sky-400" title="Renombrar">
                        <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button @click.stop="deleteFile(file.id)" class="text-slate-500 hover:text-red-400" title="Eliminar">
                        <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor principal -->
        <div class="flex-1 flex flex-col bg-slate-900 text-[12px] md:text-sm">
          <div
            class="flex items-center justify-between px-3 py-1 border-b border-slate-800 text-[11px] text-slate-400"
          >
            <div>
              <span v-if="activeFile">
                Editando: {{ activeFile.name }}
              </span>
              <span v-else>
                Sin archivo abierto
              </span>
            </div>
            <button
              class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px]"
              @click="openNewFilePanel"
            >
              + Archivo
            </button>
          </div>

          <div class="flex-1">
            <div
              v-if="!activeFile"
              class="w-full h-full flex items-center justify-center text-slate-500 text-[12px] px-4 text-center"
            >
              Crea o selecciona un archivo en el panel izquierdo para empezar a
              escribir cÃ³digo.
            </div>

            <div
              v-else
              class="w-full h-full flex"
            >
              <div
                class="bg-slate-950/80 text-slate-500 text-right px-3 py-2 text-[11px] select-none min-w-[32px]"
              >
                <div
                  v-for="n in lineCount"
                  :key="n"
                >
                  {{ n }}
                </div>
              </div>

              <textarea
                v-model="activeFileContent"
                class="flex-1 bg-slate-900 text-slate-100 font-mono text-[12px] leading-relaxed px-3 py-2 outline-none border-none resize-none"
                spellcheck="false"
              ></textarea>
            </div>
          </div>

          <div
            class="h-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-3 text-[10px] text-slate-400"
          >
            <div class="flex items-center gap-3">
              <span v-if="activeFile">
                {{ activeFile.type.toUpperCase() }}
              </span>
              <span v-else>
                Sin archivo
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="isSaving" class="text-sky-400">Guardando...</span>
              <span v-else-if="saveSuccess" class="text-emerald-400">Guardado ✓</span>
              <span>LÃ­nea aprox: {{ lineCount }}</span>
              <span>Espacios: 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal simple de alerta -->
    <div
      v-if="showAlert"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto"
    >
      <div
        class="w-[320px] rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-2xl"
      >
        <div class="text-sm font-semibold text-slate-100 mb-2">
          Alerta
        </div>
        <p class="text-xs text-slate-300">
          {{ alertMessage }}
        </p>
        <div class="mt-4 flex.justify-end">
          <button
            class="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-xs"
            @click="showAlert = false"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useCodeStudio } from '../../composables/CodeStudio/useCodeStudio';

const emit = defineEmits(['close', 'minimize', 'run']);

const {
  isMaximized,
  windowStyle,
  centerWindow,
  onMouseDown,
  toggleMaximize
} = useWindowManager({
  defaultWidth: '960px',
  defaultHeight: '600px',
  defaultX: 20,
  defaultY: 20,
  maxWidth: '1100px',
  maxHeight: '700px'
}, 'code-studio');

const {
  projects,
  activeProjectId,
  activeProject,
  files,
  activeFileId,
  isLoading,
  loadError,
  showNewFilePanel,
  newFileName,
  newFileType,
  errorMessage,
  showAlert,
  alertMessage,
  activeFile,
  activeFileContent,
  isSaving,
  saveSuccess,
  lineCount,
  cancelCreateFile,
  openNewFilePanel,
  projectFiles,
  setActiveProject,
  setActiveFile,
  createProject,
  createFile,
  renameProject,
  deleteProject,
  renameFile,
  deleteFile,
  runPreview,
  toggleProjectCollapse,
  isProjectCollapsed
} = useCodeStudio(emit);

onMounted(() => {
  centerWindow();
  // El resto de la inicializacion ya esta en onMounted de useCodeStudio
});
</script>
