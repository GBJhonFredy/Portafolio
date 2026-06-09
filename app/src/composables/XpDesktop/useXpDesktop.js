import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useXpDesktop() {
  const timeText = ref('');
  let intervalId = null;
  let shutdownTimerId = null;
  let bootTimerId = null;

  const powerState = ref('on');
  const isLocked = ref(true);
  const showRestartConfirm = ref(false);
  const defaultBrowserHtml = '<!DOCTYPE html><html><body><h1>Vista previa vacÃ­a</h1></body></html>';

  const clearPowerTimers = () => {
    if (shutdownTimerId) {
      clearTimeout(shutdownTimerId);
      shutdownTimerId = null;
    }

    if (bootTimerId) {
      clearTimeout(bootTimerId);
      bootTimerId = null;
    }
  };

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeText.value = `${hours}:${minutes}`;
  };

  const windowOrder = ref([]);

  const activateWindow = (key) => {
    windowOrder.value = [
      ...windowOrder.value.filter((item) => item !== key),
      key,
    ];
  };

  const removeWindow = (key) => {
    windowOrder.value = windowOrder.value.filter((item) => item !== key);
  };

  const getWindowZIndex = (key) => {
    const index = windowOrder.value.indexOf(key);
    return 10 + Math.max(index, 0);
  };

  const browserHtml = ref(defaultBrowserHtml);

  // States
  const isMyPcOpen = ref(false);
  const isMyPcMinimized = ref(false);
  const hasContinuedToExplorer = ref(false);
  const isExplorerOpen = ref(false);
  const isExplorerMinimized = ref(false);
  const isCodeOpen = ref(false);
  const isCodeMinimized = ref(false);
  const isBrowserOpen = ref(false);
  const isBrowserMinimized = ref(false);
  const isXpBrowserOpen = ref(false);
  const isXpBrowserMinimized = ref(false);
  const isMusicOpen = ref(false);
  const isMusicMinimized = ref(false);
  const isWmpOpen = ref(false);
  const isWmpMinimized = ref(false);
  const isMessengerOpen = ref(false);
  const isMessengerMinimized = ref(false);

  let lastClickTimeMyPc = 0;
  let lastClickTimeFirefox = 0;

  const resetDesktopState = () => {
    isMyPcOpen.value = false;
    isMyPcMinimized.value = false;
    hasContinuedToExplorer.value = false;
    isExplorerOpen.value = false;
    isExplorerMinimized.value = false;
    isCodeOpen.value = false;
    isCodeMinimized.value = false;
    isBrowserOpen.value = false;
    isBrowserMinimized.value = false;
    isXpBrowserOpen.value = false;
    isXpBrowserMinimized.value = false;
    isMusicOpen.value = false;
    isMusicMinimized.value = false;
    windowOrder.value = [];
    browserHtml.value = defaultBrowserHtml;
    lastClickTimeMyPc = 0;
    lastClickTimeFirefox = 0;
    showRestartConfirm.value = false;
  };

  const beginBootSequence = () => {
    clearPowerTimers();
    resetDesktopState();
    isLocked.value = true;
    powerState.value = 'booting';

    bootTimerId = setTimeout(() => {
      powerState.value = 'on';
      isLocked.value = true;
      bootTimerId = null;
    }, 5000);
  };

  onMounted(() => {
    updateTime();
    intervalId = setInterval(updateTime, 30000);
  });

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    clearPowerTimers();
  });

  /* -------- MENÃš INICIO -------- */
  const handleStartOpenMyPc = () => {
    isMyPcOpen.value = true;
    isMyPcMinimized.value = false;
    hasContinuedToExplorer.value = false;
    activateWindow('my-pc');
  };

  const handleLock = () => {
    showRestartConfirm.value = false;
    isLocked.value = true;
  };

  const handleRestart = () => {
    showRestartConfirm.value = true;
  };

  const cancelRestart = () => {
    showRestartConfirm.value = false;
  };

  const confirmRestart = () => {
    beginBootSequence();
  };

  const handleShutdown = () => {
    if (powerState.value !== 'on') {
      return;
    }
    clearPowerTimers();
    resetDesktopState();
    powerState.value = 'shutting-down';

    shutdownTimerId = setTimeout(() => {
      powerState.value = 'off';
      shutdownTimerId = null;
    }, 5000);
  };

  const handlePowerOn = () => {
    if (powerState.value !== 'off') {
      return;
    }
    beginBootSequence();
  };

  const handleUnlock = () => {
    isLocked.value = false;
  };

  /* -------- MI PC -------- */
  const doubleClickDelay = 300;

  const handleMyPcClick = () => {
    const now = Date.now();
    if (now - lastClickTimeMyPc < doubleClickDelay) {
      isMyPcOpen.value = true;
      isMyPcMinimized.value = false;
      hasContinuedToExplorer.value = false;
      activateWindow('my-pc');
    }
    lastClickTimeMyPc = now;
  };

  const handleMyPcClose = () => {
    isMyPcOpen.value = false;
    isMyPcMinimized.value = false;
    hasContinuedToExplorer.value = false;
    removeWindow('my-pc');
  };

  const handleMyPcMinimize = () => {
    isMyPcMinimized.value = true;
  };

  const handleMyPcMaximize = () => {
    isMyPcOpen.value = true;
    isMyPcMinimized.value = false;
    activateWindow('my-pc');
  };

  const toggleMyPcFromTaskbar = () => {
    if (isMyPcMinimized.value) {
      isMyPcMinimized.value = false;
      activateWindow('my-pc');
    } else {
      isMyPcMinimized.value = true;
    }
  };

  const goToExplorer = () => {
    hasContinuedToExplorer.value = true;
  };

  /* -------- EXPLORADOR -------- */
  const openExplorer = () => {
    isExplorerOpen.value = true;
    isExplorerMinimized.value = false;
    activateWindow('explorer');
  };

  const handleExplorerClose = () => {
    isExplorerOpen.value = false;
    isExplorerMinimized.value = false;
    removeWindow('explorer');
  };

  const handleExplorerMinimize = () => {
    isExplorerMinimized.value = true;
  };

  const toggleExplorerFromTaskbar = () => {
    if (isExplorerMinimized.value) {
      isExplorerMinimized.value = false;
      activateWindow('explorer');
    } else {
      isExplorerMinimized.value = true;
    }
  };

  /* -------- CODE STUDIO -------- */
  const openCode = () => {
    isCodeOpen.value = true;
    isCodeMinimized.value = false;
    activateWindow('code');
  };

  const handleCodeClose = () => {
    isCodeOpen.value = false;
    isCodeMinimized.value = false;
    removeWindow('code');
  };

  const handleCodeMinimize = () => {
    isCodeMinimized.value = true;
  };

  const toggleCodeFromTaskbar = () => {
    if (isCodeMinimized.value) {
      isCodeMinimized.value = false;
      activateWindow('code');
    } else {
      isCodeMinimized.value = true;
    }
  };

  /* -------- FIREFOX PREVIEW (para Code Studio) -------- */
  const openBrowserWithHtml = (html) => {
    browserHtml.value = html;
    isBrowserOpen.value = true;
    isBrowserMinimized.value = false;
    activateWindow('browser');
  };

  const handleBrowserClose = () => {
    isBrowserOpen.value = false;
    isBrowserMinimized.value = false;
    removeWindow('browser');
  };

  const handleBrowserMinimize = () => {
    isBrowserMinimized.value = true;
  };

  const toggleBrowserFromTaskbar = () => {
    if (isBrowserMinimized.value) {
      isBrowserMinimized.value = false;
      activateWindow('browser');
    } else {
      isBrowserMinimized.value = true;
    }
  };

  /* -------- NAVEGADOR XP (iframe interno) -------- */
  const handleXpBrowserOpen = () => {
    isXpBrowserOpen.value = true;
    isXpBrowserMinimized.value = false;
    activateWindow('xp-browser');
  };

  const handleXpBrowserClose = () => {
    isXpBrowserOpen.value = false;
    isXpBrowserMinimized.value = false;
    removeWindow('xp-browser');
  };

  const handleXpBrowserMinimize = () => {
    isXpBrowserMinimized.value = true;
  };

  const toggleXpBrowserFromTaskbar = () => {
    if (isXpBrowserMinimized.value) {
      isXpBrowserMinimized.value = false;
      activateWindow('xp-browser');
    } else {
      isXpBrowserMinimized.value = true;
    }
  };

  const handleFirefoxIconClick = () => {
    const now = Date.now();
    const delay = 300;
    if (now - lastClickTimeFirefox < delay) {
      handleXpBrowserOpen();
    }
    lastClickTimeFirefox = now;
  };

  /* -------- MÃšSICA / REPRODUCTOR -------- */
  const openMusic = () => {
    isMusicOpen.value = true;
    isMusicMinimized.value = false;
    activateWindow('music');
  };

  const handleMusicClose = () => {
    isMusicOpen.value = false;
    isMusicMinimized.value = false;
    removeWindow('music');
  };

  const handleMusicMinimize = () => {
    isMusicMinimized.value = true;
  };

  const toggleMusicFromTaskbar = () => {
    if (isMusicMinimized.value) {
      isMusicMinimized.value = false;
      activateWindow('music');
    } else {
      isMusicMinimized.value = true;
    }
  };

  /* -------- MESSENGER -------- */
  const openMessenger = () => {
    isMessengerOpen.value = true;
    isMessengerMinimized.value = false;
    activateWindow('messenger');
  };

  const handleMessengerClose = () => {
    isMessengerOpen.value = false;
    isMessengerMinimized.value = false;
    removeWindow('messenger');
  };

  const handleMessengerMinimize = () => {
    isMessengerMinimized.value = true;
  };

  const toggleMessengerFromTaskbar = () => {
    if (isMessengerMinimized.value) {
      isMessengerMinimized.value = false;
      activateWindow('messenger');
    } else {
      isMessengerMinimized.value = true;
    }
  };

  /* -------- ICONOS ESCRITORIO -------- */
  const iconPositions = ref({
    'mi-pc': { x: 16, y: 16 },
    'explorador': { x: 16, y: 96 },
    'code': { x: 16, y: 176 },
    'firefox': { x: 16, y: 256 },
    'papelera': { x: 16, y: 336 },
    'music': { x: 16, y: 416 },
    'messenger': { x: 16, y: 496 }
  });

  const draggingIcon = ref(null);
  let iconDragStartX = 0;
  let iconDragStartY = 0;
  let iconMouseStartX = 0;
  let iconMouseStartY = 0;
  let iconDragged = false;

  const onIconMouseDown = (event, id) => {
    if (event.button !== 0) return;
    draggingIcon.value = id;
    iconDragged = false;
    iconMouseStartX = event.clientX;
    iconMouseStartY = event.clientY;
    iconDragStartX = iconPositions.value[id].x;
    iconDragStartY = iconPositions.value[id].y;
    
    window.addEventListener('mousemove', onIconMouseMove);
    window.addEventListener('mouseup', onIconMouseUp);
  };

  const onIconMouseMove = (event) => {
    if (!draggingIcon.value) return;
    
    const dx = event.clientX - iconMouseStartX;
    const dy = event.clientY - iconMouseStartY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      iconDragged = true;
    }
    
    iconPositions.value[draggingIcon.value].x = iconDragStartX + dx;
    iconPositions.value[draggingIcon.value].y = iconDragStartY + dy;
  };

  const onIconMouseUp = (event) => {
    window.removeEventListener('mousemove', onIconMouseMove);
    window.removeEventListener('mouseup', onIconMouseUp);
    
    setTimeout(() => {
      draggingIcon.value = null;
      iconDragged = false;
    }, 0);
  };

  const handleIconClick = (event, action) => {
    if (iconDragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    action();
  };

  const openWindow = (key) => {
    if (key === 'mi-pc') {
      handleMyPcClick();
    } else if (key === 'explorador') {
      openExplorer();
    } else if (key === 'code') {
      openCode();
    } else if (key === 'papelera') {
      console.log('Abrir papelera (pendiente implementar)');
    } else if (key === 'messenger') {
      openMessenger();
    } else if (key === 'xp-browser') {
      handleXpBrowserOpen();
    } else if (key === 'music') {
      openMusic();
    } else {
      console.log('Abrir ventana (pendiente implementar):', key);
    }
  };

  return {
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
    isWmpOpen,
    isWmpMinimized,
    isMessengerOpen,
    isMessengerMinimized,

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

    openMessenger,
    handleMessengerClose,
    handleMessengerMinimize,
    toggleMessengerFromTaskbar,

    iconPositions,
    onIconMouseDown,
    handleIconClick,
    openWindow
  };
}
