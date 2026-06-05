import { nextTick, onMounted, onUnmounted, ref } from 'vue';

export function useLockScreen(emit) {
  const password = ref('');
  const errorMessage = ref('');
  const passwordInput = ref(null);

  const currentTime = ref('');
  const currentDate = ref('');
  let timer = null;

  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    currentDate.value = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const focusPassword = () => {
    nextTick(() => {
      passwordInput.value?.focus();
      passwordInput.value?.select?.();
    });
  };

  const clearPassword = () => {
    password.value = '';
    errorMessage.value = '';
    focusPassword();
  };

  const handleActionButton = () => {
    if (password.value.length >= 3) {
      submitPassword();
      return;
    }

    clearPassword();
  };

  const submitPassword = () => {
    if (password.value === '123') {
      errorMessage.value = '';
      password.value = '';
      emit('unlock');
      return;
    }

    errorMessage.value = 'Contraseña incorrecta. Inténtalo de nuevo.';
    password.value = '';
    focusPassword();
  };

  const handleRestart = () => {
    emit('restart');
  };

  const handleShutdown = () => {
    emit('shutdown');
  };

  onMounted(() => {
    focusPassword();
    updateTime();
    timer = setInterval(updateTime, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    password,
    errorMessage,
    passwordInput,
    currentTime,
    currentDate,
    handleActionButton,
    submitPassword,
    handleRestart,
    handleShutdown
  };
}
