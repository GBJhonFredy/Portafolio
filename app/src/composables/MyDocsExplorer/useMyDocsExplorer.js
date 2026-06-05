import { onMounted } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';

export function useMyDocsExplorer() {
  const windowManager = useWindowManager({
    defaultWidth: '600px',
    defaultHeight: '300px',
    maxWidth: '900px'
  });

  onMounted(() => {
    windowManager.centerWindow();
  });

  return {
    ...windowManager
  };
}
