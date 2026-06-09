import { ref, computed, onBeforeUnmount, watch } from 'vue';

export function useWindowManager(options = {}, windowId = null) {
  const {
    defaultWidth = '640px',
    defaultHeight = '380px',
    defaultX = null,
    defaultY = null,
    maxWidth,
    maxHeight,
  } = options;

  const posX = ref(defaultX !== null ? defaultX : 0);
  const posY = ref(defaultY !== null ? defaultY : 0);
  const width = ref(defaultWidth);
  const height = ref(defaultHeight);

  const isDragging = ref(false);
  const isMaximized = ref(false);

  let dragStartX = 0;
  let dragStartY = 0;
  let initialPosX = 0;
  let initialPosY = 0;

  const preMaxPosX = ref(0);
  const preMaxPosY = ref(0);

  // Recuperar la posición si la ventana tiene un identificador
  if (windowId) {
    const saved = localStorage.getItem(`window-pos-${windowId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.x !== undefined) posX.value = parsed.x;
        if (parsed.y !== undefined) posY.value = parsed.y;
        if (parsed.isMaximized !== undefined) isMaximized.value = parsed.isMaximized;
        if (parsed.preMaxPosX !== undefined) preMaxPosX.value = parsed.preMaxPosX;
        if (parsed.preMaxPosY !== undefined) preMaxPosY.value = parsed.preMaxPosY;
      } catch (e) {}
    }
  }

  // Guardar la posición en localStorage cuando se mueve
  const savePos = () => {
    if (windowId) {
      localStorage.setItem(`window-pos-${windowId}`, JSON.stringify({ 
        x: posX.value, 
        y: posY.value,
        isMaximized: isMaximized.value,
        preMaxPosX: preMaxPosX.value,
        preMaxPosY: preMaxPosY.value
      }));
    }
  };

  watch([posX, posY, isMaximized], savePos);

  const windowStyle = computed(() => {
    if (isMaximized.value) {
      return {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        margin: '0',
        ...(maxWidth ? { maxWidth: '100%' } : {}),
        ...(maxHeight ? { maxHeight: '100%' } : {})
      };
    }

    const style = {
      position: 'absolute', // Usar posición absoluta garantiza que el arrastre no entre en conflicto
      top: `${posY.value}px`,
      left: `${posX.value}px`,
      width: width.value,
      height: height.value,
      margin: '0',
    };

    if (maxWidth) style.maxWidth = maxWidth;
    if (maxHeight) style.maxHeight = maxHeight;

    return style;
  });

  const centerWindow = () => {
    if (windowId && localStorage.getItem(`window-pos-${windowId}`)) {
      return; // Si ya tiene una posición guardada por el usuario, no la centramos
    }
    const w = parseInt(width.value) || 640;
    const h = parseInt(height.value) || 380;
    
    posX.value = Math.max(0, (window.innerWidth - w) / 2);
    posY.value = Math.max(0, (window.innerHeight - h) / 2);
  };

  const onMouseMove = (e) => {
    if (!isDragging.value || isMaximized.value) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    posX.value = initialPosX + (currentX - dragStartX);
    posY.value = initialPosY + (currentY - dragStartY);
  };

  const onMouseUp = () => {
    if (isDragging.value) {
      isDragging.value = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    }
  };

  const onMouseDown = (e) => {
    if (e.type.includes('mouse') && e.button !== 0) return;
    if (isMaximized.value) return;

    isDragging.value = true;
    dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    initialPosX = posX.value;
    initialPosY = posY.value;
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
  };

  const toggleMaximize = () => {
    if (isMaximized.value) {
      isMaximized.value = false;
      posX.value = preMaxPosX.value;
      posY.value = preMaxPosY.value;
    } else {
      preMaxPosX.value = posX.value;
      preMaxPosY.value = posY.value;
      isMaximized.value = true;
    }
  };

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  });

  return {
    posX,
    posY,
    isDragging,
    isMaximized,
    windowStyle,
    centerWindow,
    onMouseDown,
    toggleMaximize
  };
}