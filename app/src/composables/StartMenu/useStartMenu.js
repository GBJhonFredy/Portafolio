import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useStartMenu(emit) {
  const rootEl = ref(null);
  const isOpen = ref(false);

  const closeMenu = () => {
    isOpen.value = false;
  };

  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };

  const openMyPc = () => {
    emit('open-my-pc');
    closeMenu();
  };

  const emitAction = (action) => {
    emit(action);
    closeMenu();
  };

  const handleDocumentPointerDown = (event) => {
    const root = rootEl.value;
    if (!root || root.contains(event.target)) {
      return;
    }

    closeMenu();
  };

  onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
  });

  return {
    rootEl,
    isOpen,
    toggleMenu,
    openMyPc,
    emitAction
  };
}