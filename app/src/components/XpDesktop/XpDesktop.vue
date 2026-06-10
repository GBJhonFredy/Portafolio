<template>
  <div class="relative w-screen h-screen overflow-hidden font-sans text-slate-100" @click="closeContextMenu" @contextmenu.prevent>
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
        <div class="absolute inset-0 z-0 p-3 md:p-4" @contextmenu.self="handleDesktopContextMenu($event)">
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
            @dblclick="handleIconClick($event, () => openWindow('explorador'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="icon-label">Explorador <br> de archivos</span>
          </button>

          <!-- Code Studio -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['code'].x}px, ${iconPositions['code'].y}px)` }"
            @mousedown="onIconMouseDown($event, 'code')"
            @dblclick="handleIconClick($event, () => openWindow('code'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 24 24" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC"/>
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
            @dblclick="handleIconClick($event, () => openPapelera())"
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

          <!-- Reproductor WMP -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['music']?.x ?? 15}px, ${iconPositions['music']?.y ?? 420}px)` }"
            @mousedown="onIconMouseDown($event, 'music')"
            @dblclick="handleIconClick($event, () => openWmp())"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <circle cx="16" cy="16" r="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
                <circle cx="16" cy="16" r="4" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
                <circle cx="16" cy="16" r="1.5" fill="#0f172a"/>
                <path d="M16 3 A 13 13 0 0 1 29 16 A 13 13 0 0 0 16 3 Z" fill="#ffffff" opacity="0.5"/>
                <path d="M14 21v-9l6-2v7" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12.5" cy="21" r="2.5" fill="#3b82f6"/>
                <circle cx="18.5" cy="19" r="2.5" fill="#3b82f6"/>
              </svg>
            </div>
            <span class="icon-label">Reproductor</span>
          </button>

          <!-- Windows Live Messenger -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['messenger']?.x ?? 15}px, ${iconPositions['messenger']?.y ?? 500}px)` }"
            @mousedown="onIconMouseDown($event, 'messenger')"
            @dblclick="handleIconClick($event, () => openWindow('messenger'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <!-- Blue figure -->
                <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 2c-3.3 0-6 2.7-6 6v2h12v-2c0-3.3-2.7-6-6-6z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="0.5"/>
                <!-- Green figure -->
                <path d="M20 18c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0 2c-2.8 0-5 2.2-5 5v1h10v-1c0-2.8-2.2-5-5-5z" fill="#10b981" stroke="#064e3b" stroke-width="0.5"/>
              </svg>
            </div>
            <span class="icon-label">Messenger</span>
          </button>

          <!-- Activador -->
          <button
            v-if="!isPortfolioActivated"
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['activador']?.x ?? 15}px, ${iconPositions['activador']?.y ?? 660}px)` }"
            @mousedown="onIconMouseDown($event, 'activador')"
            @dblclick="handleIconClick($event, openActivator, true)"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <path d="M4 4h24v24H4z" fill="#f0f0f0" stroke="#555" stroke-width="1.5"/>
                <path d="M4 4h24v6H4z" fill="#0058e6"/>
                <path d="M22.2 19.4a5 5 0 1 0-6.9 5.7 5 5 0 0 0 6.9-5.7zm-3.5 3.5a3.5 3.5 0 1 1 0-4.9 3.5 3.5 0 0 1 0 4.9z" fill="#333"/>
                <path d="M18.7 16.5h-5v2h5zm0 3h-5v2h5z" fill="#333"/>
              </svg>
            </div>
            <span class="icon-label">Activador</span>
          </button>

          <!-- Info Readme -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['readme']?.x ?? 15}px, ${iconPositions['readme']?.y ?? 580}px)` }"
            @mousedown="onIconMouseDown($event, 'readme')"
            @dblclick="handleIconClick($event, openInfoReadme)"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <circle cx="16" cy="16" r="13" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/>
                <text x="16" y="23" font-family="Times New Roman, serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">i</text>
              </svg>
            </div>
            <span class="icon-label">Información</span>
          </button>

          <!-- Buscaminas -->
          <button
            class="desktop-icon group absolute"
            :style="{ transform: `translate(${iconPositions['buscaminas']?.x ?? 96}px, ${iconPositions['buscaminas']?.y ?? 16}px)` }"
            @mousedown="onIconMouseDown($event, 'buscaminas')"
            @dblclick="handleIconClick($event, () => openWindow('buscaminas'))"
            @contextmenu.stop.prevent="handleContextMenu($event)"
          >
            <div class="icon-bg">
              <svg viewBox="0 0 32 32" class="w-9 h-9 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#fff" stroke-width="2"/>
                <path d="M4 28V4h24" stroke="#808080" stroke-width="2" fill="none"/>
                <circle cx="16" cy="16" r="8" fill="#000"/>
                <path d="M12 12l8 8m0-8l-8 8" stroke="#000" stroke-width="2"/>
                <path d="M16 6v4m0 12v4m-10-10h4m12 0h4m-14-7l3 3m8 8l3 3m0-14l-3 3m-8 8l-3 3" stroke="#000" stroke-width="2"/>
                <circle cx="13" cy="13" r="2" fill="#fff"/>
              </svg>
            </div>
            <span class="icon-label">Buscaminas</span>
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

        <!-- Mi PC (Unified File Explorer) -->
        <div
          v-if="isMyPcOpen && !isMyPcMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('my-pc') }"
          @mousedown="activateWindow('my-pc')"
        >
          <MyPcExplorer
            class="pointer-events-auto"
            :initial-path="myPcInitialPath"
            @close="handleMyPcClose"
            @minimize="handleMyPcMinimize"
            @maximize="handleMyPcMaximize"
            @open-my-docs="openWindow('explorador')"
            @navigate-to="(id) => { openWindow(id); handleMyPcClose(); }"
            @open-wmp="openWmp"
          />
        </div>

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

       <!-- Ventana Reproductor WMP -->
<WmpWindow
  v-if="isWmpOpen"
  v-show="!isWmpMinimized"
  class="absolute inset-0 pointer-events-none"
  :style="{ zIndex: getWindowZIndex('wmp') }"
  @mousedown="activateWindow('wmp')"
  @close="handleWmpClose"
  @minimize="handleWmpMinimize"
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

        <!-- Messenger Window -->
        <MessengerWindow
          v-if="isMessengerOpen"
          v-show="!isMessengerMinimized"
          class="absolute inset-0 pointer-events-none"
          :style="{ zIndex: getWindowZIndex('messenger') || 39 }"
          @mousedown="activateWindow('messenger')"
          @close="handleMessengerClose"
          @minimize="handleMessengerMinimize"
        />

        <!-- Info Readme Window -->
        <InfoReadme
          v-if="isInfoReadmeOpen"
          v-show="!isInfoReadmeMinimized"
          :style="{ zIndex: getWindowZIndex('info-readme') || 40 }"
          @mousedown="activateWindow('info-readme')"
          @close="handleInfoReadmeClose"
          @minimize="handleInfoReadmeMinimize"
        />

        <!-- Activator Window -->
        <Activator
          v-if="isActivatorOpen"
          v-show="!isActivatorMinimized"
          :style="{ zIndex: getWindowZIndex('activator') || 41 }"
          @mousedown="activateWindow('activator')"
          @close="handleActivatorClose"
          @minimize="handleActivatorMinimize"
          @activated="handlePortfolioActivated"
        />

        <!-- Marca de agua de Activación -->
        <template v-if="!isPortfolioActivated">
          <div class="absolute bottom-6 right-6 z-[9999] pointer-events-none select-none text-right font-sans">
            <p class="text-xl md:text-2xl text-white/50 font-normal tracking-wide drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
              Activar Portafolio
            </p>
            <p class="text-xs md:text-sm text-white/50 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mt-1">
              Contacta con el administrador para activar Portafolio.
            </p>
          </div>
        </template>

        <!-- Alerta de Activación -->
        <ActivationAlert
          v-if="showActivationAlert"
          @close="closeActivationAlert"
        />

        <!-- Buscaminas Window -->
        <GameBuscaminas
          v-if="isBuscaminasOpen"
          v-show="!isBuscaminasMinimized"
          :style="{ zIndex: getWindowZIndex('buscaminas') || 42 }"
          @mousedown="activateWindow('buscaminas')"
          @close="handleBuscaminasClose"
          @minimize="handleBuscaminasMinimize"
        />
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
            <svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC"/>
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

          <!-- Internet Explorer -->
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
            <span class="truncate">Internet Explorer</span>
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

          <!-- Windows Media Player -->
          <button
            v-if="isWmpOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isWmpMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleWmpFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <circle cx="16" cy="16" r="13" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
              <circle cx="16" cy="16" r="4" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
              <circle cx="16" cy="16" r="1.5" fill="#0f172a"/>
              <path d="M16 3 A 13 13 0 0 1 29 16 A 13 13 0 0 0 16 3 Z" fill="#ffffff" opacity="0.5"/>
              <path d="M14 21v-9l6-2v7" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12.5" cy="21" r="2.5" fill="#3b82f6"/>
              <circle cx="18.5" cy="19" r="2.5" fill="#3b82f6"/>
            </svg>
            <span class="truncate">Windows Media</span>
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

          <!-- Messenger -->
          <button
            v-if="isMessengerOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isMessengerMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleMessengerFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 2c-3.3 0-6 2.7-6 6v2h12v-2c0-3.3-2.7-6-6-6z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="0.5"/>
              <path d="M20 18c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0 2c-2.8 0-5 2.2-5 5v1h10v-1c0-2.8-2.2-5-5-5z" fill="#10b981" stroke="#064e3b" stroke-width="0.5"/>
            </svg>
            <span class="truncate">Messenger</span>
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

          <!-- Info Readme -->
          <button
            v-if="isInfoReadmeOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isInfoReadmeMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleInfoReadmeFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <circle cx="16" cy="16" r="13" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/>
              <text x="16" y="23" font-family="Times New Roman, serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" font-style="italic">i</text>
            </svg>
            <span class="truncate">Información</span>
          </button>

          <!-- Activador -->
          <button
            v-if="isActivatorOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isActivatorMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleActivatorFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
              <path d="M4 4h24v24H4z" fill="#f0f0f0" stroke="#555" stroke-width="1.5"/>
              <path d="M4 4h24v6H4z" fill="#0058e6"/>
              <path d="M22.2 19.4a5 5 0 1 0-6.9 5.7 5 5 0 0 0 6.9-5.7zm-3.5 3.5a3.5 3.5 0 1 1 0-4.9 3.5 3.5 0 0 1 0 4.9z" fill="#333"/>
              <path d="M18.7 16.5h-5v2h5zm0 3h-5v2h5z" fill="#333"/>
            </svg>
            <span class="truncate">Activador</span>
          </button>

          <!-- Buscaminas -->
          <button
            v-if="isBuscaminasOpen"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-[11px] md:text-xs shadow-[0_1px_3px_rgba(0,0,0,0.7)] max-w-[130px] md:max-w-[160px]"
            :class="isBuscaminasMinimized
              ? 'bg-slate-700 border-slate-500 text-slate-200'
              : 'bg-slate-300/90 border-slate-100 text-slate-900'"
            @click="toggleBuscaminasFromTaskbar"
          >
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
                <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#fff" stroke-width="2"/>
                <path d="M4 28V4h24" stroke="#808080" stroke-width="2" fill="none"/>
                <circle cx="16" cy="16" r="8" fill="#000"/>
                <path d="M12 12l8 8m0-8l-8 8" stroke="#000" stroke-width="2"/>
            </svg>
            <span class="truncate">Buscaminas</span>
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
import TerminalHero from '../TerminalHero/TerminalHero.vue';
import MyPcExplorer from '../MyPcExplorer/MyPcExplorer.vue';
import CodeStudio from '../CodeStudio/CodeStudio.vue';
import BrowserWindow from '../BrowserWindow/BrowserWindow.vue';
import XpBrowser from '../XpBrowser/XpBrowser.vue';
import WmpWindow from '../WmpWindow/WmpWindow.vue';
import StartMenu from '../StartMenu/StartMenu.vue';
import ShutdownScreen from '../ShutdownScreen/ShutdownScreen.vue';
import PowerOffScreen from '../PowerOffScreen/PowerOffScreen.vue';
import BootLoadingScreen from '../BootLoadingScreen/BootLoadingScreen.vue';
import LockScreen from '../LockScreen/LockScreen.vue';
import PapeleraExplorer from '../PapeleraExplorer/PapeleraExplorer.vue';
import MessengerWindow from '../MessengerWindow/MessengerWindow.vue';
import RestartConfirmDialog from '../RestartConfirmDialog/RestartConfirmDialog.vue';
import InfoReadme from '../InfoReadme/InfoReadme.vue';
import Activator from '../Activador/Activator.vue';
import ActivationAlert from '../ActivationAlert/ActivationAlert.vue';
import GameBuscaminas from '../GameBuscaminas/GameBuscaminas.vue';

import { useXpDesktop } from '../../composables/XpDesktop/useXpDesktop';
import '../../styles/XpDesktop/XpDesktop.css';

const {
  timeText, powerState, isLocked, showRestartConfirm, browserHtml, myPcInitialPath, windowOrder,
  activateWindow, getWindowZIndex,
  isMyPcOpen, isMyPcMinimized, hasContinuedToExplorer, isExplorerOpen, isExplorerMinimized,
  isCodeOpen, isCodeMinimized, isBrowserOpen, isBrowserMinimized, isXpBrowserOpen, isXpBrowserMinimized,
  isMusicOpen, isMusicMinimized, isMessengerOpen, isMessengerMinimized,
  isPapeleraOpen, isPapeleraMinimized, isPictureExplorerOpen, isPictureExplorerMinimized,
  isWmpOpen, isWmpMinimized, isPowerShellOpen, isPowerShellMinimized,
  isInfoReadmeOpen, isInfoReadmeMinimized, isActivatorOpen, isActivatorMinimized, isPortfolioActivated, showActivationAlert,
  isBuscaminasOpen, isBuscaminasMinimized,
  contextMenu, customBackground, bgInput,
  handleStartOpenMyPc, handleLock, handleRestart, cancelRestart, confirmRestart, handleShutdown, handlePowerOn, handleUnlock,
  handleMyPcClose, handleMyPcMinimize, handleMyPcMaximize, toggleMyPcFromTaskbar, goToExplorer, openExplorer, handleExplorerClose, handleExplorerMinimize, toggleExplorerFromTaskbar, openCode, handleCodeClose, handleCodeMinimize, toggleCodeFromTaskbar, openBrowserWithHtml, handleBrowserClose, handleBrowserMinimize, toggleBrowserFromTaskbar, handleXpBrowserClose, handleXpBrowserMinimize, toggleXpBrowserFromTaskbar, handleFirefoxIconClick, openMusic, handleMusicClose, handleMusicMinimize, toggleMusicFromTaskbar, openMessenger, handleMessengerClose, handleMessengerMinimize, toggleMessengerFromTaskbar,
  openPapelera, handlePapeleraClose, handlePapeleraMinimize, togglePapeleraFromTaskbar,
  openPictureExplorer, handlePictureExplorerClose, handlePictureExplorerMinimize, togglePictureExplorerFromTaskbar,
  openWmp, handleWmpClose, handleWmpMinimize, toggleWmpFromTaskbar,
  openPowerShell, handlePowerShellClose, handlePowerShellMinimize, togglePowerShellFromTaskbar,
  openInfoReadme, handleInfoReadmeClose, handleInfoReadmeMinimize, toggleInfoReadmeFromTaskbar,
  openActivator, handleActivatorClose, handleActivatorMinimize, toggleActivatorFromTaskbar, handlePortfolioActivated, closeActivationAlert,
  openBuscaminas, handleBuscaminasClose, handleBuscaminasMinimize, toggleBuscaminasFromTaskbar,
  handleContextMenu, handleDesktopContextMenu, closeContextMenu, triggerBackgroundUpload, resetBackground, onBackgroundSelected, handleDelete,
  iconPositions, onIconMouseDown, handleIconClick, openWindow
} = useXpDesktop();
</script>
