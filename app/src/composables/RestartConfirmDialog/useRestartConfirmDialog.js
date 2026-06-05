export function useRestartConfirmDialog(emit) {
  const handleConfirm = () => {
    emit('confirm');
  };

  const handleCancel = () => {
    emit('cancel');
  };

  return {
    handleConfirm,
    handleCancel
  };
}
