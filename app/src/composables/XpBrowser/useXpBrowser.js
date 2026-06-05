import { ref, onMounted } from 'vue';
import { useWindowManager } from '../shared/useWindowManager';

export function useXpBrowser() {
  const windowManager = useWindowManager({
    defaultWidth: '960px',
    defaultHeight: '600px',
    defaultX: 40,
    defaultY: 40,
    maxWidth: '1100px',
    maxHeight: '700px'
  });

  const url = ref('https://www.google.com/search?igu=1');
  const iframeSrc = ref(url.value);

  const goToUrl = () => {
    iframeSrc.value = url.value;
  };

  onMounted(() => {
    windowManager.centerWindow();
    windowManager.isMaximized.value = true;
  });

  return {
    ...windowManager,
    url,
    iframeSrc,
    goToUrl
  };
}
