import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';

export function useTerminalHero(emit) {
  /* ---------- TEXTO Y EFECTO ESCRITURA ---------- */
  const banner = String.raw`
  _____            _        __       _ _       
 |  __ \          | |      / _|     | (_)      
 | |__) |__  _ __ | |_ __ _| |_ ___ | |_  ___  
 |  ___/ _ \| '__|| __/ _\`|  _/ _ \| | |/ _ \ 
 | |  | (_) | |   | || (_| | || (_) | | | (_) |
 |_|   \___/|_|    \__\__,_|_| \___/|_|_|\___/ 


             Portafolio · GBJhonFredy
`;

  const summary =
    '> Desarrollador Frontend orientado a interfaces claras, consistentes y preparadas para uso continuo en producción.';

  const typedSummary = ref('');
  const isTyping = ref(true);

  let index = 0;
  let intervalId = null;

  const startTyping = () => {
    typedSummary.value = '';
    index = 0;
    isTyping.value = true;

    intervalId = setInterval(() => {
      if (index < summary.length) {
        typedSummary.value += summary[index];
        index++;
      } else {
        isTyping.value = false;

        clearInterval(intervalId);
        intervalId = null;
      }
    }, 22);
  };

  /* ---------- DETECTAR ENTER PARA CONTINUAR ---------- */
  const handleKeyDown = (event) => {
    if (!isTyping.value && event.key === 'Enter') {
      emit('continue');
    }
  };

  onMounted(() => {
    startTyping();
    window.addEventListener('keydown', handleKeyDown);
  });

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    window.removeEventListener('keydown', handleKeyDown);
  });

  /* ---------- DRAG + MAXIMIZAR/RESTAURAR ---------- */
  const windowManager = useWindowManager({
    defaultWidth: '900px',
    defaultHeight: 'auto',
    maxWidth: '1100px'
  });

  // Interceptamos maximize para emitir el evento
  const toggleMaximize = () => {
    if (!windowManager.isMaximized.value) {
      emit('maximize');
    }
    windowManager.toggleMaximize();
  };

  /* ---------- BOTONES VENTANA ---------- */
  const emitClose = () => {
    emit('close');
  };

  const emitMinimize = () => {
    emit('minimize');
  };

  return {
    banner,
    typedSummary,
    isTyping,
    windowStyle: windowManager.windowStyle,
    isMaximized: windowManager.isMaximized,
    onMouseDown: windowManager.onMouseDown,
    toggleMaximize,
    emitClose,
    emitMinimize
  };
}