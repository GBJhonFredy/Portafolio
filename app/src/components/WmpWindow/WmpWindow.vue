<template>
  <div class="absolute inset-0 pointer-events-none z-22">
    <div
      class="pointer-events-auto wmp-window border border-[#3B82F6] shadow-[0_10px_30px_rgba(0,0,0,0.8)] window-pop overflow-hidden flex flex-col"
      :style="windowStyle"
    >
      <!-- Title Bar -->
      <div
        class="h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move"
        @mousedown="onMouseDown"
      >
        <div class="flex items-center gap-2">
          <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
            <circle cx="16" cy="16" r="14" fill="#1E3A8A" stroke="#60A5FA" stroke-width="2"/>
            <path d="M12 10v12l10-6z" fill="#34D399"/>
            <path d="M16 2a14 14 0 0 1 10 23" fill="none" stroke="#60A5FA" stroke-width="1.5" opacity="0.5"/>
          </svg>
          <span class="text-[11px] md:text-xs font-semibold tracking-wide">
            Reproductor de Windows Media
          </span>
        </div>

              <div class="flex items-center gap-0.5">
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="$emit('minimize')"
        >
          <div class="w-2.5 h-0.5 bg-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="toggleMaximize"
        >
          <div class="w-2.5 h-2.5 border-2 border-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm ml-0.5"
          @click.stop="$emit('close')"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      </div>

      <!-- Main Body -->
      <div
        class="flex-1 flex flex-col md:flex-row min-h-0 w-full"
      >
        <!-- Left: Visualizer & Controls -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- Visualization Area -->
          <div class="flex-1 wmp-visualizer-container flex flex-col relative group">
            <div class="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
              <p class="text-[#34D399] font-bold text-sm truncate drop-shadow-[0_0_2px_rgba(16,185,129,0.8)]">
                {{ currentWmpTrack ? currentWmpTrack.title : 'Reproductor de Windows Media' }}
              </p>
              <p class="text-[#94A3B8] text-xs truncate">
                {{ currentWmpTrack ? currentWmpTrack.artist : 'Listo' }}
              </p>
            </div>
            
            <div class="flex-1 wmp-waves !gap-[1px] md:!gap-[2px]">
              <div class="wmp-wave-bar shrink min-w-[2px]" v-for="(height, i) in visualizerHeights" :key="i" :style="{ height: height + '%' }"></div>
            </div>

            <!-- Overlaid volume & progress (shows on hover) -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <div class="flex items-center gap-2 text-[10px] text-[#94A3B8] font-mono">
                <span>{{ formatTime(wmpCurrentTime) }}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="wmpProgress"
                  class="flex-1 wmp-slider"
                  @input="onSeek"
                />
                <span>{{ formatTime(wmpDuration) }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Controls -->
          <div class="h-20 shrink-0 bg-[#0F172A] border-t border-[#1E293B] flex items-center justify-between px-4 gap-4">
            
            <!-- Playback Controls -->
            <div class="flex items-center gap-3">
              <button
                class="wmp-controls-btn w-9 h-9 rounded-full flex items-center justify-center text-white"
                @click="prevWmpTrack"
              >
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              
              <button
                class="wmp-controls-btn wmp-play-btn w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                @click="toggleWmpPlay"
                :disabled="!currentWmpTrack"
              >
                <svg v-if="isWmpPlaying" viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                <svg v-else viewBox="0 0 24 24" class="w-5 h-5 fill-current ml-1"><path d="M8 5v14l11-7z"/></svg>
              </button>
              
              <button
                class="wmp-controls-btn w-9 h-9 rounded-full flex items-center justify-center text-white"
                @click="nextWmpTrack"
              >
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>

            <!-- Volume -->
            <div class="flex items-center gap-2 max-w-[100px] flex-1 hidden sm:flex">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#94A3B8] fill-current shrink-0">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="wmpVolume"
                class="wmp-slider w-full"
                @input="onVolumeChange"
              />
            </div>

          </div>
        </div>

        <!-- Right: Playlist -->
        <div class="w-full md:w-64 wmp-track-list flex flex-col h-48 md:h-auto">
          <div class="px-3 py-2 bg-[#1E293B] text-xs font-semibold text-[#94A3B8] border-b border-[#0F172A] flex justify-between">
            <span>Lista de reproducción</span>
            <span v-if="isLoading" class="animate-pulse">Cargando...</span>
          </div>
          
          <div class="flex-1 overflow-auto py-1">
            <div
              v-if="loadError"
              class="px-3 py-2 text-xs text-red-400"
            >
              {{ loadError }}
            </div>
            
            <div
              v-else-if="wmpTracks.length === 0 && !isLoading"
              class="px-3 py-2 text-xs text-[#94A3B8] italic"
            >
              No hay canciones.
            </div>

            <div
              v-for="(track, index) in wmpTracks"
              :key="track.id"
              class="wmp-track-item px-3 py-2 cursor-pointer flex items-center gap-2 group select-none"
              :class="{ 'active': isCurrentTrack(track) }"
              @dblclick="playFromRow(track)"
              @click="currentWmpIdForSelection = track.id"
            >
              <div class="w-4 flex justify-center text-[10px] text-[#64748B] group-hover:text-white">
                <span v-if="isCurrentTrack(track) && isWmpPlaying">â–¶</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-xs truncate" :class="{ 'font-bold': isCurrentTrack(track) }">{{ track.title }}</span>
                <span class="text-[10px] opacity-70 truncate">{{ track.artist }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useWindowManager } from '../../composables/shared/useWindowManager';
import { useWmpWindow } from '../../composables/WmpWindow/useWmpWindow';
import '../../styles/WmpWindow/WmpWindow.css';

const emit = defineEmits(['close', 'minimize']);

const {
  isMaximized,
  windowStyle,
  centerWindow,
  onMouseDown,
  toggleMaximize
} = useWindowManager({ 
  defaultWidth: '750px', 
  defaultHeight: '450px',
  maxWidth: '90vw',
  maxHeight: '80vh'
}, 'wmp');

const {
  wmpTracks,
  isLoading,
  loadError,
  currentWmpTrack,
  isWmpPlaying,
  wmpProgress,
  wmpCurrentTime,
  wmpDuration,
  wmpVolume,
  isCurrentTrack,
  toggleWmpPlay,
  nextWmpTrack,
  prevWmpTrack,
  playFromRow,
  seekWmp,
  setWmpVolume
} = useWmpWindow();

const currentWmpIdForSelection = ref(null);

// --- Lógica del visualizador fluido ---
const visualizerHeights = ref(Array(32).fill(10));
let visInterval = null;

watch(() => isWmpPlaying.value, (playing) => {
  if (playing) {
    visInterval = setInterval(() => {
      visualizerHeights.value = visualizerHeights.value.map((oldHeight, i) => {
        const isJump = Math.random() > 0.4; // 60% de probabilidad de salto de nivel
        const bassBoost = i < 10 ? 20 : 0; // Frecuencias graves (izq) saltan más alto
        if (isJump) return Math.min(100, Math.floor(Math.random() * 60) + 20 + bassBoost);
        return Math.max(10, oldHeight - 20); // Caída suave del pico
      });
    }, 120);
  } else {
    if (visInterval) clearInterval(visInterval);
    visualizerHeights.value = Array(32).fill(10);
  }
}, { immediate: true });

const onSeek = (e) => {
  seekWmp(e.target.value);
};

const onVolumeChange = (e) => {
  setWmpVolume(parseFloat(e.target.value));
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

onMounted(() => {
  centerWindow();
});

onBeforeUnmount(() => {
  if (visInterval) clearInterval(visInterval);
});
</script>
