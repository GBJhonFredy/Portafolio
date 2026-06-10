<template>
  <div class="flex flex-col border-b border-slate-300 bg-[#ebeadb] text-slate-800 text-[11px] md:text-xs">
    <!--  Barra de direcciones -->
    <div class="flex items-center gap-2 p-1 pl-2">
       <button 
        class="flex items-center gap-1 px-2 py-1 rounded-sm border border-transparent hover:border-slate-300 hover:shadow-sm hover:bg-[#faf9f6] active:bg-[#e0dfd6] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canGoBack"
        @click="$emit('back')"
      >
        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-green-600">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2 14l-4-4 4-4v8z"/>
        </svg>
        <span>Atrás</span>
      </button>

      <div class="w-px h-5 bg-slate-300 mx-1"></div>
      <div class="flex-1 flex items-center bg-white border border-slate-400 shadow-inner px-1 gap-1">
        <!-- Icono de la direcciÃ³n actual -->
        <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0" v-if="currentIcon === 'my-pc'">
          <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
          <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
        </svg>
        <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0" v-else-if="currentIcon === 'folder'">
          <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0" v-else-if="currentIcon === 'disk'">
          <rect x="3" y="10" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
        </svg>
        <input 
          type="text" 
          class="flex-1 bg-transparent outline-none w-full text-slate-800"
          :value="currentPath"
          readonly
        />

      </div>
     
    </div>
  </div>
</template>

<script setup>
defineProps({
  canGoBack: {
    type: Boolean,
    default: false
  },
  canGoForward: {
    type: Boolean,
    default: false
  },
  currentPath: {
    type: String,
    default: 'Mi PC'
  },
  currentIcon: {
    type: String,
    default: 'my-pc' // 'my-pc', 'folder', 'disk'
  }
});

defineEmits(['back', 'forward', 'up']);
</script>
