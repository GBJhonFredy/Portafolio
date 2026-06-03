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
              <span class="menu-item-icon menu-item-icon-large">💻</span>
              <span>
                <span class="block text-[0.95rem] font-semibold text-slate-900">Mi PC</span>
                <span class="block text-[0.78rem] text-slate-600">Abrir explorador del sistema</span>
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
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['open-my-pc', 'lock', 'restart', 'shutdown']);

const rootEl = ref(null);
const isOpen = ref(false);

const closeMenu = () => {
  isOpen.value = false;
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const openMyPc = () => {
  emit('open-my-pc');
  closeMenu();
};

const emitAction = (action) => {
  emit(action);
  closeMenu();
};

const handleDocumentPointerDown = (event) => {
  const root = rootEl.value;
  if (!root || root.contains(event.target)) {
    return;
  }

  closeMenu();
};

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
});
</script>

<style scoped>
.start-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 9999px;
  border: 1px solid #166534;
  background: linear-gradient(180deg, #5ee28d 0%, #2dd46a 46%, #13733a 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 2px 6px rgba(0, 0, 0, 0.75);
  color: #fff;
}

.start-button:hover {
  background: linear-gradient(180deg, #76f0a0 0%, #3be678 46%, #198c44 100%);
}

.start-button:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.7);
}

.start-orb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.3rem;
  background: #ffffff;
  border: none;
  overflow: hidden;
  box-shadow: none;
} 

.menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.9rem;
  border-radius: 0.65rem;
  padding: 0.7rem 0.8rem;
  text-align: left;
  transition: background-color 120ms ease, transform 120ms ease;
}

.menu-item:hover {
  background: rgba(191, 219, 254, 0.72);
}

.menu-item-lock:hover {
  background: rgba(253, 224, 71, 0.45);
}

.menu-item-restart:hover {
  background: rgba(134, 239, 172, 0.45);
}

.menu-item-shutdown:hover {
  background: rgba(252, 165, 165, 0.5);
}

.menu-item:active {
  transform: translateY(1px);
}

.menu-item-primary {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.55);
}

.menu-item-icon {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.08);
  font-size: 1.15rem;
}

.menu-item-icon-large {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.35rem;
}

.menu-item-icon-lock {
  background: rgba(250, 204, 21, 0.18);
}

.menu-item-icon-restart {
  background: rgba(74, 222, 128, 0.18);
}

.menu-item-icon-shutdown {
  background: rgba(248, 113, 113, 0.18);
}
</style>