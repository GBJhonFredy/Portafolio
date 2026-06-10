<template>
  <div
    class="window-pop bg-[#192438] p-[3px] shadow-[0_10px_30px_rgba(15,23,42,0.75)] pointer-events-auto rounded-t-xl rounded-b-md flex flex-col overflow-hidden"
    :style="windowStyle"
  >
    <!-- Barra de título -->
    <div
      class="h-8 bg-[#192438] flex items-center justify-between px-2 cursor-pointer select-none cursor-move shrink-0 rounded-t-lg mb-[2px]"
      @mousedown="onMouseDown"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-xs md:text-sm font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] truncate">
          Información principal y funcionamiento del portafolio
        </span>
      </div>

      <div class="flex items-center gap-0.5 shrink-0">
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#3d557d] to-[#192438] border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          title="Minimizar"
          @click.stop="$emit('minimize')"
        >
          <div class="w-2.5 h-0.5 bg-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#3d557d] to-[#192438] border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          :title="isMaximized ? 'Restaurar' : 'Maximizar'"
          @click.stop="toggleMaximize"
        >
          <div class="w-2.5 h-2.5 border-2 border-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm ml-0.5"
          title="Cerrar"
          @click.stop="$emit('close')"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenido -->
    <div
      class="flex-1 bg-[#ece9d8] overflow-hidden rounded-b-sm flex flex-col"
    >
      <div class="bg-white h-full border border-[#aca899] m-1 p-5 md:p-6 overflow-y-auto rounded-sm text-sm text-slate-800 font-sans shadow-inner">
        
        <!-- Header perfil -->
        <div
          class="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6 bg-gradient-to-r from-sky-50 to-white border border-sky-100 rounded-xl p-5 shadow-sm"
        >
          <!-- Foto grande -->
          <div
            class="relative w-36 h-36 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-[4px] border-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] bg-slate-900"
          >
            <div
              class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_0,rgba(56,189,248,0.3),transparent_60%),radial-gradient(circle_at_90%_100%,rgba(129,140,248,0.35),transparent_55%)] mix-blend-screen"
            ></div>
            <img
              src="/foto.png"
              alt="Jhon Gil"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Datos -->
          <div class="flex-1 w-full text-center md:text-left">
            <h1
              class="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight"
            >
              Jhon Fredy Gil
            </h1>
            <p class="text-sm font-semibold text-sky-700 mb-1 uppercase">
              Desarrollador frontend
            </p>
            <p class="text-xs text-slate-500 mb-4">
              Medellín, Colombia
            </p>

            <!-- Chips de stack -->
            <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700 shadow-sm"
              >
                Vue 3
              </span>
              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 shadow-sm"
              >
                Tailwind CSS
              </span>
              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 shadow-sm"
              >
                Supabase
              </span>
            </div>

            <p class="text-[13px] text-slate-600 leading-relaxed bg-white/60 p-3 rounded-lg border border-slate-100">
              Este portafolio simula un sistema operativo completo, pensado para
              que explores mis proyectos jugando con ventanas, íconos,
              aplicaciones y animaciones, como si fuera un PC real.
            </p>
          </div>
        </div>

        <hr class="my-6 border-slate-100" />

        <!-- Sección: Acerca -->
        <section class="mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white text-sm shadow-md font-serif italic"
            >
              i
            </span>
            Acerca de este portafolio
          </h2>
          <p class="mb-3 leading-relaxed text-[13.5px] text-slate-700">
            Este proyecto recrea la apariencia y el comportamiento de Windows XP,
            pero enfocado en mostrar mis habilidades como desarrollador frontend.
            Cada aplicación dentro del “sistema” representa una parte de lo que sé
            hacer: desde interfaces interactivas hasta conexiones con servicios en
            la nube.
          </p>
          <p class="leading-relaxed text-[13.5px] text-slate-700">
            La idea es que no solo veas pantallas estáticas, sino que juegues con
            ventanas, arrastres íconos, abras programas, escuches música y me
            puedas escribir mensajes, todo dentro del mismo entorno.
          </p>
        </section>

        <!-- Sección: Cómo funciona -->
        <section class="mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span class="text-sky-500 text-xl">⚙️</span> ¿Cómo funciona?
          </h3>
          <ul class="space-y-3 leading-relaxed text-[13.5px] text-slate-700">
            <li class="flex items-start gap-2">
              <span class="text-sky-500 font-bold mt-0.5">•</span>
              <span><strong class="font-semibold text-slate-900">Escritorio interactivo:</strong>
              puedes mover los íconos arrastrándolos y hacer doble clic para abrir
              las “aplicaciones”, igual que en un sistema operativo real.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-500 font-bold mt-0.5">•</span>
              <span><strong class="font-semibold text-slate-900">Menú de inicio:</strong>
              desde la esquina inferior izquierda accedes a las apps principales
              y a las opciones de apagar, reiniciar o bloquear el portafolio.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-500 font-bold mt-0.5">•</span>
              <span><strong class="font-semibold text-slate-900">Barra de tareas:</strong>
              ahí ves todas las ventanas abiertas; puedes minimizar, restaurar y
              cambiar entre ellas con un solo clic.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-500 font-bold mt-0.5">•</span>
              <span><strong class="font-semibold text-slate-900">Ventanas dinámicas:</strong>
              cada app se abre en su propia ventana, que puedes mover, maximizar,
              minimizar y cerrar.</span>
            </li>
          </ul>
        </section>

        <!-- Sección: Aplicaciones -->
        <section class="mb-6">
          <h3 class="text-lg font-bold text-slate-800 mb-4">
            Aplicaciones destacadas
          </h3>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]"
          >
            <!-- Code Studio -->
            <div
              class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5 group-hover:text-sky-600 transition-colors">
                <span class="text-lg">💻</span> Code Studio
              </h4>
              <p class="text-slate-600 leading-relaxed">
                Mini-editor de código para HTML, CSS y JS. Presiona
                <span class="font-semibold">“Ejecutar”</span>
                para ver la vista previa dentro de una ventana tipo Firefox.
              </p>
            </div>

            <!-- Messenger -->
            <div
              class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5 group-hover:text-sky-600 transition-colors">
                <span class="text-lg">💬</span> Messenger
              </h4>
              <p class="text-slate-600 leading-relaxed">
                Un chat en tiempo real donde puedes dejarme mensajes. Recibo
                notificaciones por correo y puedo responderte desde un panel de
                administración.
              </p>
            </div>

            <!-- Música -->
            <div
              class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-1.5 group-hover:text-sky-600 transition-colors">
                <span class="text-lg">🎵</span> Música
              </h4>
              <p class="text-slate-600 leading-relaxed">
                Reproductor conectado a
                <span class="font-semibold">Supabase Storage</span>.
                La música sigue sonando aunque cierres la ventana del reproductor.
              </p>
            </div>
          </div>
        </section>

        <hr class="my-6 border-slate-100" />

        <!-- Footer -->
        <p class="text-[11.5px] text-center text-slate-500 bg-slate-50 py-3 rounded-lg border border-slate-100">
          Este portafolio fue construido con
          <span class="font-bold text-slate-700">Vue 3</span>,
          <span class="font-bold text-slate-700">Tailwind CSS</span>,
          <span class="font-bold text-slate-700">Supabase</span>
          y mucho cariño por la estética de
          <span class="font-bold text-sky-600">Windows XP</span>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';

defineEmits(['close', 'minimize']);

const {
  isMaximized,
  windowStyle,
  centerWindow,
  onMouseDown,
  toggleMaximize,
} = useWindowManager(
  {
    defaultWidth: '700px',
    defaultHeight: '550px',
    maxWidth: '1000px',
    maxHeight: '800px',
  },
  'info-readme',
);

onMounted(() => {
  centerWindow();
});
</script>