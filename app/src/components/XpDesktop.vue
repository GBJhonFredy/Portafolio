<template>
  <div
    class="relative w-screen h-screen overflow-hidden font-sans text-slate-100"
  >
    <!-- FONDO XP -->
    <div class="absolute inset-0 -z-20">
      <div
        class="w-full h-full bg-cover bg-center bg-container-image"
        style="background-image: url('/xp-bliss.avif');"
      ></div>
      <div class="absolute inset-0 bg-sky-900/20 mix-blend-multiply"></div>
    </div>

    <div class="absolute inset-0 -z-10 bg-slate-900/10"></div>

    <div class="relative w-full h-full flex flex-col">
      <!-- Escritorio -->
      <div class="flex-1 px-3 py-3 md:px-5 md:py-4 relative z-0">
        <div class="h-full flex justify-between items-stretch">
          <!-- Iconos izquierda -->
          <div class="flex flex-col gap-4 text-xs md:text-sm select-none pt-1">
            <!-- Mi PC -->
            <button
              class="desktop-icon group"
              @click="openWindow('mi-pc')"
            >
              <div class="icon-bg">
                <svg
                  viewBox="0 0 24 24"
                  class="w-8 h-8 text-sky-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="12"
                    rx="1.5"
                    class="fill-sky-300/90 group-hover:fill-sky-200"
                  />
                  <rect
                    x="6"
                    y="7"
                    width="12"
                    height="6"
                    class="fill-slate-900/80"
                  />
                  <rect
                    x="10"
                    y="17"
                    width="4"
                    height="1.5"
                    class="fill-slate-200/90"
                  />
                </svg>
              </div>
              <span class="icon-label">
                Mi PC
              </span>
            </button>

            <!-- Explorador de archivos -->
            <button
              class="desktop-icon group"
              @click="openWindow('explorador')"
            >
              <div class="icon-bg">
                <svg
                  viewBox="0 0 24 24"
                  class="w-8 h-8 text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                >
                  <path
                    d="M3 7.5A1.5 1.5 0 0 1 4.5 6h5.4a1.5 1.5 0 0 1 1.06.44l1.1 1.12H19.5A1.5 1.5 0 0 1 21 9.06V17A1.5 1.5 0 0 1 19.5 18.5h-15A1.5 1.5 0 0 1 3 17V7.5Z"
                    class="fill-amber-300/90 group-hover:fill-amber-200"
                  />
                </svg>
              </div>
              <span class="icon-label">
                Explorador de archivos
              </span>
            </button>

            <!-- Code Studio -->
            <button
              class="desktop-icon group"
              @click="openWindow('code')"
            >
              <div class="icon-bg">
                <div
                  class="w-8 h-8 rounded-[6px] bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                >
                  <span class="text-white text-lg font-bold">
                    &lt;/&gt;
                  </span>
                </div>
              </div>
              <span class="icon-label">
                Code Studio
              </span>
            </button>

            <!-- Navegador (Firefox) -->
            <button
              class="desktop-icon group"
              @click="handleFirefoxIconClick"
            >
              <div class="icon-bg">
                <svg
                  viewBox="0 0 24 24"
                  class="w-8 h-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="6.5"
                    class="fill-indigo-500/90"
                  />
                  <path
                    d="M8 15.5c.7 1.2 2 2 3.6 2 2.4 0 4.4-1.9 4.4-4.3 0-1.9-1.2-3.3-2.7-4.1.4.6.6 1.2.6 1.8-1-1.2-2.3-1.7-3.6-1.7-1.4 0-2.5.6-3.3 1.5-.6.7-1 1.7-1 2.7 0 0.8.2 1.6.6 2.1.3-.8.9-1.4 1.4-1.7-.3.8-.2 1.6.2 2.2Z"
                    class="fill-orange-400"
                  />
                  <path
                    d="M8.4 7.3c.9-1 2-1.7 3.6-1.7 1.1 0 2.1.4 3 .9-.4-.8-.9-1.5-1.6-2.1C12.4 4 11.4 3.7 10.4 3.7c-.7 0-1.4.1-2 .4-.5.8-.9 1.7-1.1 2.7.4-.3.8-.5 1.1-.7Z"
                    class="fill-amber-300"
                  />
                </svg>
              </div>
              <span class="icon-label">
                Firefox
              </span>
            </button>
          </div>

          <!-- Papelera -->
          <div class="flex items-end">
            <div class="pr-1 pb-2 md:pr-2 md:pb-3">
              <button
                class="desktop-icon group"
                @click="openWindow('papelera')"
              >
                <div class="icon-bg">
                  <svg
                    viewBox="0 0 24 24"
                    class="w-8 h-8 text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                  >
                    <rect
                      x="8"
                      y="6"
                      width="8"
                      height="12"
                      rx="1.5"
                      class="fill-slate-200/90 group-hover:fill-slate-100"
                    />
                    <rect
                      x="7"
                      y="5"
                      width="10"
                      height="2"
                      rx="0.8"
                      class="fill-slate-300/90"
                    />
                    <path
                      d="M10 8.5v6.5M12 8.5v6.5M14 8.5v6.5"
                      stroke="#0f172a"
                      stroke-width="1"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <span class="icon-label">
                  Papelera de reciclaje
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Ventanas -->

        <!-- Mi PC -->
        <div
          v-if="isMyPcOpen && !isMyPcMinimized"
          class="absolute inset-0 pointer-events-none z-10"
        >
          <TerminalHero
            v-if="!hasContinuedToExplorer"
            class="pointer-events-auto"
            @close="handleMyPcClose"
            @minimize="handleMyPcMinimize"
            @maximize="handleMyPcMaximize"
            @continue="goToExplorer"
          />

          <MyPcExplorer
            v-else
            class="pointer-events-auto"
            @close="handleMyPcClose"
            @minimize="handleMyPcMinimize"
            @maximize="handleMyPcMaximize"
            @open-my-docs="openWindow('explorador')"
          />
        </div>

        <!-- Explorador (Mis documentos) -->
        <MyDocsExplorer
          v-if="isExplorerOpen && !isExplorerMinimized"
          class="absolute inset-0 z-15 pointer-events-none"
          @close="handleExplorerClose"
          @minimize="handleExplorerMinimize"
        />

        <!-- Code Studio -->
        <CodeStudio
          v-if="isCodeOpen && !isCodeMinimized"
          class="absolute inset-0 z-25 pointer-events-none"
          @close="handleCodeClose"
          @minimize="handleCodeMinimize"
          @run="openBrowserWithHtml"
        />

        <!-- Firefox Preview (para Code Studio) -->
        <BrowserWindow
          v-if="isBrowserOpen && !isBrowserMinimized"
          class="absolute inset-0 z-30 pointer-events-none"
          :html-document="browserHtml"
          @close="handleBrowserClose"
          @minimize="handleBrowserMinimize"
        />

        <!-- Navegador XP (iframe interno) -->
        <XpBrowser
          v-if="isXpBrowserOpen && !isXpBrowserMinimized"
          class="absolute inset-0 z-30 pointer-events-none"
          @close="handleXpBrowserClose"
          @minimize="handleXpBrowserMinimize"
        />
      </div>

      <!-- BARRA DE TAREAS -->
      <div
        class="h-11 md:h-12 w-full bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 border-t border-slate-900/90 flex items-center justify-between px-2 md:px-3 shadow-[0_-4px_10px_rgba(0,0,0,0.7)] relative z-20"
      >
        <!-- Inicio -->
        <button
          class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 border border-emerald-700 shadow-[0_2px_6px_rgba(0,0,0,0.8)] active:translate-y-[1px] active:shadow-sm transition-all"
        >
          <span
            class="inline-flex items-center justify-center w-5 h-5 rounded-md bg-sky-100/95 border border-white/80 overflow-hidden"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-4 h-4 text-sky-700"
            >
              <path
                d="M4 5.5 11 4v7H4V5.5Z"
                fill="#0ea5e9"
              />
              <path
                d="M13 3.7 20 2.7V11h-7V3.7Z"
                fill="#22d3ee"
              />
              <path
                d="M4 13h7v7l-7-1.1V13Z"
                fill="#0ea5e9"
              />
              <path
                d="M13 13h7v6.3L13 18v-5Z"
                fill="#38bdf8"
              />
            </svg>
          </span>
        </button>

        <!-- Botones de ventanas abiertas -->
        <div
          class="flex-1 mx-2 flex items-center gap-1 overflow-hidden"
        >
          <!-- Mi PC -->
          <button
            v-if="isMyPcOpen"
            class="px-3 py-1.5 rounded-sm border text-[11px] md:text-xs truncate shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            :class="isMyPcMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleMyPcFromTaskbar"
          >
            Mi PC
          </button>

          <!-- Explorador -->
          <button
            v-if="isExplorerOpen"
            class="px-3 py-1.5 rounded-sm border text-[11px] md:text-xs truncate shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            :class="isExplorerMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleExplorerFromTaskbar"
          >
            Explorador de archivos
          </button>

          <!-- Code Studio -->
          <button
            v-if="isCodeOpen"
            class="px-3 py-1.5 rounded-sm border text-[11px] md:text-xs truncate shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            :class="isCodeMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleCodeFromTaskbar"
          >
            Code Studio
          </button>

          <!-- Firefox Preview -->
          <button
            v-if="isBrowserOpen"
            class="px-3 py-1.5 rounded-sm border text-[11px] md:text-xs truncate shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            :class="isBrowserMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleBrowserFromTaskbar"
          >
            Firefox Preview
          </button>

          <!-- Navegador XP -->
          <button
            v-if="isXpBrowserOpen"
            class="px-3 py-1.5 rounded-sm border text-[11px] md:text-xs truncate shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            :class="isXpBrowserMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleXpBrowserFromTaskbar"
          >
            Navegador XP
          </button>
        </div>

        <!-- Reloj -->
        <div
          class="flex items-center gap-2 text-[11px] md:text-xs text-slate-200"
        >
          <div class="flex items-center gap-1">
            <div
              class="w-4 h-4 rounded-sm bg-slate-900/80 border border-slate-500/70 flex items-center justify-center text-[9px]"
            >
              🔈
            </div>
            <div
              class="w-4 h-4 rounded-sm bg-slate-900/80 border border-slate-500/70 flex items-center justify-center text-[9px]"
            >
              🌐
            </div>
          </div>

          <div
            class="px-2 py-0.5 rounded-sm bg-slate-900/60 border border-slate-600/80 text-[11px] md:text-xs"
          >
            {{ timeText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TerminalHero from './TerminalHero.vue';
import MyPcExplorer from './MyPcExplorer.vue';
import MyDocsExplorer from './MyDocsExplorer.vue';
import CodeStudio from './CodeStudio.vue';
import BrowserWindow from './BrowserWindow.vue';
import XpBrowser from './XpBrowser.vue';

const timeText = ref('');
let intervalId = null;

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  timeText.value = `${hours}:${minutes}`;
};

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 30000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

/* -------- MI PC -------- */

const isMyPcOpen = ref(false);
const isMyPcMinimized = ref(false);
const hasContinuedToExplorer = ref(false);

let lastClickTimeMyPc = 0;
const doubleClickDelay = 300;

const handleMyPcClick = () => {
  const now = Date.now();
  if (now - lastClickTimeMyPc < doubleClickDelay) {
    isMyPcOpen.value = true;
    isMyPcMinimized.value = false;
    hasContinuedToExplorer.value = false;
  }
  lastClickTimeMyPc = now;
};

const handleMyPcClose = () => {
  isMyPcOpen.value = false;
  isMyPcMinimized.value = false;
  hasContinuedToExplorer.value = false;
};

const handleMyPcMinimize = () => {
  isMyPcMinimized.value = true;
};

const handleMyPcMaximize = () => {
  isMyPcOpen.value = true;
  isMyPcMinimized.value = false;
};

const toggleMyPcFromTaskbar = () => {
  if (isMyPcMinimized.value) {
    isMyPcMinimized.value = false;
  } else {
    isMyPcMinimized.value = true;
  }
};

const goToExplorer = () => {
  hasContinuedToExplorer.value = true;
};

/* -------- EXPLORADOR -------- */

const isExplorerOpen = ref(false);
const isExplorerMinimized = ref(false);

const openExplorer = () => {
  isExplorerOpen.value = true;
  isExplorerMinimized.value = false;
};

const handleExplorerClose = () => {
  isExplorerOpen.value = false;
  isExplorerMinimized.value = false;
};

const handleExplorerMinimize = () => {
  isExplorerMinimized.value = true;
};

const toggleExplorerFromTaskbar = () => {
  if (isExplorerMinimized.value) {
    isExplorerMinimized.value = false;
  } else {
    isExplorerMinimized.value = true;
  }
};

/* -------- CODE STUDIO -------- */

const isCodeOpen = ref(false);
const isCodeMinimized = ref(false);

const openCode = () => {
  isCodeOpen.value = true;
  isCodeMinimized.value = false;
};

const handleCodeClose = () => {
  isCodeOpen.value = false;
  isCodeMinimized.value = false;
};

const handleCodeMinimize = () => {
  isCodeMinimized.value = true;
};

const toggleCodeFromTaskbar = () => {
  if (isCodeMinimized.value) {
    isCodeMinimized.value = false;
  } else {
    isCodeMinimized.value = true;
  }
};

/* -------- FIREFOX PREVIEW (para Code Studio) -------- */

const isBrowserOpen = ref(false);
const isBrowserMinimized = ref(false);
const browserHtml = ref('<!DOCTYPE html><html><body><h1>Vista previa vacía</h1></body></html>');

const openBrowserWithHtml = (html) => {
  browserHtml.value = html;
  isBrowserOpen.value = true;
  isBrowserMinimized.value = false;
};

const handleBrowserClose = () => {
  isBrowserOpen.value = false;
  isBrowserMinimized.value = false;
};

const handleBrowserMinimize = () => {
  isBrowserMinimized.value = true;
};

const toggleBrowserFromTaskbar = () => {
  if (isBrowserMinimized.value) {
    isBrowserMinimized.value = false;
  } else {
    isBrowserMinimized.value = true;
  }
};

/* -------- NAVEGADOR XP (iframe interno) -------- */

const isXpBrowserOpen = ref(false);
const isXpBrowserMinimized = ref(false);

const handleXpBrowserOpen = () => {
  isXpBrowserOpen.value = true;
  isXpBrowserMinimized.value = false;
};

const handleXpBrowserClose = () => {
  isXpBrowserOpen.value = false;
  isXpBrowserMinimized.value = false;
};

const handleXpBrowserMinimize = () => {
  isXpBrowserMinimized.value = true;
};

const toggleXpBrowserFromTaskbar = () => {
  if (isXpBrowserMinimized.value) {
    isXpBrowserMinimized.value = false;
  } else {
    isXpBrowserMinimized.value = true;
  }
};

let lastClickTimeFirefox = 0;

const handleFirefoxIconClick = () => {
  const now = Date.now();
  const delay = 300;

  if (now - lastClickTimeFirefox < delay) {
    handleXpBrowserOpen();
  }

  lastClickTimeFirefox = now;
};

/* -------- ICONOS ESCRITORIO -------- */

const openWindow = (key) => {
  if (key === 'mi-pc') {
    handleMyPcClick();
  } else if (key === 'explorador') {
    openExplorer();
  } else if (key === 'code') {
    openCode();
  } else {
    console.log('Abrir ventana (pendiente implementar):', key);
  }
};
</script>

<style scoped>
.desktop-icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  color: inherit;
}

.icon-bg {
  padding: 0.1rem;
}

.icon-label {
  padding: 1px 4px;
  background-color: rgba(15, 23, 42, 0.6);
  border-radius: 4px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>