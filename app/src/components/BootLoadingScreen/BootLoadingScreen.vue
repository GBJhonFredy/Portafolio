<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden">
    <div class="flex flex-col items-center">
      <!-- Windows Logo Group -->
      <div class="mb-16 flex items-end justify-center">
        <!-- Logo -->
        <svg
          viewBox="0 0 24 24"
          class="w-20 h-20 md:w-24 md:h-24 text-sky-500 drop-shadow-lg mr-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>

        <!-- Microsoft Windows XP Text -->
        <div class="flex flex-col mb-1">
          <span class="text-sm font-semibold tracking-widest text-slate-400 font-sans">
            Developer
          </span>
          <span
            class="text-5xl md:text-6xl font-bold italic tracking-tight drop-shadow-md leading-none font-sans"
          >
            Portafolio de <span class="text-sky-400 ml-1">Jhon Gil</span>
          </span>
        </div>
      </div>

      <!-- Classic Boot Loader Bar -->
      <div
        class="boot-panel flex w-full max-w-[14rem] flex-col items-center p-[2px] rounded border-[3px] border-slate-700 bg-slate-900"
      >
        <div class="boot-loader h-[1rem] w-full bg-black relative overflow-hidden">
          <div class="boot-loader-track flex gap-1 h-full absolute w-[60%]">
            <div
              class="flex-1 bg-gradient-to-b from-sky-700 via-sky-400 to-sky-700 rounded-[1px]"
            ></div>
            <div
              class="flex-1 bg-gradient-to-b from-sky-700 via-sky-400 to-sky-700 rounded-[1px]"
            ></div>
            <div
              class="flex-1 bg-gradient-to-b from-sky-700 via-sky-400 to-sky-700 rounded-[1px]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Avisamos al padre cuando termine el boot
const emit = defineEmits(['boot-finished']);

let timeoutId = null;

onMounted(() => {
  // Esperamos 3 segundos (3000 ms) y luego emitimos el evento
  timeoutId = window.setTimeout(() => {
    emit('boot-finished');
  }, 3000);
});

onUnmounted(() => {
  // Por seguridad, limpiamos el timeout si se desmonta antes
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<style scoped src="../../styles/BootLoadingScreen/BootLoadingScreen.css"></style>