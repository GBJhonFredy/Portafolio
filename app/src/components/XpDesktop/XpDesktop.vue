<template>
  <div class="relative w-screen h-screen overflow-hidden font-sans text-slate-100" @click="closeContextMenu" @contextmenu.prevent="handleDesktopContextMenu($event)">
    <ShutdownScreen v-if="powerState === 'shutting-down'" />
    <PowerOffScreen v-else-if="powerState === 'off'" @power-on="handlePowerOn" />
    <BootLoadingScreen v-else-if="powerState === 'booting'" />
    <RestartConfirmDialog
      v-else-if="showRestartConfirm"
      @confirm="confirmRestart"
      @cancel="cancelRestart"
    />
    <LockScreen
      v-else-if="isLocked"
      @unlock="handleUnlock"
      @restart="handleRestart"
      @shutdown="handleShutdown"
    />
 
    <template v-else>
    <!-- FONDO XP -->
    <div class="absolute inset-0 -z-20">
      <div
        class="w-full h-full bg-cover bg-center bg-container-image"
        :style="{ backgroundImage: `url('${customBackground || '/xp-bliss.avif'}')` }"
      ></div>
      <div class="absolute inset-0 bg-sky-900/20 mix-blend-multiply"></div>
    </div>

    <div class="absolute inset-0 -z-10 bg-slate-900/10"></div>

    <div class="relative w-full h-full flex flex-col">
      <!-- Escritorio -->
      <div class="flex-1 px-3 py-3 md:px-5 md:py-4 relative z-0">
        <!-- Contenedor de iconos -->
        <div class="absolute inset-0 z-0 p-3 md:p-4">
          <!-- Mi PC -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['mi-pc'].x}px, ${iconPositions['mi-pc'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'mi-pc')"
            @click="handleIconClick($event, () => openWindow('mi-pc'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
                <path d="M10 18.5h8v3h-8z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
                <path d="M6 21.5h16v2H6z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
                <rect x="23" y="6" width="6" height="16" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <circle cx="26" cy="9" r="1" fill="#10b981"/>
              </svg>
            </div>
            <span class="icon-label">Mi PC</span>
          </button>

          <!-- Explorador de archivos -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['explorador'].x}px, ${iconPositions['explorador'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'explorador')"
            @click="handleIconClick($event, () => openWindow('explorador'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="icon-label">Explorador de archivos</span>
          </button>

          <!-- Code Studio -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['code'].x}px, ${iconPositions['code'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'code')"
            @click="handleIconClick($event, () => openWindow('code'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M6 4h14l6 6v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M20 4v6h6" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M10 14h12M10 18h12M10 22h8" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="icon-label">Code Studio</span>
          </button>

          <!-- Navegador (Firefox) -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['firefox'].x}px, ${iconPositions['firefox'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'firefox')"
            @click="handleIconClick($event, handleFirefoxIconClick)"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#1e3a8a" stroke-width="1"/>
                <path d="M16 4v24M4 16h24" stroke="#60a5fa" stroke-width="0.5"/>
                <path d="M4 16c0-8 15-12 24-4M8 26c10 8 20 2 20-10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" fill="none"/>
                <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">e</text>
              </svg>
            </div>
            <span class="icon-label">Internet</span>
          </button>

          <!-- Papelera -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['papelera'].x}px, ${iconPositions['papelera'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'papelera')"
            @click="handleIconClick($event, () => openPapelera())"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M8 8h16l-2 18H10L8 8z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M6 6h20v3H6z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                <path d="M12 3h8v3h-8z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
                <path d="M13 11v12M16 11v12M19 11v12" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="icon-label">Papelera de reciclaje</span>
          </button>
        </div>

        <!-- Ventanas -->

        <!-- PowerShell -->
        <div
          v-if="isPowerShellOpen && !isPowerShellMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('powershell') || 36 }"
          @mousedown="activateWindow('powershell')"
        >
          <TerminalHero
            class="pointer-events-auto"
            @close="handlePowerShellClose"
            @minimize="handlePowerShellMinimize"
            @continue="handlePowerShellClose"
          />
        </div>

        <!-- Mi PC -->
        <div
          v-if="isMyPcOpen && !isMyPcMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('my-pc') }"
          @mousedown="activateWindow('my-pc')"
        >
          <MyPcExplorer
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
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('explorer') }"
          @mousedown="activateWindow('explorer')"
          @close="handleExplorerClose"
          @minimize="handleExplorerMinimize"
          @open-music="openMusic"
          @open-pictures="openPictureExplorer"
        />

        <!-- Code Studio -->
        <CodeStudio
          v-if="isCodeOpen && !isCodeMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('code') }"
          @mousedown="activateWindow('code')"
          @close="handleCodeClose"
          @minimize="handleCodeMinimize"
          @run="openBrowserWithHtml"
        />

        <!-- Firefox Preview (para Code Studio) -->
        <BrowserWindow
          v-if="isBrowserOpen && !isBrowserMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('browser') }"
          @mousedown="activateWindow('browser')"
          :html-document="browserHtml"
          @close="handleBrowserClose"
          @minimize="handleBrowserMinimize"
        />

        <!-- Navegador XP (iframe interno) -->
        <XpBrowser
          v-if="isXpBrowserOpen && !isXpBrowserMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('xp-browser') }"
          @mousedown="activateWindow('xp-browser')"
          @close="handleXpBrowserClose"
          @minimize="handleXpBrowserMinimize"
        />

        <!-- Ventana MÃºsica -->
        <MusicPlayerWindow
          v-if="isMusicOpen"
          v-show="!isMusicMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('music') }"
          @mousedown="activateWindow('music')"
          @close="handleMusicClose"
          @minimize="handleMusicMinimize"
        />

        <!-- Papelera de Reciclaje -->
        <PapeleraExplorer
          v-if="isPapeleraOpen && !isPapeleraMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('papelera') || 35 }"
          @mousedown="activateWindow('papelera')"
          @close="handlePapeleraClose"
          @minimize="handlePapeleraMinimize"
        />

        <!-- Picture Explorer (Imágenes) -->
        <MyPictureExplorer
          v-if="isPictureExplorerOpen && !isPictureExplorerMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('picture-explorer') || 37 }"
          @mousedown="activateWindow('picture-explorer')"
          @close="handlePictureExplorerClose"
          @minimize="handlePictureExplorerMinimize"
        />

        <!-- Marca de agua de Activación -->
        <div class="absolute bottom-6 right-6 z-[9999] pointer-events-none select-none text-right font-sans">
          <p class="text-xl md:text-2xl text-white/50 font-normal tracking-wide drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            Activar Portafolio
          </p>
          <p class="text-xs md:text-sm text-white/50 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1">
            Contacta con el administrador para activar Portafolio.
          </p>
        </div>
      </div>

      <!-- BARRA DE TAREAS -->
      <div
        class="h-11 md:h-12 w-full bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 border-t border-slate-900/90 flex items-center justify-between px-2 md:px-3 shadow-[0_-4px_10px_rgba(0,0,0,0.7)] relative z-20"
      >
        <StartMenu
          @open-my-pc="handleStartOpenMyPc"
          @open-powershell="openPowerShell"
          @lock="handleLock"
          @restart="handleRestart"
          @shutdown="handleShutdown"
        />

        <!-- Botones de ventanas abiertas -->
        <div
          class="flex-1 mx-2 flex items-center gap-1 overflow-hidden"
        >
          <!-- Mi PC -->
          <button
            v-if="isMyPcOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isMyPcMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleMyPcFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
              <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
              <path d="M10 18.5h8v3h-8z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
              <path d="M6 21.5h16v2H6z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
              <rect x="23" y="6" width="6" height="16" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
              <circle cx="26" cy="9" r="1" fill="#10b981"/>
            </svg>
            <span class="truncate">Mi PC</span>
          </button>

          <!-- Explorador -->
          <button
            v-if="isExplorerOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isExplorerMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleExplorerFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="truncate">Explorador de archivos</span>
          </button>

          <!-- Code Studio -->
          <button
            v-if="isCodeOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isCodeMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleCodeFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M6 4h14l6 6v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M20 4v6h6" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M10 14h12M10 18h12M10 22h8" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="truncate">Code Studio</span>
          </button>

          <!-- Firefox Preview -->
          <button
            v-if="isBrowserOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isBrowserMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleBrowserFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#1e3a8a" stroke-width="1"/>
              <path d="M16 4v24M4 16h24" stroke="#60a5fa" stroke-width="0.5"/>
              <path d="M4 16c0-8 15-12 24-4M8 26c10 8 20 2 20-10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" fill="none"/>
              <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">e</text>
            </svg>
            <span class="truncate">Firefox Preview</span>
          </button>

          <!-- Navegador XP -->
          <button
            v-if="isXpBrowserOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isXpBrowserMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleXpBrowserFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#1e3a8a" stroke-width="1"/>
              <path d="M16 4v24M4 16h24" stroke="#60a5fa" stroke-width="0.5"/>
              <path d="M4 16c0-8 15-12 24-4M8 26c10 8 20 2 20-10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" fill="none"/>
              <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">e</text>
            </svg>
            <span class="truncate">Navegador XP</span>
          </button>

          <!-- MÃºsica -->
          <button
            v-if="isMusicOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isMusicMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleMusicFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M14 22a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm0 0v-7h6v2h-4v5z" fill="#ef4444" stroke="#991b1b" stroke-width="1" stroke-linejoin="round"/>
            </svg>
            <span class="truncate">Música</span>
          </button>

          <!-- Imágenes -->
          <button
            v-if="isPictureExplorerOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isPictureExplorerMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="togglePictureExplorerFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <rect x="10" y="15" width="12" height="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1"/>
              <circle cx="13" cy="18" r="1.5" fill="#fde047"/>
              <path d="M10 23l4-3 2 1 3-4 3 6z" fill="#10b981"/>
            </svg>
            <span class="truncate">Imágenes</span>
          </button>

          <!-- Papelera -->
          <button
            v-if="isPapeleraOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isPapeleraMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="togglePapeleraFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M8 8h16l-2 18H10L8 8z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M6 6h20v3H6z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
              <path d="M12 3h8v3h-8z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
              <path d="M13 11v12M16 11v12M19 11v12" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="truncate">Papelera de reciclaje</span>
          </button>

          <!-- PowerShell -->
          <button
            v-if="isPowerShellOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isPowerShellMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="togglePowerShellFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <rect x="2" y="6" width="28" height="20" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
              <path d="M8 12l5 4-5 4M15 20h8" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <span class="truncate">PowerShell</span>
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
            <svg viewBox="0 0 16 16" class="w-3 h-3 text-slate-200">
              <path d="M4 6h3l4-4v12l-4-4H4V6z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/>
              <path d="M13 5.5c1 1 1 4 0 5" stroke="currentColor" stroke-linecap="round" fill="none"/>
            </svg>
            </div>
            <div
              class="w-4 h-4 rounded-sm bg-slate-900/80 border border-slate-500/70 flex items-center justify-center text-[9px]"
            >
            <svg viewBox="0 0 16 16" class="w-3 h-3 text-slate-200">
              <circle cx="8" cy="8" r="6" fill="transparent" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 2c-2.5 0-2.5 12 0 12M8 2c2.5 0 2.5 12 0 12M2 8h12" stroke="currentColor" stroke-width="1" fill="none"/>
            </svg>
            </div>
          </div>

          <div
            class="px-2 py-0.5 rounded-sm bg-slate-900/60 border border-slate-600/80 text-[11px] md:text-xs"
          >
            {{ timeText }}
          </div>
        </div>
      </div>

      <!-- Context Menu Desktop -->
      <div
        v-if="contextMenu.visible"
        class="fixed z-50 w-48 bg-slate-50 border border-slate-400 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] py-1 text-slate-800 text-[11px]"
        :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
        @click.stop
      >
        <template v-if="contextMenu.type === 'icon'">
          <button
            class="w-full text-left px-4 py-1.5 hover:bg-sky-600 hover:text-white"
            @click="handleDelete"
          >
            Eliminar
          </button>
        </template>
        <template v-else-if="contextMenu.type === 'desktop'">
          <button class="w-full text-left px-4 py-1.5 hover:bg-sky-600 hover:text-white" @click="triggerBackgroundUpload">
            Cambiar fondo de pantalla
          </button>
          <button v-if="customBackground" class="w-full text-left px-4 py-1.5 hover:bg-sky-600 hover:text-white" @click="resetBackground">
            Restaurar fondo original
          </button>
        </template>
      </div>

      <!-- Input oculto para cambiar el fondo -->
      <input type="file" ref="bgInput" accept="image/*" class="hidden" @change="onBackgroundSelected" />
    </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import TerminalHero from '../TerminalHero/TerminalHero.vue';
import MyPcExplorer from '../MyPcExplorer/MyPcExplorer.vue';
import MyDocsExplorer from '../MyDocsExplorer/MyDocsExplorer.vue';
import CodeStudio from '../CodeStudio/CodeStudio.vue';
import BrowserWindow from '../BrowserWindow/BrowserWindow.vue';
import XpBrowser from '../XpBrowser/XpBrowser.vue';
import MusicPlayerWindow from '../MusicPlayerWindow/MusicPlayerWindow.vue';
import StartMenu from '../StartMenu/StartMenu.vue';
import ShutdownScreen from '../ShutdownScreen/ShutdownScreen.vue';
import PowerOffScreen from '../PowerOffScreen/PowerOffScreen.vue';
import BootLoadingScreen from '../BootLoadingScreen/BootLoadingScreen.vue';
import LockScreen from '../LockScreen/LockScreen.vue';
import PapeleraExplorer from '../PapeleraExplorer/PapeleraExplorer.vue';
import MyPictureExplorer from '../MyPictureExplorer/MyPictureExplorer.vue';
import RestartConfirmDialog from '../RestartConfirmDialog/RestartConfirmDialog.vue';

import { useXpDesktop } from '../../composables/XpDesktop/useXpDesktop';
import '../../styles/XpDesktop/XpDesktop.css';

const {
  timeText,
  powerState,
  isLocked,
  showRestartConfirm,
  browserHtml,
  windowOrder,
  activateWindow,
  getWindowZIndex,
  isMyPcOpen,
  isMyPcMinimized,
  hasContinuedToExplorer,
  isExplorerOpen,
  isExplorerMinimized,
  isCodeOpen,
  isCodeMinimized,
  isBrowserOpen,
  isBrowserMinimized,
  isXpBrowserOpen,
  isXpBrowserMinimized,
  isMusicOpen,
  isMusicMinimized,
  handleStartOpenMyPc,
  handleLock,
  handleRestart,
  cancelRestart,
  confirmRestart,
  handleShutdown,
  handlePowerOn,
  handleUnlock,
  handleMyPcClose,
  handleMyPcMinimize,
  handleMyPcMaximize,
  toggleMyPcFromTaskbar,
  goToExplorer,
  openExplorer,
  handleExplorerClose,
  handleExplorerMinimize,
  toggleExplorerFromTaskbar,
  openCode,
  handleCodeClose,
  handleCodeMinimize,
  toggleCodeFromTaskbar,
  openBrowserWithHtml,
  handleBrowserClose,
  handleBrowserMinimize,
  toggleBrowserFromTaskbar,
  handleXpBrowserClose,
  handleXpBrowserMinimize,
  toggleXpBrowserFromTaskbar,
  handleFirefoxIconClick,
  openMusic,
  handleMusicClose,
  handleMusicMinimize,
  toggleMusicFromTaskbar,
  iconPositions,
  onIconMouseDown,
  handleIconClick,
  openWindow
} = useXpDesktop();

const contextMenu = ref({ visible: false, x: 0, y: 0, type: 'desktop' });
const customBackground = ref(null);
const bgInput = ref(null);

const handleContextMenu = (e) => {
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    type: 'icon'
  };
};

const handleDesktopContextMenu = (e) => {
  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    type: 'desktop'
  };
};

const triggerBackgroundUpload = () => {
  closeContextMenu();
  bgInput.value?.click();
};

const resetBackground = () => {
  closeContextMenu();
  customBackground.value = null;
  localStorage.removeItem('xp-desktop-bg');
};

const onBackgroundSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const result = evt.target.result;
    try {
      localStorage.setItem('xp-desktop-bg', result);
      customBackground.value = result;
    } catch (err) {
      alert('La imagen es demasiado pesada para guardarse en la memoria local (límite aprox. 5MB). Por favor, intenta con otra de menor tamaño.');
    }
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};

const handleDelete = () => {
  alert('No se puede eliminar este acceso directo');
  contextMenu.value.visible = false;
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

const isPapeleraOpen = ref(false);
const isPapeleraMinimized = ref(false);

const openPapelera = () => {
  isPapeleraOpen.value = true;
  isPapeleraMinimized.value = false;
  activateWindow('papelera');
};
const handlePapeleraClose = () => { isPapeleraOpen.value = false; };
const handlePapeleraMinimize = () => { isPapeleraMinimized.value = true; };
const togglePapeleraFromTaskbar = () => {
  if (isPapeleraMinimized.value) { isPapeleraMinimized.value = false; activateWindow('papelera'); }
  else { isPapeleraMinimized.value = true; }
};

const isPictureExplorerOpen = ref(false);
const isPictureExplorerMinimized = ref(false);

const openPictureExplorer = () => {
  isPictureExplorerOpen.value = true;
  isPictureExplorerMinimized.value = false;
  activateWindow('picture-explorer');
};
const handlePictureExplorerClose = () => { isPictureExplorerOpen.value = false; };
const handlePictureExplorerMinimize = () => { isPictureExplorerMinimized.value = true; };
const togglePictureExplorerFromTaskbar = () => {
  if (isPictureExplorerMinimized.value) { isPictureExplorerMinimized.value = false; activateWindow('picture-explorer'); }
  else { isPictureExplorerMinimized.value = true; }
};

const isPowerShellOpen = ref(false);
const isPowerShellMinimized = ref(false);

const openPowerShell = () => {
  isPowerShellOpen.value = true;
  isPowerShellMinimized.value = false;
  activateWindow('powershell');
};
const handlePowerShellClose = () => { isPowerShellOpen.value = false; };
const handlePowerShellMinimize = () => { isPowerShellMinimized.value = true; };
const togglePowerShellFromTaskbar = () => {
  if (isPowerShellMinimized.value) { isPowerShellMinimized.value = false; activateWindow('powershell'); }
  else { isPowerShellMinimized.value = true; }
};

onMounted(() => {
  customBackground.value = localStorage.getItem('xp-desktop-bg');

  const savedIcons = localStorage.getItem('xp-desktop-icons');
  if (savedIcons) {
    try {
      const parsed = JSON.parse(savedIcons);
      for (const key in parsed) {
        if (iconPositions.value[key]) {
          iconPositions.value[key].x = parsed[key].x;
          iconPositions.value[key].y = parsed[key].y;
        }
      }
    } catch (e) {}
  }

  // Recuperar si ya abrimos Mi PC y pasamos la terminal
  if (localStorage.getItem('xp-has-visited-explorer') === 'true') {
    hasContinuedToExplorer.value = true;
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      handleLock();
    }
  });

  const hasVisited = localStorage.getItem('xp-has-visited');
  if (!hasVisited) {
    localStorage.setItem('xp-has-visited', 'true');
  } else {
    const savedPower = localStorage.getItem('xp-power-state');
    const savedLocked = localStorage.getItem('xp-is-locked');

    if (savedPower === 'on') {
      powerState.value = 'on'; 
      if (savedLocked === 'false') {
        isLocked.value = false;
        
        const savedWins = localStorage.getItem('xp-open-windows');
        if (savedWins) {
          try {
            const wins = JSON.parse(savedWins);
            wins.forEach(w => {
              if (w === 'papelera') openPapelera();
              else if (w === 'powershell') openPowerShell();
              else if (w === 'firefox') handleFirefoxIconClick();
              else if (w === 'picture-explorer') openPictureExplorer();
              else openWindow(w);
            });
          } catch(e) {}
        }
      } else {
        isLocked.value = true;
      }
    }
  }
});

watch(iconPositions, (newPos) => {
  localStorage.setItem('xp-desktop-icons', JSON.stringify(newPos));
}, { deep: true });

watch(hasContinuedToExplorer, (val) => {
  if (val) {
    localStorage.setItem('xp-has-visited-explorer', 'true');
  }
});

watch([powerState, isLocked, isMyPcOpen, isExplorerOpen, isCodeOpen, isBrowserOpen, isXpBrowserOpen, isMusicOpen, isPapeleraOpen, isPowerShellOpen, isPictureExplorerOpen], () => {
  localStorage.setItem('xp-power-state', powerState.value);
  localStorage.setItem('xp-is-locked', isLocked.value.toString());

  if (!isLocked.value && powerState.value === 'on') {
    const wins = [];
    if (isMyPcOpen.value) wins.push('mi-pc');
    if (isExplorerOpen.value) wins.push('explorador');
    if (isCodeOpen.value) wins.push('code');
    if (isBrowserOpen.value) wins.push('firefox'); 
    if (isXpBrowserOpen.value) wins.push('xp-browser');
    if (isMusicOpen.value) wins.push('music');
    if (isPapeleraOpen.value) wins.push('papelera');
    if (isPowerShellOpen.value) wins.push('powershell');
    if (isPictureExplorerOpen.value) wins.push('picture-explorer');
    localStorage.setItem('xp-open-windows', JSON.stringify(wins));
  }
}, { deep: true });

</script>
