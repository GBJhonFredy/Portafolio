import { onMounted } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';

export function useMyPcExplorer() {
  const windowManager = useWindowManager({
    defaultWidth: '900px',
    defaultHeight: '350px',
    maxWidth: '1100px'
  });

  onMounted(() => {
    windowManager.centerWindow();
  });

  return {
    ...windowManager
  };
}
