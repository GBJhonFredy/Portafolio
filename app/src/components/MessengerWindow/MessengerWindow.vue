<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
  >
    <div
      class="messenger-window flex flex-col bg-[#ece9d8] border border-[#00138c] shadow-lg overflow-hidden select-none font-sans rounded-t-md pointer-events-auto"
      :style="windowStyle"
    > 
      <!-- Title Bar -->
      <div
        class="h-7 bg-[#192438] flex items-center justify-between px-2 cursor-pointer border-b border-slate-900"
        @mousedown="onMouseDown"
        @dblclick="toggleMaximize"
      >
      <div class="flex items-center gap-1.5 overflow-hidden">
        <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0 drop-shadow-sm">
          <circle cx="12" cy="12" r="5" fill="#10b981" stroke="#047857" stroke-width="1"/>
          <path d="M4 26c0-6 4-10 8-10s8 4 8 10" fill="#10b981" stroke="#047857" stroke-width="1"/>
          <circle cx="20" cy="14" r="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1"/>
          <path d="M14 26c0-5 3-8 6-8s6 3 6 8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1"/>
        </svg>
        <span class="text-white text-xs font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] truncate">
          Windows Live Messenger
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

    <!-- Menu Bar -->
    <div class="bg-[#f0f0ea] border-b border-gray-300 px-1 py-0.5 flex gap-2 text-[11px] text-gray-700">
      <div class="hover:bg-blue-100 hover:text-black px-1.5 py-0.5 cursor-pointer rounded">Archivo</div>
      <div class="hover:bg-blue-100 hover:text-black px-1.5 py-0.5 cursor-pointer rounded">Contactos</div>
      <div class="hover:bg-blue-100 hover:text-black px-1.5 py-0.5 cursor-pointer rounded">Acciones</div>
      <div class="hover:bg-blue-100 hover:text-black px-1.5 py-0.5 cursor-pointer rounded">Herramientas</div>
      <div class="hover:bg-blue-100 hover:text-black px-1.5 py-0.5 cursor-pointer rounded">Ayuda</div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col bg-white overflow-hidden p-2 gap-2 relative">
      <!-- Decoración superior (estilo Messenger) -->
      <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#e6f0ff] to-transparent pointer-events-none"></div>

      <template v-if="!isSetup">
        <div class="flex-1 flex flex-col items-center justify-center relative z-10 px-4 text-center">
          <div class="w-16 h-16 bg-gray-200 border-2 border-gray-300 rounded shadow-sm overflow-hidden flex items-center justify-center mb-4">
            <svg viewBox="0 0 32 32" class="w-12 h-12 text-gray-400">
              <circle cx="16" cy="12" r="6" fill="currentColor"/>
              <path d="M8 26c0-6 4-10 8-10s8 4 8 10" fill="currentColor"/>
            </svg>
          </div>
          <h2 class="text-sm font-bold text-[#00138c] mb-2">Iniciar sesión</h2>
          <p class="text-xs text-gray-600 mb-4">Por favor ingresa tus datos para chatear conmigo.</p>
          
          <input 
            v-model="visitorName" 
            type="text" 
            placeholder="Tu nombre (ej. Juan)" 
            class="w-full text-xs px-2 py-1.5 border border-[#7f9db9] rounded mb-2 outline-none focus:border-blue-500"
            @keyup.enter="startChat"
          />
          <input 
            v-model="visitorEmail" 
            type="email" 
            placeholder="Tu email (opcional)" 
            class="w-full text-xs px-2 py-1.5 border border-[#7f9db9] rounded mb-4 outline-none focus:border-blue-500"
            @keyup.enter="startChat"
          />
          
          <button 
            @click="startChat"
            class="px-4 py-1 border border-gray-400 rounded bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200 active:from-gray-300 active:to-gray-100 text-xs font-bold text-gray-800"
          >
            Conectar
          </button>
        </div>
      </template>
      <template v-else>
        <!-- User Profile Header -->
        <div class="flex gap-3 items-center relative z-10 border-b border-gray-200 pb-2">
          <div class="w-14 h-14 bg-gray-200 border-2 border-gray-300 rounded shadow-sm overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 32 32" class="w-10 h-10 text-gray-400">
              <circle cx="16" cy="12" r="6" fill="currentColor"/>
              <path d="M8 26c0-6 4-10 8-10s8 4 8 10" fill="currentColor"/>
            </svg>
          </div>
          <div class="flex-1 flex flex-col">
            <div class="font-bold text-[13px] text-gray-800 flex items-center gap-1">
              {{ visitorName }}
              <span class="text-[10px] text-green-600 font-normal border border-green-600 px-1 rounded-sm">Disponible</span>
            </div>
            <div class="text-[11px] text-gray-500 italic mt-0.5">&lt;Escribe tu mensaje personal aquí&gt;</div>
          </div>
        </div>

        <!-- Tab Content / Chat Area -->
        <div class="flex-1 flex flex-col border border-[#7f9db9] rounded bg-[#f5f5f5] overflow-hidden relative z-10">
          <!-- Message History -->
          <div class="flex-1 bg-white p-2 overflow-y-auto text-[12px]">
            <div v-for="(msg, idx) in messages" :key="idx" class="mb-2">
              <span class="font-bold" :class="msg.isReply ? 'text-blue-700' : 'text-gray-500'">
                {{ msg.from }} dice:
              </span>
              <div class="ml-2 text-black whitespace-pre-wrap">{{ msg.text }}</div>
            </div>
          </div>
          
          <!-- Toolbar separator -->
          <div class="h-6 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] border-t border-b border-[#7f9db9] flex items-center px-1">
            <button class="w-6 h-4 hover:bg-blue-100 flex items-center justify-center rounded">
              <span class="font-bold text-[11px]">A</span>
            </button>
            <button class="w-6 h-4 hover:bg-blue-100 flex items-center justify-center rounded text-orange-500">
              :)
            </button>
          </div>

          <!-- Input Area -->
          <div class="h-16 bg-white flex flex-col">
            <textarea 
              v-model="currentInput"
              @keyup.enter.prevent="sendMessage"
              class="flex-1 resize-none outline-none p-1.5 text-[12px] text-black w-full"
              placeholder="Escribe un mensaje aquí..."
            ></textarea>
            <div class="flex justify-end p-1 bg-[#f0f0ea] border-t border-gray-200">
              <button 
                @click="sendMessage"
                class="px-3 py-0.5 border border-gray-400 rounded bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-50 hover:to-gray-200 active:from-gray-300 active:to-gray-100 text-[11px]"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </template>

    </div>
    
    <!-- Status Bar -->
    <div class="h-5 bg-[#f0f0ea] border-t border-gray-300 flex items-center px-2 text-[10px] text-gray-600">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSIgZmlsbD0iIzEwYjk4MSIvPjxwYXRoIGQ9Ik00IDI2YzAtNiA0LTEwIDgtMTBzOCA0IDggMTAiIGZpbGw9IiMxMGI5ODEiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE0IiByPSI0IiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTE0IDI2YzAtNSAzLTggNi04czYgMyA2IDgiIGZpbGw9IiMzYjgyZjYiLz48L3N2Zz4=" class="w-3 h-3 mr-1 grayscale opacity-50">
      Conectado
    </div>
  </div>
  </div>
</template>

<script setup>
import { useMessengerWindow } from '../../composables/MessengerWindow/useMessengerWindow';
import '../../styles/MessengerWindow/MessengerWindow.css';

const {
  isMaximized,
  windowStyle,
  onMouseDown,
  toggleMaximize,
  status,
  messages,
  currentInput,
  isSetup,
  visitorName,
  visitorEmail,
  startChat,
  sendMessage
} = useMessengerWindow();

defineEmits(['close', 'minimize']);
</script>
