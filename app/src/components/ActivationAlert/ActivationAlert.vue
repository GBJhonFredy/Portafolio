<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 text-slate-900">
    <div class="w-full max-w-sm overflow-hidden rounded-lg border-t-2 border-x-2 border-b-4 border-slate-100 border-b-slate-600 border-r-slate-600 bg-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div class="flex items-center gap-2 bg-gradient-to-b from-sky-600 to-sky-800 px-3 py-1.5 text-white">
        <p class="text-sm font-bold">Activación Requerida</p>
      </div>

      <div class="flex gap-4 px-5 py-6">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center">
          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white shadow-inner border-2 border-white/80">
            !
          </div>
        </div>
 
        <div>
          <p class="mt-1 text-sm leading-6 text-slate-800">
            Debes ejecutar el <strong>Activador</strong> primero para poder usar las aplicaciones del portafolio.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 border-t border-slate-300 bg-slate-200 px-5 py-3">
        <button
          type="button"
          class="min-w-[80px] rounded-md border border-slate-900 bg-gradient-to-b from-slate-100 to-slate-300 px-4 py-1 text-sm font-semibold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:from-slate-50 hover:to-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-200"
          @click="$emit('close')"
        >
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>