<template>
  <div class="flex flex-col flex-1 bg-white relative overflow-hidden h-full">
    <!-- Encabezado -->
    <div
      class="px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs md:text-sm shrink-0"
    >
      <div class="min-w-0">
        <p class="font-semibold text-slate-800 truncate">
          Música de Portafolio Jhon Gil
        </p>
        <p class="text-[11px] text-slate-500">
          
        </p>
      </div>
      <div class="flex flex-col items-end gap-1">
        <div class="text-[10px] text-slate-500">
          {{ demoTracks.length }} canciones del sistema
        </div>
      </div>
    </div>

    <!-- Lista de canciones -->
    <div class="flex-1 overflow-auto">
      <div
        v-if="isLoading"
        class="px-4 py-4 text-[12px] text-slate-500 flex items-center gap-2"
      >
        <span class="animate-pulse">Cargando canciones...</span>
      </div>

      <div
        v-else-if="loadError"
        class="px-4 py-4 text-[12px] text-red-500"
      >
        Ocurrió un error al cargar las canciones. Revisa la consola.
      </div>

      <table
        v-else
        class="w-full text-xs md:text-sm"
      >
        <thead class="bg-slate-100 border-b border-slate-200">
          <tr class="text-left text-[11px] text-slate-500">
            <th class="w-8 px-3 py-1"></th>
            <th class="px-3 py-1">Tí­tulo</th>
            <th class="px-3 py-1 hidden md:table-cell">Artista</th>
            <th class="w-24 px-3 py-1 text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="track in demoTracks"
            :key="track.id"
            class="border-b border-slate-100 hover:bg-sky-50 cursor-pointer select-none"
            :class="{ 'bg-sky-100': selectedTrackId === track.id }"
            @click="selectedTrackId = track.id"
            @dblclick="$emit('open-wmp')"
          >
            <!-- BotÃ³n play/pausa -->
            <td class="px-3 py-1 text-[11px] text-slate-500">
              <button
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                :class="
                  isCurrentTrack(track) && isDemoPlaying
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                "
                @click.stop="toggleDemoPlayFromRow(track)"
              >
                <svg v-if="isCurrentTrack(track) && isDemoPlaying" viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                <svg v-else viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-current"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </td>

            <!-- TÃ­tulo -->
            <td class="px-3 py-1">
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#f8fafc" stroke="#94a3b8"/>
                  <polyline points="14 2 14 8 20 8" fill="#e2e8f0" stroke="#94a3b8"/>
                  <path d="M12 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 0v-5h3v2h-2v3z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1"/>
                </svg>
                <div class="flex flex-col">
                  <span class="text-[11px] md:text-xs text-slate-900">
                    {{ track.title }}
                  </span>
                  <span class="text-[10px] text-slate-500 md:hidden">
                    {{ track.artist }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Artista -->
            <td
              class="px-3 py-1 text-[11px] text-slate-600 hidden md:table-cell"
            >
              {{ track.artist }}
            </td>

            <!-- Estado -->
            <td class="px-3 py-1 text-[11px] text-slate-500 text-right">
              <span
                v-if="isCurrentTrack(track) && isDemoPlaying"
              >
                Reproduciendo
              </span>
              <span
                v-else-if="isCurrentTrack(track) && !isDemoPlaying"
              >
                Pausado
              </span>
              <span v-else>
                Listo
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!isLoading && !loadError && demoTracks.length === 0"
        class="px-4 py-6 text-center text-[12px] text-slate-500"
      >
        No hay canciones configuradas en la tabla <code>songs</code>.
      </div>
    </div>

    <!-- Controles inferiores estilo reproductor -->
    <div
      class="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-4 shrink-0"
    >
      <div class="flex-1 min-w-0">
        <p class="text-[11px] text-slate-500">
          Ahora sonando:
        </p>
        <p class="text-[12px] font-semibold text-slate-800 truncate">
          <span v-if="currentDemoTrack">
            {{ currentDemoTrack.title }}
          </span>
          <span v-else>
            Nada aún. Elige una canción o pulsa â–µ.
          </span>
        </p>
        <p class="text-[11px] text-slate-500 truncate">
          <span v-if="currentDemoTrack">
            {{ currentDemoTrack.artist }}
          </span>
          <span v-else>
            Biblioteca desde Supabase sin depender de archivos locales.
          </span>
        </p>
      </div>

      <!-- Controles demo -->
      <div class="flex items-center gap-2">
        <button
          class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
          title="Anterior"
          @click="prevDemoTrack"
        >
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold"
          :title="
            currentDemoTrack && isDemoPlaying ? 'Pausar' : 'Reproducir'
          "
          @click="toggleDemoPlay"
          :disabled="!currentDemoTrack"
        >
          <svg v-if="currentDemoTrack && isDemoPlaying" viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          <svg v-else viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button
          class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-[12px]"
          title="Siguiente"
          @click="nextDemoTrack"
        >
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMusicPlayerWindow } from '../../composables/MusicPlayerWindow/useMusicPlayerWindow';
import '../../styles/MusicPlayerWindow/MusicPlayerWindow.css';

const emit = defineEmits(['open-wmp', 'navigate']);
const selectedTrackId = ref(null);

const {
  demoTracks,
  isLoading,
  loadError,
  currentDemoTrack,
  isDemoPlaying,
  isCurrentTrack,
  toggleDemoPlay,
  nextDemoTrack,
  prevDemoTrack,
  toggleDemoPlayFromRow,
  playFromRow
} = useMusicPlayerWindow();
</script>
