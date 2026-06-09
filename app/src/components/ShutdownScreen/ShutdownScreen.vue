<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-800 text-white overflow-hidden font-sans">
    
    <!-- Top and bottom bars -->
    <div class="absolute top-0 w-full h-20 md:h-24 bg-slate-950 border-b-[3px] border-sky-500 shadow-lg"></div>
    <div class="absolute bottom-0 w-full h-20 md:h-24 bg-slate-950 border-t-[3px] border-sky-500 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center text-center animate-pulse-slow">
      <div class="flex items-center gap-3 mb-6 md:mb-8">
        <!-- Power Icon -->
        <svg viewBox="0 0 24 24" class="w-14 h-14 md:w-16 md:h-16 text-sky-500 drop-shadow-md" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
        <span class="text-4xl md:text-5xl font-bold italic tracking-tight drop-shadow-md">
          Portafolio de <span class="text-sky-400 ml-1">Jhon Gil</span>
        </span>
      </div>
 
      <p class="text-xl md:text-2xl font-medium tracking-wide drop-shadow-md text-white/95">
        Apagando el equipo...
      </p>
    </div>

    <!-- CRT Turn off effect at the end -->
    <div class="crt-off-overlay"></div>
  </div>
</template>

<style scoped src="../../styles/ShutdownScreen/ShutdownScreen.css"></style>
