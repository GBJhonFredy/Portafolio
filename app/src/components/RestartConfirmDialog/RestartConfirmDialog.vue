<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 text-slate-900">
    <div class="w-full max-w-md overflow-hidden rounded-xl border border-slate-500 bg-slate-100 shadow-[0_24px_70px_rgba(0,0,0,0.48)]">
      <div class="flex items-center gap-2 bg-gradient-to-b from-sky-600 to-sky-800 px-4 py-2 text-white">
        <div class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[0.75rem] font-bold">
          ?
        </div>
        <p class="text-sm font-semibold">Reiniciar Portafolio</p>
      </div>

      <div class="flex gap-4 px-5 py-6">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl shadow-inner">
          !
        </div>
 
        <div>
          <p class="text-sm font-semibold text-slate-800">¿Realmente desea reiniciar?</p>
          <p class="mt-1 text-sm leading-6 text-slate-600">
            Se cerrará la sesión actual y volverá a mostrarse la pantalla de inicio.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-slate-300 bg-slate-200 px-5 py-3">
        <button
          type="button"
          class="rounded-md border border-slate-400 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="handleCancel"
        >
          No
        </button>
        <button
          type="button"
          class="rounded-md border border-sky-700 bg-gradient-to-b from-sky-500 to-sky-700 px-4 py-1.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:from-sky-400 hover:to-sky-600"
          @click="handleConfirm"
        >
          Sí
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRestartConfirmDialog } from '../../composables/RestartConfirmDialog/useRestartConfirmDialog';

const emit = defineEmits(['confirm', 'cancel']);
const { handleConfirm, handleCancel } = useRestartConfirmDialog(emit);
</script>
