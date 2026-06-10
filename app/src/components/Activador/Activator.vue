<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div
      class="window-pop bg-black text-slate-900 border-2 border-t-slate-100 border-l-slate-100 border-r-slate-800 border-b-slate-800 shadow-lg pointer-events-auto"
      :style="windowStyle"
    >
      <div
        class="flex items-center justify-between px-2 py-0.5 bg-gray-700 text-white select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <span class="text-xs font-mono">C:\WINDOWS\system32\cmd.exe</span>
        <div class="flex items-center gap-[2px] text-[9px]">
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-600 border border-slate-900 hover:bg-slate-500"
            title="Minimizar"
            @click.stop="$emit('minimize')"
          >
            _
          </button>
          <button
            class="w-5 h-4 flex items-center justify-center bg-slate-600 border border-slate-900 hover:bg-slate-500"
            title="Maximizar"
            disabled
          >
            ☐
          </button>
          <button
            class="w-5 h-4 flex items-center justify-center bg-red-600 border border-slate-900 hover:bg-red-500"
            title="Cerrar"
            @click.stop="$emit('close')"
          >
            ✕
          </button>
        </div>
      </div>
      <div class="p-2 bg-black overflow-y-auto h-[calc(100%-22px)] text-sm text-gray-200 font-mono">
        <p v-for="(line, index) in outputLines" :key="index" class="whitespace-pre-wrap" v-html="line"></p>
        <div v-if="showCursor" class="inline-block w-2 h-4 bg-gray-200 animate-pulse ml-1"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useActivador } from '../../composables/Activador/useActivador';

const emit = defineEmits(['close', 'minimize', 'activated']);

const { windowStyle, centerWindow, onMouseDown } = useWindowManager(
  { defaultWidth: '550px', defaultHeight: '350px' },
  'activator'
);

const { outputLines, showCursor } = useActivador(emit);

onMounted(() => {
  centerWindow();
});
</script>