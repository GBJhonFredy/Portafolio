<template>
  <div class="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden text-white font-sans">
    <!-- Background Image with Blur -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
      style="background-image: url('/xp-bliss.avif'); filter: blur(16px) brightness(0.6);"
    ></div>
     
    <!-- Time & Date -->
    <div class="absolute top-20 left-0 right-0 flex flex-col items-center text-white/90 drop-shadow-lg select-none">
      <h1 class="text-7xl md:text-8xl font-light tracking-wide">{{ currentTime }}</h1>
      <p class="text-xl md:text-2xl font-medium mt-3 capitalize">{{ currentDate }}</p>
    </div>

    <!-- Login Container -->
    <div class="relative z-10 flex w-[min(90vw,24rem)] flex-col items-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 mt-20">
      
      <!-- Avatar -->
      <div class="relative group">
        <div class="absolute inset-0 rounded-full bg-blue-500/40 blur-xl transition-all duration-500 group-hover:bg-blue-400/60"></div>
        <div class="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white/40 shadow-xl overflow-hidden">
           <svg viewBox="0 0 24 24" class="h-14 w-14 text-white drop-shadow-md" aria-hidden="true">
            <path
              d="M12 12.2a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Zm0 2.2c-4.1 0-7.5 2.5-7.5 5.6V21h15v-.99c0-3.11-3.4-5.61-7.5-5.61Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div class="mt-6 w-full text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-white drop-shadow-sm">Administrador</h2>
        <p class="mt-1 text-sm font-medium text-white/70">Sesión bloqueada</p>

        <form class="mt-8 relative" @submit.prevent="submitPassword">
          <label class="sr-only" for="lock-password">Contraseña</label>
          <div class="group relative flex items-center">
            <input
              id="lock-password"
              ref="passwordInput"
              v-model="password"
              type="password"
              class="w-full rounded-xl bg-black/20 border border-white/10 px-5 py-4 pr-14 text-base text-white outline-none placeholder:text-white/50 backdrop-blur-sm transition-all focus:bg-black/40 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30"
              autocomplete="current-password"
              placeholder="Escribe la contraseña"
            />

            <button
              type="button"
              class="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg transition-all"
              :class="password.length >= 3 ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg scale-105' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'"
              :aria-label="password.length >= 3 ? 'Entrar' : 'Limpiar contraseña'"
              @click="handleActionButton"
            >
              <svg v-if="password.length >= 3" viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="h-6 mt-3">
            <transition name="fade">
              <p v-if="errorMessage" class="text-sm font-medium text-red-300 drop-shadow-sm">
                {{ errorMessage }}
              </p>
            </transition>
          </div>
        </form>
      </div>
    </div>

    <!-- Power Controls -->
    <div class="absolute bottom-8 right-8 flex gap-4 z-10">
      <button 
        @click="emit('restart')"
        class="group flex flex-col items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
        title="Reiniciar"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/10 group-hover:bg-black/40 group-hover:border-white/30 transition-all group-hover:scale-105">
          <svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </div>
        <span class="text-xs font-medium tracking-wide">Reiniciar</span>
      </button>

      <button 
        @click="emit('shutdown')"
        class="group flex flex-col items-center justify-center gap-2 text-white/70 hover:text-red-400 transition-colors"
        title="Apagar"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all group-hover:scale-105">
          <svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </div>
        <span class="text-xs font-medium tracking-wide">Apagar</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['unlock']);

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

onMounted(() => {
  focusPassword();
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px rgba(0,0,0,0.4) inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
