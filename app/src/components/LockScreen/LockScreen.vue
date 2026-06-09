<template>
  <div class="fixed inset-0 z-50 flex flex-col font-sans cursor-default select-none overflow-hidden bg-slate-800">
    
    <!-- Top Banner -->
    <div class="h-20 bg-slate-950 w-full relative flex items-center">
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-950 via-sky-500 to-slate-950 opacity-70"></div>
    </div>

    <!-- Center Area -->
    <div class="flex-1 flex items-center justify-center relative bg-gradient-to-b from-slate-700 to-slate-800">
      <div class="flex items-center w-full max-w-4xl px-8">
        
        <!-- Left Side -->
        <div class="flex-1 flex flex-col items-end pr-10">
          <h1 class="text-4xl font-bold italic mb-4 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
            Portafolio <span class="text-sky-400 font-normal">Jhon Gil</span>
          </h1>
          <p class="text-[13px] text-white/90 drop-shadow-md">
            Para empezar, haga clic en su nombre de usuario
          </p>
        </div>

        <!-- Divider -->
        <div class="w-px h-72 bg-gradient-to-b from-transparent via-white/40 to-transparent shadow-[1px_0_1px_rgba(0,0,0,0.2)]"></div>

        <!-- Right Side (User) -->
        <div class="flex-1 flex flex-col pl-10">
          <div class="flex items-center gap-4 p-2 rounded hover:bg-white/5 transition-colors group">
            <!-- Avatar -->
            <div class="w-[64px] h-[64px] rounded-[4px] border-2 border-white shadow-[0_2px_5px_rgba(0,0,0,0.5)] overflow-hidden bg-slate-700 relative shrink-0">
              <div class="absolute inset-0 border-2 border-sky-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-600">
                 <svg viewBox="0 0 24 24" class="h-10 w-10 text-white drop-shadow-md" aria-hidden="true">
                  <path d="M12 12.2a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Zm0 2.2c-4.1 0-7.5 2.5-7.5 5.6V21h15v-.99c0-3.11-3.4-5.61-7.5-5.61Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <!-- Form -->
            <div class="flex flex-col w-full justify-center">
              <h2 class="text-[18px] font-bold text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)] mb-2">Administrador</h2>
              
              <form class="flex items-center" @submit.prevent="submitPassword">
                <div class="relative flex items-center bg-white border border-gray-400 shadow-inner rounded-sm overflow-hidden w-56">
                  <input
                    id="lock-password"
                    ref="passwordInput"
                    v-model="password"
                    type="password"
                    class="w-full px-2 py-1.5 text-xs text-black outline-none"
                    placeholder="Intenta con 123"
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    class="w-7 h-7 m-0.5 flex items-center justify-center rounded-sm bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-800 shadow-sm hover:brightness-110 active:brightness-90 transition-all cursor-pointer"
                    @click="handleActionButton"
                  >
                    <svg viewBox="0 0 24 24" class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
              
              <!-- Error message space -->
              <div class="h-4 mt-1">
                <transition name="fade">
                  <p v-if="errorMessage" class="text-[11px] text-[#ffb0b0] font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
                    {{ errorMessage }}
                  </p>
                </transition>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Banner -->
    <div class="h-24 bg-slate-950 w-full relative flex items-center justify-between px-10">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-slate-950 via-sky-500 to-slate-950 opacity-70"></div>
      
      <!-- Controls -->
      <div class="flex items-center gap-6 z-10">
        <button @click="handleShutdown" class="flex items-center gap-2 group cursor-pointer">
          <div class="w-8 h-8 rounded-[4px] bg-gradient-to-b from-rose-500 to-rose-700 border border-white/80 shadow-[1px_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:brightness-110 group-active:scale-95 transition-all">
            <svg viewBox="0 0 24 24" class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
          </div>
          <span class="text-white text-[13px] group-hover:underline drop-shadow-md">Apagar equipo</span>
        </button>
        
        <button @click="handleRestart" class="flex items-center gap-2 group cursor-pointer">
          <div class="w-8 h-8 rounded-[4px] bg-gradient-to-b from-emerald-500 to-emerald-700 border border-white/80 shadow-[1px_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:brightness-110 group-active:scale-95 transition-all">
            <svg viewBox="0 0 24 24" class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </div>
          <span class="text-white text-[13px] group-hover:underline drop-shadow-md">Reiniciar equipo</span>
        </button>
      </div>
      
      <!-- Time and branding -->
      <div class="text-right text-white drop-shadow-md z-10 flex flex-col items-end">
         <span class="font-bold text-xl italic mb-0.5">Portafolio <span class="text-sky-400 font-normal">Jhon Gil</span></span>
         <span class="text-sky-200 text-xs">{{ currentTime }} - {{ currentDate }}</span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useLockScreen } from '../../composables/LockScreen/useLockScreen';

const emit = defineEmits(['unlock', 'restart', 'shutdown']);

const {
  password,
  errorMessage,
  passwordInput,
  currentTime,
  currentDate,
  handleActionButton,
  submitPassword,
  handleRestart,
  handleShutdown
} = useLockScreen(emit);
</script>

<style scoped src="../../styles/LockScreen/LockScreen.css"></style>
