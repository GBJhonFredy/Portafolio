<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black text-white">
    <button
      type="button"
      class="power-button mb-7 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-slate-950/85 px-5 py-2.5 text-sm font-semibold tracking-wide text-slate-100 shadow-[0_0_24px_rgba(16,185,129,0.18)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
      @click="$emit('power-on')"
    >
      <span class="power-dot"></span>
      <span>Prender</span>
    </button>
  </div>
</template> 

<script setup>
defineEmits(['power-on']);
</script>

<style scoped>
.power-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 9999px;
  background: #34d399;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.95);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>