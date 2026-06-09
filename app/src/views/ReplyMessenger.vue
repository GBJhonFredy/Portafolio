<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <!-- Barra superior -->
    <header class="w-full border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <h1 class="text-lg font-bold text-sky-400">
        Panel de Respuestas · Messenger
      </h1>
      <router-link
        to="/"
        class="text-sm text-slate-400 hover:text-sky-300 transition-colors"
      >
        Volver al portafolio
      </router-link>
    </header>

    <!-- Contenido principal -->
    <main class="flex-1 flex bg-slate-900/60 border-t border-slate-800 overflow-hidden">
      <!-- Columna izquierda: lista de usuarios -->
      <aside class="w-64 border-r border-slate-800 bg-slate-950/60 flex flex-col">
        <div class="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
          Usuarios del Messenger
        </div>

        <div class="flex-1 overflow-y-auto text-xs">
          <div
            v-if="loadingUsers"
            class="p-3 text-slate-500"
          >
            Cargando usuarios...
          </div>

          <div
            v-else-if="!users.length"
            class="p-3 text-slate-500"
          >
            No hay usuarios todavía.
          </div>

          <button
            v-for="u in users"
            :key="u.id"
            class="w-full text-left px-3 py-2 border-b border-slate-800 flex flex-col gap-0.5 hover:bg-slate-800/80 transition-colors"
            :class="u.id === selectedUserId ? 'bg-slate-800/80 text-sky-300' : 'text-slate-200'"
            @click="selectedUserId = u.id"
          >
            <span class="text-[11px] font-semibold truncate">
              {{ u.name || 'Sin nombre' }}
            </span>
            <span class="text-[10px] text-slate-400 truncate">
              {{ u.email || 'Sin email' }}
            </span>
          </button>
        </div>
      </aside>

      <!-- Columna derecha: chat con el usuario seleccionado -->
      <section class="flex-1 flex flex-col">
        <!-- Header del usuario -->
        <div class="h-14 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 gap-3">
          <div class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
            <svg viewBox="0 0 32 32" class="w-6 h-6 text-slate-500">
              <circle cx="16" cy="12" r="6" fill="currentColor" />
              <path d="M8 26c0-6 4-10 8-10s8 4 8 10" fill="currentColor" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-slate-100">
                {{ selectedUser?.name || 'Selecciona un usuario' }}
              </p>
              <span
                v-if="selectedUser"
                class="text-[10px] text-emerald-400 border border-emerald-500/60 px-1 rounded-sm"
              >
                activo
              </span>
            </div>
            <p class="text-[11px] text-slate-400">
              {{ selectedUser?.email || 'Sin email' }}
            </p>
          </div>
        </div>

        <!-- Área de mensajes -->
        <div class="flex-1 flex flex-col">
          <div class="flex-1 overflow-y-auto p-3 bg-slate-900/70 text-[12px]">
            <div
              v-if="loadingMessages && selectedUser"
              class="text-slate-400"
            >
              Cargando mensajes...
            </div>

            <div
              v-else-if="selectedUser && !messages.length"
              class="text-slate-500"
            >
              Aún no hay mensajes para este usuario.
            </div>

            <div
              v-else-if="!selectedUser"
              class="text-slate-500"
            >
              Selecciona un usuario en la lista de la izquierda para ver la conversación.
            </div>

            <div
              v-else
              v-for="m in messages"
              :key="m.id"
              class="mb-3"
            >
              <div class="flex items-baseline gap-2">
                <span
                  class="font-semibold"
                  :class="m.isReply ? 'text-sky-300' : 'text-emerald-300'"
                >
                  {{ m.from }}
                </span>
                <span class="text-[10px] text-slate-500">
                  <!-- Aquí podrías formatear la fecha si quieres -->
                </span>
              </div>
              <div class="ml-2 text-slate-100 whitespace-pre-wrap">
                {{ m.text }}
              </div>
            </div>
          </div>

          <!-- Input de respuesta -->
          <div class="border-t border-slate-800 bg-slate-900/90">
            <div class="px-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Responder como dueño del portafolio</span>
              <span v-if="sendingReply" class="text-sky-400">
                Enviando...
              </span>
            </div>
            <textarea
              v-model="replyText"
              class="w-full h-20 bg-slate-900 text-slate-100 text-[12px] resize-none outline-none p-2"
              :placeholder="selectedUser ? 'Escribe tu respuesta para este usuario...' : 'Selecciona un usuario para responder...'"
              :disabled="!selectedUser || sendingReply"
              @keyup.enter.exact.prevent="sendReply"
            ></textarea>
            <div class="flex justify-end px-3 py-2">
              <button
                class="px-4 py-1 rounded bg-sky-500 text-slate-900 text-[12px] font-semibold hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="!selectedUser || !replyText.trim() || sendingReply"
                @click="sendReply"
              >
                Enviar respuesta
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Barra de estado -->
    <footer class="h-6 bg-slate-950 border-t border-slate-800 px-3 flex items-center justify-between text-[10px] text-slate-500">
      <span>Panel interno · ReplyMessenger</span>
      <span v-if="errorMessage" class="text-red-400">
        {{ errorMessage }}
      </span>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useReplyMessenger } from '../composables/ReplyMessenger/useReplyMessenger';

const {
  users,
  selectedUserId,
  selectedUser,
  messages,
  replyText,
  loadingUsers,
  loadingMessages,
  sendingReply,
  errorMessage,
  init,
  sendReply,
} = useReplyMessenger();

onMounted(() => {
  init();
});
</script>