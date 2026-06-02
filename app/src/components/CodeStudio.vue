<template>
  <!-- Ventana tipo VS Code -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
  >
    <div
      class="pointer-events-auto bg-slate-900 text-slate-100 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] window-pop"
      :style="windowStyle"
    >
      <!-- Barra de título -->
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-100 border-b border-slate-900 select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <span class="font-semibold">
            Code Studio
          </span>
          <span v-if="activeFile" class="text-slate-400">
            - {{ activeFile.name }}
          </span>
        </div>

        <!-- Botón Ejecutar -->
        <button
          class="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-[11px] md:text-xs"
          title="Ejecutar / Vista previa"
          @click="runPreview"
        >
          ▶ Ejecutar
        </button>

        <div class="flex items-center gap-[2px] text-[9px]">
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-700 border border-slate-900 hover:bg-slate-600"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            ▃
          </button>
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-700 border border-slate-900 hover:bg-slate-600"
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            @click.stop="toggleMaximize"
          >
            ☐
          </button>
          <button
            class="w-5 h-4 flex items-center justify-center bg-red-600 border border-slate-900 hover:bg-red-500"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Cuerpo de la ventana -->
      <div class="flex h-full">
        <!-- Activity bar -->
        <div
          class="w-10 bg-slate-950 flex flex-col items-center py-3 gap-3 text-[14px]"
        >
          <button
            class="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-100"
            title="Explorer"
          >
            📁
          </button>
        </div>

        <!-- Explorer -->
        <div
          class="w-48 md:w-56 bg-slate-900 border-r border-slate-800 text-xs md:text-sm flex flex-col"
        >
          <div class="px-3 py-2 border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-400 flex items-center justify-between">
            <span>Explorer</span>
            <button
              class="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
              title="Nuevo archivo"
              @click="showNewFilePanel = !showNewFilePanel"
            >
              +
            </button>
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
                placeholder="ej: index.html"
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

          <!-- Lista de archivos -->
          <div class="flex-1 overflow-auto">
            <div
              v-if="files.length === 0"
              class="px-3 py-3 text-[11px] text-slate-500"
            >
              No hay archivos. Usa el botón "+" para crear uno.
            </div>

            <ul
              v-else
              class="px-3 py-2 text-[11px] md:text-xs space-y-1"
            >
              <li
                v-for="file in files"
                :key="file.id"
              >
                <button
                  class="w-full text-left flex items-center gap-1 px-1 py-0.5 rounded hover:bg-slate-800"
                  :class="file.id === activeFileId ? 'bg-slate-800 text-slate-100' : 'text-slate-300'"
                  @click="setActiveFile(file.id)"
                >
                  <span v-if="file.type === 'html'">📄</span>
                  <span v-else-if="file.type === 'css'">🎨</span>
                  <span v-else>⚙️</span>
                  <span class="truncate">{{ file.name }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Editor principal -->
        <div class="flex-1 flex flex-col bg-slate-900 text-[12px] md:text-sm">
          <div class="flex items-center justify-between px-3 py-1 border-b border-slate-800 text-[11px] text-slate-400">
            <div>
              <span v-if="activeFile">
                Editando: {{ activeFile.name }}
              </span>
              <span v-else>
                Sin archivo abierto
              </span>
            </div>
          </div>

          <div class="flex-1">
            <div
              v-if="!activeFile"
              class="w-full h-full flex items-center justify-center text-slate-500 text-[12px] px-4 text-center"
            >
              Crea o selecciona un archivo en el panel izquierdo para empezar a escribir código.
            </div>

            <div
              v-else
              class="w-full h-full flex"
            >
              <div class="bg-slate-950/80 text-slate-500 text-right px-3 py-2 text-[11px] select-none min-w-[32px]">
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

          <div class="h-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-3 text-[10px] text-slate-400">
            <div class="flex items-center gap-3">
              <span v-if="activeFile">
                {{ activeFile.type.toUpperCase() }}
              </span>
              <span v-else>
                Sin archivo
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span>Línea aprox: {{ lineCount }}</span>
              <span>Espacios: 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';

const emit = defineEmits(['close', 'minimize', 'run']);

/* ---- VENTANA (drag + maximizar) ---- */

const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
let startMouseX = 0;
let startMouseY = 0;
let startPosX = 0;
let startPosY = 0;

const isMaximized = ref(true);
const savedPosX = ref(0);
const savedPosY = ref(0);
const savedWidth = ref('900px');
const savedHeight = ref('600px');

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      width: '100%',
      height: '100%',
      transform: 'translate(0, 0)',
    };
  }

  return {
    width: savedWidth.value,
    height: savedHeight.value,
    maxWidth: '1100px',
    maxHeight: '700px',
    transform: 'translate(' + posX.value + 'px, ' + posY.value + 'px)',
  };
});

const centerWindow = () => {
  posX.value = 20;
  posY.value = 20;
  savedWidth.value = '960px';
  savedHeight.value = '600px';
};

const onMouseMove = (event) => {
  if (!isDragging.value || isMaximized.value) return;

  const dx = event.clientX - startMouseX;
  const dy = event.clientY - startMouseY;

  posX.value = startPosX + dx;
  posY.value = startPosY + dy;
};

const onMouseUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const onMouseDown = (event) => {
  if (event.button !== 0 || isMaximized.value) return;

  isDragging.value = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  startPosX = posX.value;
  startPosY = posY.value;

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

onMounted(() => {
  centerWindow();
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

const toggleMaximize = () => {
  if (!isMaximized.value) {
    savedPosX.value = posX.value;
    savedPosY.value = posY.value;
    isMaximized.value = true;
  } else {
    isMaximized.value = false;
    posX.value = savedPosX.value;
    posY.value = savedPosY.value;
  }
};

/* ---- ARCHIVOS ---- */

let nextId = 1;

const files = ref([]); // { id, name, type, content }
const activeFileId = ref(null);

const showNewFilePanel = ref(false);
const newFileName = ref('');
const newFileType = ref('html');
const errorMessage = ref('');

const activeFile = computed(() =>
  files.value.find((f) => f.id === activeFileId.value) || null
);

const activeFileContent = computed({
  get() {
    return activeFile.value ? activeFile.value.content : '';
  },
  set(value) {
    if (activeFile.value) {
      activeFile.value.content = value;
    }
  },
});

const lineCount = computed(() => {
  if (!activeFile.value || !activeFile.value.content) return 1;
  return activeFile.value.content.split('\n').length;
});

const resetNewFileForm = () => {
  newFileName.value = '';
  newFileType.value = 'html';
  errorMessage.value = '';
};

const cancelCreateFile = () => {
  showNewFilePanel.value = false;
  resetNewFileForm();
};

const createFile = () => {
  errorMessage.value = '';

  const name = newFileName.value.trim();
  const type = newFileType.value;

  if (!name) {
    errorMessage.value = 'El archivo necesita un nombre.';
    return;
  }

  if (type === 'html' && !name.endsWith('.html')) {
    errorMessage.value = 'Para HTML, usa una extensión .html';
    return;
  }
  if (type === 'css' && !name.endsWith('.css')) {
    errorMessage.value = 'Para CSS, usa una extensión .css';
    return;
  }
  if (type === 'js' && !name.endsWith('.js')) {
    errorMessage.value = 'Para JS, usa una extensión .js';
    return;
  }

  const exists = files.value.some((f) => f.name === name);
  if (exists) {
    errorMessage.value = 'Ya existe un archivo con ese nombre.';
    return;
  }

  const newFile = {
    id: nextId++,
    name,
    type,
    content: '',
  };

  files.value.push(newFile);
  activeFileId.value = newFile.id;
  showNewFilePanel.value = false;
  resetNewFileForm();
};

const setActiveFile = (id) => {
  activeFileId.value = id;
};

/* ---- EJECUTAR / PREVIEW ---- */
/* Construye HTML a partir de lo que escribas en .html, .css y .js */

const buildHtmlDocument = () => {
  const htmlFile = files.value.find((f) => f.type === 'html');
  const cssFile = files.value.find((f) => f.type === 'css');
  const jsFile = files.value.find((f) => f.type === 'js');

  const htmlContent = htmlFile ? htmlFile.content : '';
  const cssContent = cssFile ? cssFile.content : '';
  const jsContent = jsFile ? jsFile.content : '';

  // JS envuelto, sin usar etiquetas de cierre peligrosas
  const jsWrapper = jsContent
    ? 'window.addEventListener("load", function(){\n' + jsContent + '\n});'
    : '';

  const finalHtml =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta charset="UTF-8" />' +
    '<title>Preview</title>' +
    (cssContent ? '<style>' + cssContent + '</style>' : '') +
    '</head>' +
    '<body>' +
    (htmlContent || '<h1>Sin HTML todavía</h1>') +
    '<script>' +
    jsWrapper +
    '<' + '/script>' +
    '</body>' +
    '</html>';

  return finalHtml;
};

const runPreview = () => {
  const html = buildHtmlDocument();
  emit('run', html);
};
</script>