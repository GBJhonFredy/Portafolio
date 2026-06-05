<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#5A7EDC] text-white overflow-hidden font-sans">
    
    <!-- Top and bottom dark blue bars typical of Windows XP -->
    <div class="absolute top-0 w-full h-20 md:h-24 bg-gradient-to-r from-[#172A74] via-[#2A4BBA] to-[#172A74] border-b-[3px] border-[#E18D4D] shadow-lg"></div>
    <div class="absolute bottom-0 w-full h-20 md:h-24 bg-gradient-to-r from-[#172A74] via-[#2A4BBA] to-[#172A74] border-t-[3px] border-[#E18D4D] shadow-[0_-4px_10px_rgba(0,0,0,0.3)]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center text-center animate-pulse-slow">
      <div class="flex items-center gap-3 mb-6 md:mb-8">
        <!-- Classic Portafolio Logo -->
        <svg viewBox="0 0 88 88" class="w-14 h-14 md:w-16 md:h-16 drop-shadow-md">
          <path d="M0,12 L40,6 L40,42 L0,42 L0,12 Z" fill="#f25022"/>
          <path d="M44,5 L88,0 L88,42 L44,42 L44,5 Z" fill="#7fba00"/>
          <path d="M0,46 L40,46 L40,82 L0,76 L0,46 Z" fill="#00a4ef"/>
          <path d="M44,46 L88,46 L88,88 L44,83 L44,46 Z" fill="#ffb900"/>
        </svg>
        <span class="text-4xl md:text-5xl font-bold italic tracking-tight drop-shadow-md" style="font-family: 'Franklin Gothic Medium', 'Trebuchet MS', sans-serif;">Portafolio de <span class="text-[#ffb900] ml-1">Jhon Gil</span></span>
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
