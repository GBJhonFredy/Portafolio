<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 1. PC apagado -->
    <PowerOffScreen
      v-if="stage === 'off'"
      @power-on="handlePowerOn"
    />

    <!-- 2. Boot / cargando XP -->
    <BootLoadingScreen
      v-else-if="stage === 'boot'"
      @boot-finished="handleBootFinished"
    />

    <!-- 3. Pantalla de bloqueo / contraseña -->
    <LockScreen
      v-else-if="stage === 'lock'"
      @unlock="handleUnlock"
    />

    <!-- 4. Escritorio XP -->
    <XpDesktop v-else-if="stage === 'desktop'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PowerOffScreen from '../components/PowerOffScreen/PowerOffScreen.vue';
import BootLoadingScreen from '../components/BootLoadingScreen/BootLoadingScreen.vue';
import LockScreen from '../components/LockScreen/LockScreen.vue';
import XpDesktop from '../components/XpDesktop/XpDesktop.vue';

// Etapas:
// 'off'     = pantalla de apagar
// 'boot'    = cargando
// 'lock'    = pantalla de contraseña
// 'desktop' = escritorio XP
const stage = ref('off');

const handlePowerOn = () => {
  // Cuando el usuario “enciende”, pasamos a boot
  stage.value = 'boot';
  // Guardamos que ya encendió alguna vez
  localStorage.setItem('xp-power-state', 'on');
};

const handleBootFinished = () => {
  // Cuando termina la animación de boot, mostramos lockscreen
  stage.value = 'lock';
};

const handleUnlock = () => {
  // Cuando mete la contraseña correcta
  stage.value = 'desktop';
};

onMounted(() => {
  // Al cargar la página, revisamos si ya había encendido antes
  const saved = localStorage.getItem('xp-power-state');

  if (saved === 'on') {
    // Si ya encendió alguna vez, podemos empezar directamente en lock (o desktop si quieres)
    stage.value = 'lock';
  } else {
    // Si nunca ha encendido (o borró el storage), mostramos pantalla de apagado
    stage.value = 'off';
  }
});
</script>