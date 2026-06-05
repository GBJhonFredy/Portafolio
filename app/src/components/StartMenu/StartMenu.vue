<template>
  <div
    ref="rootEl"
    class="relative inline-flex shrink-0"
  >
    <button
      type="button"
      class="start-button group"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      aria-label="Abrir menú de inicio"
      @click="toggleMenu"
    >
      <span class="start-orb">
        <svg
          viewBox="0 0 24 24"
          class="h-4 w-4 text-sky-700"
        >
          <path d="M4 5.5 11 4v7H4V5.5Z" fill="#0ea5e9" />
          <path d="M13 3.7 20 2.7V11h-7V3.7Z" fill="#22d3ee" />
          <path d="M4 13h7v7l-7-1.1V13Z" fill="#0ea5e9" />
          <path d="M13 13h7v6.3L13 18v-5Z" fill="#38bdf8" />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-120 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
    >
      <div
        v-if="isOpen"
        role="menu"
        class="absolute bottom-[calc(100%+0.45rem)] left-0 z-50 flex min-h-[29rem] w-[22.5rem] overflow-hidden rounded-t-2xl rounded-br-2xl border border-slate-900 bg-slate-200 shadow-[0_18px_35px_rgba(0,0,0,0.55)] md:w-[26rem]"
      >
        <div class="flex w-16 shrink-0 flex-col justify-between bg-gradient-to-b from-sky-900 via-sky-800 to-sky-950 px-2 py-4">
          <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100/95 shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            <svg viewBox="0 0 24 24" class="h-5 w-5 text-sky-700">
              <path d="M4 5.5 11 4v7H4V5.5Z" fill="#0ea5e9" />
              <path d="M13 3.7 20 2.7V11h-7V3.7Z" fill="#22d3ee" />
              <path d="M4 13h7v7l-7-1.1V13Z" fill="#0ea5e9" />
              <path d="M13 13h7v6.3L13 18v-5Z" fill="#38bdf8" />
            </svg>
          </div>

          <div class="text-center text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sky-50/90 [writing-mode:vertical-rl] rotate-180">
            Portafolio
          </div>
        </div>

        <div class="flex flex-1 flex-col bg-slate-100">
          <div class="border-b border-slate-300 bg-gradient-to-b from-white to-slate-100 px-3 py-4">
            <button
              type="button"
              class="menu-item menu-item-primary"
              role="menuitem"
              @click="openMyPc"
            >
            <span class="menu-item-icon menu-item-icon-large flex items-center justify-center">
              <svg viewBox="0 0 32 32" class="w-8 h-8 drop-shadow-sm">
                <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
                <path d="M10 18.5h8v3h-8z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
                <path d="M6 21.5h16v2H6z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
                <rect x="23" y="6" width="6" height="16" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
                <circle cx="26" cy="9" r="1" fill="#10b981"/>
              </svg>
            </span>
              <span>
                <span class="block text-[0.95rem] font-semibold text-slate-900">Mi PC</span>
                <span class="block text-[0.78rem] text-slate-600">Abrir explorador del sistema</span>
              </span>
            </button>

          <button
            type="button"
            class="menu-item menu-item-primary mt-2"
            role="menuitem"
            @click="emitAction('open-powershell')"
          >
            <span class="menu-item-icon menu-item-icon-large flex items-center justify-center">
              <svg viewBox="0 0 32 32" class="w-8 h-8 drop-shadow-sm">
                <rect x="2" y="6" width="28" height="20" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
                <path d="M8 12l5 4-5 4M15 20h8" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </span>
            <span>
              <span class="block text-[0.95rem] font-semibold text-slate-900">PowerShell</span>
              <span class="block text-[0.78rem] text-slate-600">Terminal del sistema</span>
            </span>
          </button>
          </div>

          <div class="flex flex-1 flex-col justify-end px-3 pb-4 pt-4">
            <div class="mb-3 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

            <div class="space-y-2.5">
              <button
                type="button"
                class="menu-item menu-item-shutdown"
                role="menuitem"
                @click="emitAction('shutdown')"
              >
                <span class="menu-item-icon menu-item-icon-shutdown">⏻</span>
                <span class="text-[0.95rem] font-semibold text-slate-900">Apagar</span>
              </button>

              <button
                type="button"
                class="menu-item menu-item-restart"
                role="menuitem"
                @click="emitAction('restart')"
              >
                <span class="menu-item-icon menu-item-icon-restart">↻</span>
                <span class="text-[0.95rem] font-semibold text-slate-900">Reiniciar</span>
              </button>

              <button
                type="button"
                class="menu-item menu-item-lock"
                role="menuitem"
                @click="emitAction('lock')"
              >
                <span class="menu-item-icon menu-item-icon-lock">🔒</span>
                <span class="text-[0.95rem] font-semibold text-slate-900">Bloquear menú clásico</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useStartMenu } from '../../composables/StartMenu/useStartMenu';
import '../../styles/StartMenu/StartMenu.css';

const emit = defineEmits(['open-my-pc', 'lock', 'restart', 'shutdown', 'open-powershell']);

const {
  rootEl,
  isOpen,
  toggleMenu,
  openMyPc,
  emitAction
} = useStartMenu(emit);
</script>