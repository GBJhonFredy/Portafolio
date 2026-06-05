<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden">
    <div class="flex flex-col items-center">
      <!-- Windows Logo Group -->
      <div class="mb-16 flex items-end justify-center">
        <!-- Logo -->
        <svg viewBox="0 0 88 88" class="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg mr-4">
          <path d="M0,12 L40,6 L40,42 L0,42 L0,12 Z" fill="#f25022"/>
          <path d="M44,5 L88,0 L88,42 L44,42 L44,5 Z" fill="#7fba00"/>
          <path d="M0,46 L40,46 L40,82 L0,76 L0,46 Z" fill="#00a4ef"/>
          <path d="M44,46 L88,46 L88,88 L44,83 L44,46 Z" fill="#ffb900"/>
        </svg>

        <!-- Microsoft Windows XP Text -->
        <div class="flex flex-col mb-1">
          <span class="text-sm font-semibold tracking-widest text-white/90" style="font-family: Arial, sans-serif;">Developer</span>
          <span class="text-5xl md:text-6xl font-bold italic tracking-tight drop-shadow-md leading-none" style="font-family: 'Franklin Gothic Medium', 'Trebuchet MS', sans-serif;">
            Portafolio de <span class="text-[#ffb900] ml-1">Jhon Gil</span>
          </span>
        </div>
      </div>

      <!-- Classic Boot Loader Bar -->
      <div class="boot-panel flex w-full max-w-[14rem] flex-col items-center p-[2px] rounded border-[3px] border-[#8e8e8e]">
        <div class="boot-loader h-[1rem] w-full bg-black relative overflow-hidden">
          <div class="boot-loader-track flex gap-1 h-full absolute w-[60%]">
            <div class="flex-1 bg-gradient-to-b from-[#2A4BBA] via-[#5A7EDC] to-[#172A74] rounded-[1px]"></div>
            <div class="flex-1 bg-gradient-to-b from-[#2A4BBA] via-[#5A7EDC] to-[#172A74] rounded-[1px]"></div>
            <div class="flex-1 bg-gradient-to-b from-[#2A4BBA] via-[#5A7EDC] to-[#172A74] rounded-[1px]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../styles/BootLoadingScreen/BootLoadingScreen.css"></style>
