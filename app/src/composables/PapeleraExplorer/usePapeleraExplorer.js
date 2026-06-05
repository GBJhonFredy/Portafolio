import { ref, onMounted } from 'vue';
import { supabase } from '../../supabaseClient';

export function usePapeleraExplorer() {
  const deletedItems = ref([]);
  const isLoading = ref(false);

  const loadItems = async () => {
    isLoading.value = true;
    try {
      const { data: projs } = await supabase.from('code_projects').select('*').eq('is_deleted', true);
      const { data: files } = await supabase.from('code_files').select('*').eq('is_deleted', true);

      deletedItems.value = [
        ...(projs || []).map(p => ({ ...p, _type: 'project' })),
        ...(files || []).map(f => ({ ...f, _type: 'file' }))
      ];
    } finally {
      isLoading.value = false;
    }
  };

  const restoreItem = async (item) => {
    const table = item._type === 'project' ? 'code_projects' : 'code_files';
    await supabase.from(table).update({ is_deleted: false }).eq('id', item.id);
    deletedItems.value = deletedItems.value.filter(i => i.id !== item.id);
  };

  const hardDeleteItem = async (item) => {
    const table = item._type === 'project' ? 'code_projects' : 'code_files';
    await supabase.from(table).delete().eq('id', item.id);
    deletedItems.value = deletedItems.value.filter(i => i.id !== item.id);
  };

  const emptyTrash = async () => {
    if (!confirm('¿Seguro de vaciar la papelera de reciclaje por completo?')) return;
    for (const item of deletedItems.value) {
      const table = item._type === 'project' ? 'code_projects' : 'code_files';
      await supabase.from(table).delete().eq('id', item.id);
    }
    deletedItems.value = [];
  };

  onMounted(() => loadItems());

  return { deletedItems, isLoading, restoreItem, hardDeleteItem, emptyTrash, loadItems };
}