export function usePowerOffScreen(emit) {
  const handlePowerOn = () => {
    emit('power-on');
  };

  return {
    handlePowerOn
  };
}
