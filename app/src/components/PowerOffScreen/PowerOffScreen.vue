<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black text-white">
    <button
      type="button"
      class="power-button mb-7 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-slate-950/85 px-5 py-2.5 text-sm font-semibold tracking-wide text-slate-100 shadow-[0_0_24px_rgba(16,185,129,0.18)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
      @click="handlePowerOn"
    >
      <span class="power-dot"></span>
      <span>Prender</span>
    </button>
  </div>
</template>

<script setup>
import { usePowerOffScreen } from '../../composables/PowerOffScreen/usePowerOffScreen';

const emit = defineEmits(['power-on']);
const { handlePowerOn } = usePowerOffScreen(emit);
</script>

<style scoped src="../../styles/PowerOffScreen/PowerOffScreen.css"></style>
