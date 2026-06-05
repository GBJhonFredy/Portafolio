import { onMounted } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';

export function useBrowserWindow() {
  const windowManager = useWindowManager({
    defaultWidth: '960px',
    defaultHeight: '600px',
    defaultX: 40,
    defaultY: 40,
    maxWidth: '1100px',
    maxHeight: '700px'
  });

  onMounted(() => {
    windowManager.centerWindow();
    windowManager.isMaximized.value = true;
  });

  return {
    ...windowManager
  };
}
