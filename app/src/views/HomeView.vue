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
  // ¿Es la primera vez que entra al portafolio?
  const hasOpenedInfo = localStorage.getItem('xp-has-opened-info');

  if (!hasOpenedInfo) {
    // Marcamos que la info debe abrirse una vez en el escritorio
    localStorage.setItem('xp-should-open-info-once', 'true');
  }

  // Cuando mete la contraseña correcta
  stage.value = 'desktop';
  // Guardamos que ya NO está bloqueado
  localStorage.setItem('xp-is-locked', 'false');
};

onMounted(() => {
  const savedPower = localStorage.getItem('xp-power-state'); // 'on' o null
  const savedLocked = localStorage.getItem('xp-is-locked');  // 'true' o 'false'

  if (savedPower === 'on') {
    if (savedLocked === 'false') {
      // Ya estaba encendido y desbloqueado → vamos directo al escritorio
      stage.value = 'desktop';
    } else {
      // Encendido pero bloqueado (o sin dato) → lockscreen
      stage.value = 'lock';
    }
  } else {
    // Nunca ha encendido → pantalla apagado
    stage.value = 'off';
  }
});
</script>