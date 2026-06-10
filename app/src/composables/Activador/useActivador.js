import { ref, onMounted } from 'vue';

export function useActivador(emit) {
  const outputLines = ref(['Portafolio Activation Utility v1.0']);
  const showCursor = ref(true);
  const progress = ref(0);

  const finishActivation = async () => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    await wait(500);
    outputLines.value.push('<span class="text-green-400">¡Portafolio activado exitosamente!</span>');
    
    await wait(800);
    outputLines.value.push('La marca de agua será eliminada.');
    
    await wait(2500);
    showCursor.value = false;
    emit('activated');
  };

  const runActivation = async () => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await wait(500);
    outputLines.value.push('C:\\> activate.exe');
    
    await wait(1000);
    outputLines.value.push('Iniciando secuencia de activación...');

    await wait(1500);
    outputLines.value.push('Contactando servidor de licencias (localhost:3000)... OK');

    await wait(800);
    outputLines.value.push('Verificando clave de producto... G1L-JHON-FR3DY-VUE-DEV');
    
    await wait(1200);
    outputLines.value.push('Clave válida. Procediendo con la activación.');

    await wait(500);
    const progressLineIndex = outputLines.value.length;
    outputLines.value.push('[                    ] 0%');

    const progressInterval = setInterval(() => {
      progress.value += Math.floor(Math.random() * 10) + 5;
      if (progress.value > 100) progress.value = 100;

      const barLength = 20;
      const filledLength = Math.round(barLength * (progress.value / 100));
      const emptyLength = barLength - filledLength;
      const bar = '█'.repeat(filledLength) + ' '.repeat(emptyLength);
      
      outputLines.value[progressLineIndex] = `[${bar}] ${progress.value}%`;

      if (progress.value >= 100) {
        clearInterval(progressInterval);
        finishActivation();
      }
    }, 200);
  };

  onMounted(() => {
    runActivation();
  });

  return {
    outputLines,
    showCursor,
  };
}