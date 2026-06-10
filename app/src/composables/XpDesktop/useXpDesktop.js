import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

export function useXpDesktop() {
  const timeText = ref('');
  let intervalId = null;
  let shutdownTimerId = null;
  let bootTimerId = null;

  // El estado de 'encendido' es manejado por XpDesktop, mientras que el 'stage' general (off, boot, lock, desktop) es manejado por HomeView.
  const powerState = ref('on');
  // Sincronizamos el estado inicial de 'isLocked' con lo que haya en localStorage.
  // HomeView es quien escribe este valor. Si es 'false', significa que ya se desbloqueó
  // y el escritorio no debería mostrar la pantalla de bloqueo de nuevo.
  const isLocked = ref(localStorage.getItem('xp-is-locked') !== 'false');
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
  const isCodeOpen = ref(false);
  const isCodeMinimized = ref(false);
  const isBrowserOpen = ref(false);
  const isBrowserMinimized = ref(false);
  const isXpBrowserOpen = ref(false);
  const isXpBrowserMinimized = ref(false);
  const isWmpOpen = ref(false);
  const isWmpMinimized = ref(false);
  const isMessengerOpen = ref(false);
  const isMessengerMinimized = ref(false);
  const isPapeleraOpen = ref(false);
  const isPapeleraMinimized = ref(false);
  const isPowerShellOpen = ref(false);
  const isPowerShellMinimized = ref(false);
  const isInfoReadmeOpen = ref(false);
  const isInfoReadmeMinimized = ref(false);
  const isActivatorOpen = ref(false);
  const isActivatorMinimized = ref(false);
  const isBuscaminasOpen = ref(false);
  const isBuscaminasMinimized = ref(false);
  const isPortfolioActivated = ref(false);
  const showActivationAlert = ref(false);

  let lastClickTimeMyPc = 0;
  let lastClickTimeFirefox = 0;

  const resetDesktopState = () => {
    isMyPcOpen.value = false;
    isMyPcMinimized.value = false;
    hasContinuedToExplorer.value = false;
    isCodeOpen.value = false;
    isCodeMinimized.value = false;
    isBrowserOpen.value = false;
    isBrowserMinimized.value = false;
    isXpBrowserOpen.value = false;
    isXpBrowserMinimized.value = false;
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

    if (!iconPositions.value.music) {
      iconPositions.value.music = { x: 15, y: 420 };
    }

      // Posición inicial por defecto de la Papelera (inferior derecha)
      if (typeof window !== 'undefined') {
        iconPositions.value['papelera'] = {
          x: window.innerWidth - 190,
          y: window.innerHeight - 150
        };
      }

    customBackground.value = localStorage.getItem('xp-desktop-bg');

    if (localStorage.getItem('xp-portfolio-activated') === 'true') {
      isPortfolioActivated.value = true;
    }

    const savedIcons = localStorage.getItem('xp-desktop-icons');
    if (savedIcons) {
      try {
        const parsed = JSON.parse(savedIcons);
        for (const key in parsed) {
          if (iconPositions.value[key]) {
              // Si la papelera sigue en la posición antigua por defecto,
              // la ignoramos para que tome la nueva posición dinámica en la esquina inferior derecha.
              if (key === 'papelera' && parsed[key].x === 16 && parsed[key].y === 336) {
                continue;
              }
            iconPositions.value[key].x = parsed[key].x;
            iconPositions.value[key].y = parsed[key].y;
          }
        }
      } catch (e) {}
    }

    if (localStorage.getItem('xp-has-visited-explorer') === 'true') {
      hasContinuedToExplorer.value = true;
    }

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLock();
      }
    });

    const savedWins = localStorage.getItem('xp-open-windows');
    if (savedWins) {
      try {
        const wins = JSON.parse(savedWins);
        wins.forEach((w) => {
          const id = typeof w === 'string' ? w : w.id;
          const isMin = typeof w === 'string' ? false : w.minimized;

          if (id === 'papelera') openPapelera();
          else if (id === 'powershell') openPowerShell();
          else if (id === 'firefox') handleFirefoxIconClick();
          else if (id === 'wmp') openWmp();
          else if (id === 'info-readme') openInfoReadme();
          else if (id === 'activator') openActivator();
          else if (id === 'buscaminas') openBuscaminas();
          else openWindow(id);

          if (isMin) {
            if (id === 'mi-pc' || id === 'explorador' || id === 'music' || id === 'picture-explorer') handleMyPcMinimize();
            else if (id === 'code') handleCodeMinimize();
            else if (id === 'firefox') handleBrowserMinimize();
            else if (id === 'xp-browser') handleXpBrowserMinimize();
            else if (id === 'wmp') handleWmpMinimize();
            else if (id === 'papelera') handlePapeleraMinimize();
            else if (id === 'messenger') handleMessengerMinimize();
            else if (id === 'powershell') handlePowerShellMinimize();
            else if (id === 'info-readme') handleInfoReadmeMinimize();
            else if (id === 'activator') handleActivatorMinimize();
            else if (id === 'buscaminas') handleBuscaminasMinimize();
          }
        });
      } catch (e) {}
    }

    const shouldOpenInfoOnce = localStorage.getItem('xp-should-open-info-once');
    const hasOpenedInfo = localStorage.getItem('xp-has-opened-info');
    if (shouldOpenInfoOnce === 'true' && !hasOpenedInfo) {
      openInfoReadme();
      localStorage.setItem('xp-has-opened-info', 'true');
      localStorage.removeItem('xp-should-open-info-once');
    }
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

  /* -------- MI PC (UNIFIED EXPLORER) -------- */
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
    'mi-pc': { x: 32, y: 2 },
    'explorador': { x: 16, y: 80 },
    'code': { x: 16, y: 184 },
    'firefox': { x: 30, y: 260 },
    'papelera': { x: 190, y: 150 },
    'music': { x: 16, y: 344 },
    'messenger': { x: 22, y: 424 },
    'readme': { x: 22, y: 504 },
    'activador': { x: 100, y: 2 },
    'buscaminas': { x: 22, y: 596 }
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

  const handleIconClick = (event, action, isActivator = false) => {
    if (iconDragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!isPortfolioActivated.value && !isActivator) {
      showActivationAlert.value = true;
      return;
    }
    action();
  };

  const closeActivationAlert = () => {
    showActivationAlert.value = false;
  };

  const openPapelera = () => { isPapeleraOpen.value = true; isPapeleraMinimized.value = false; activateWindow('papelera'); };
  const handlePapeleraClose = () => { isPapeleraOpen.value = false; };
  const handlePapeleraMinimize = () => { isPapeleraMinimized.value = true; };
  const togglePapeleraFromTaskbar = () => { if (isPapeleraMinimized.value) { isPapeleraMinimized.value = false; activateWindow('papelera'); } else { isPapeleraMinimized.value = true; } };

  const openWmp = () => { isWmpOpen.value = true; isWmpMinimized.value = false; activateWindow('wmp'); };
  const handleWmpClose = () => { isWmpOpen.value = false; };
  const handleWmpMinimize = () => { isWmpMinimized.value = true; };
  const toggleWmpFromTaskbar = () => { if (isWmpMinimized.value) { isWmpMinimized.value = false; activateWindow('wmp'); } else { isWmpMinimized.value = true; } };

  const openPowerShell = () => { isPowerShellOpen.value = true; isPowerShellMinimized.value = false; activateWindow('powershell'); };
  const handlePowerShellClose = () => { isPowerShellOpen.value = false; };
  const handlePowerShellMinimize = () => { isPowerShellMinimized.value = true; };
  const togglePowerShellFromTaskbar = () => { if (isPowerShellMinimized.value) { isPowerShellMinimized.value = false; activateWindow('powershell'); } else { isPowerShellMinimized.value = true; } };

  const openInfoReadme = () => { isInfoReadmeOpen.value = true; isInfoReadmeMinimized.value = false; activateWindow('info-readme'); };
  const handleInfoReadmeClose = () => { isInfoReadmeOpen.value = false; };
  const handleInfoReadmeMinimize = () => { isInfoReadmeMinimized.value = true; };
  const toggleInfoReadmeFromTaskbar = () => { if (isInfoReadmeMinimized.value) { isInfoReadmeMinimized.value = false; activateWindow('info-readme'); } else { isInfoReadmeMinimized.value = true; } };

  const openActivator = () => { isActivatorOpen.value = true; isActivatorMinimized.value = false; activateWindow('activator'); };
  const handleActivatorClose = () => { isActivatorOpen.value = false; };
  const handleActivatorMinimize = () => { isActivatorMinimized.value = true; };
  const toggleActivatorFromTaskbar = () => { if (isActivatorMinimized.value) { isActivatorMinimized.value = false; activateWindow('activator'); } else { isActivatorMinimized.value = true; } };
  const handlePortfolioActivated = () => { isPortfolioActivated.value = true; setTimeout(() => { handleActivatorClose(); }, 1000); };

  const openBuscaminas = () => { isBuscaminasOpen.value = true; isBuscaminasMinimized.value = false; activateWindow('buscaminas'); };
  const handleBuscaminasClose = () => { isBuscaminasOpen.value = false; };
  const handleBuscaminasMinimize = () => { isBuscaminasMinimized.value = true; };
  const toggleBuscaminasFromTaskbar = () => { if (isBuscaminasMinimized.value) { isBuscaminasMinimized.value = false; activateWindow('buscaminas'); } else { isBuscaminasMinimized.value = true; } };

  const contextMenu = ref({ visible: false, x: 0, y: 0, type: 'desktop' });
  const customBackground = ref(null);
  const bgInput = ref(null);

  const handleContextMenu = (e) => { contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'icon' }; };
  const handleDesktopContextMenu = (e) => { contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'desktop' }; };
  const closeContextMenu = () => { contextMenu.value.visible = false; };
  const triggerBackgroundUpload = () => { closeContextMenu(); bgInput.value?.click(); };
  const resetBackground = () => { closeContextMenu(); customBackground.value = null; localStorage.removeItem('xp-desktop-bg'); };
  const onBackgroundSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target.result;
      try { localStorage.setItem('xp-desktop-bg', result); customBackground.value = result; }
      catch (err) { alert('La imagen es demasiado pesada para guardarse en la memoria local (límite aprox. 5MB). Por favor, intenta con otra de menor tamaño.'); }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const handleDelete = () => { alert('No se puede eliminar este acceso directo'); contextMenu.value.visible = false; };

  watch(iconPositions, (newPos) => {
    localStorage.setItem('xp-desktop-icons', JSON.stringify(newPos));
  }, { deep: true });

  watch(hasContinuedToExplorer, (val) => {
    if (val) {
      localStorage.setItem('xp-has-visited-explorer', 'true');
    }
  });

  watch([
    powerState, isLocked, isPortfolioActivated,
    isMyPcOpen, isCodeOpen, isBrowserOpen, isXpBrowserOpen, isPapeleraOpen, isPowerShellOpen, isWmpOpen, isMessengerOpen, isInfoReadmeOpen, isActivatorOpen, isBuscaminasOpen,
    isMyPcMinimized, isCodeMinimized, isBrowserMinimized, isXpBrowserMinimized, isPapeleraMinimized, isPowerShellMinimized, isWmpMinimized, isMessengerMinimized, isInfoReadmeMinimized, isActivatorMinimized, isBuscaminasMinimized
  ], () => {
    localStorage.setItem('xp-power-state', powerState.value);
    localStorage.setItem('xp-is-locked', isLocked.value.toString());

    if (!isLocked.value && powerState.value === 'on') {
      const wins = [];
      if (isMyPcOpen.value) wins.push({ id: 'mi-pc', minimized: isMyPcMinimized.value });
      if (isCodeOpen.value) wins.push({ id: 'code', minimized: isCodeMinimized.value });
      if (isBrowserOpen.value) wins.push({ id: 'firefox', minimized: isBrowserMinimized.value }); 
      if (isXpBrowserOpen.value) wins.push({ id: 'xp-browser', minimized: isXpBrowserMinimized.value });
      if (isWmpOpen.value) wins.push({ id: 'wmp', minimized: isWmpMinimized.value });
      if (isPapeleraOpen.value) wins.push({ id: 'papelera', minimized: isPapeleraMinimized.value });
      if (isMessengerOpen.value) wins.push({ id: 'messenger', minimized: isMessengerMinimized.value });
      if (isPowerShellOpen.value) wins.push({ id: 'powershell', minimized: isPowerShellMinimized.value });
      if (isInfoReadmeOpen.value) wins.push({ id: 'info-readme', minimized: isInfoReadmeMinimized.value });
      if (isActivatorOpen.value) wins.push({ id: 'activator', minimized: isActivatorMinimized.value });
      if (isBuscaminasOpen.value) wins.push({ id: 'buscaminas', minimized: isBuscaminasMinimized.value });
      localStorage.setItem('xp-open-windows', JSON.stringify(wins));
    }
    localStorage.setItem('xp-portfolio-activated', isPortfolioActivated.value.toString());
  }, { deep: true });

  const myPcInitialPath = ref('mi-pc');

  const openWindow = (key) => {
    if (key === 'mi-pc') {
      myPcInitialPath.value = 'mi-pc';
      handleStartOpenMyPc();
    } else if (key === 'disco-c' || key === 'disco-c-repos') {
      myPcInitialPath.value = key;
      handleStartOpenMyPc();
    } else if (key === 'explorador' || key === 'mis-documentos' || key === 'proyectos') {
      myPcInitialPath.value = key === 'explorador' ? 'mis-documentos' : key;
      handleStartOpenMyPc();
    } else if (key === 'code') {
      openCode();
    } else if (key === 'papelera') {
      openPapelera();
    } else if (key === 'messenger') {
      openMessenger();
    } else if (key === 'xp-browser') {
      handleXpBrowserOpen();
    } else if (key === 'music' || key === 'musica') {
      myPcInitialPath.value = 'musica';
      handleStartOpenMyPc();
    } else if (key === 'powershell') {
      openPowerShell();
    } else if (key === 'firefox') {
      handleXpBrowserOpen();
    } else if (key === 'picture-explorer' || key === 'imagenes' || key === 'imagenes-aprendizaje') {
      myPcInitialPath.value = key === 'picture-explorer' ? 'imagenes' : key;
      handleStartOpenMyPc();
    } else if (key === 'wmp') {
      openWmp();
    } else if (key === 'info-readme') {
      openInfoReadme();
    } else if (key === 'activator') {
      openActivator();
    } else if (key === 'buscaminas') {
      openBuscaminas();
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
    myPcInitialPath,
    
    windowOrder,
    activateWindow,
    getWindowZIndex,

    isMyPcOpen,
    isMyPcMinimized,
    hasContinuedToExplorer,
    isCodeOpen,
    isCodeMinimized,
    isBrowserOpen,
    isBrowserMinimized,
    isXpBrowserOpen,
    isXpBrowserMinimized,
    isWmpOpen,
    isWmpMinimized,
    isMessengerOpen,
    isMessengerMinimized,
    isPapeleraOpen,
    isPapeleraMinimized,
    isPowerShellOpen,
    isPowerShellMinimized,
    isInfoReadmeOpen,
    isInfoReadmeMinimized,
    isActivatorOpen,
    isActivatorMinimized,
    isBuscaminasOpen,
    isBuscaminasMinimized,
    isPortfolioActivated,
    showActivationAlert,
    contextMenu,
    customBackground,
    bgInput,

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

    openMessenger,
    handleMessengerClose,
    handleMessengerMinimize,
    toggleMessengerFromTaskbar,

    openPapelera, handlePapeleraClose, handlePapeleraMinimize, togglePapeleraFromTaskbar,
    openWmp, handleWmpClose, handleWmpMinimize, toggleWmpFromTaskbar,
    openPowerShell, handlePowerShellClose, handlePowerShellMinimize, togglePowerShellFromTaskbar,
    openInfoReadme, handleInfoReadmeClose, handleInfoReadmeMinimize, toggleInfoReadmeFromTaskbar,
    openActivator, handleActivatorClose, handleActivatorMinimize, toggleActivatorFromTaskbar, handlePortfolioActivated, closeActivationAlert,
    openBuscaminas, handleBuscaminasClose, handleBuscaminasMinimize, toggleBuscaminasFromTaskbar,
    handleContextMenu, handleDesktopContextMenu, closeContextMenu, triggerBackgroundUpload, resetBackground, onBackgroundSelected, handleDelete,

    iconPositions,
    onIconMouseDown,
    handleIconClick,
    openWindow
  };
}
