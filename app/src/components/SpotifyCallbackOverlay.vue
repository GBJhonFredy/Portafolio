<template>
  <div
    v-if="isCallback"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 text-slate-100"
  >
    <div class="bg-slate-800 border border-slate-600 rounded-md px-6 py-4 max-w-sm w-full text-center">
      <h2 class="text-sm font-semibold mb-2">
        Volviendo de Spotify...
      </h2>
      <p class="text-xs text-slate-300 mb-3">
        Estamos leyendo los datos de autenticación.  
        Este paso lo usaremos luego para obtener el access token.
      </p>
      <p class="text-[11px] text-slate-400 break-all">
        Código en la URL: 
        <span v-if="code">
          {{ code }}
        </span>
        <span v-else>
          (aún no se detecta ningún código)
        </span>
      </p>

      <button
        class="mt-4 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px]"
        @click="closeOverlay"
      >
        Volver al escritorio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Muestra el overlay solo si la URL contiene /callback
const isCallback = ref(false);
const code = ref('');

onMounted(() => {
  const url = new URL(window.location.href);

  // Si la ruta contiene /callback, mostramos el overlay
  if (url.pathname.includes('/callback')) {
    isCallback.value = true;

    // Leer el parámetro "code" que envía Spotify
    const c = url.searchParams.get('code');
    if (c) {
      code.value = c;
    }
  }
});

const closeOverlay = () => {
  // Quitar los parámetros de la URL y volver a la raíz de tu app
  window.history.replaceState({}, '', '/');
  isCallback.value = false;
};
</script>