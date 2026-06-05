import { ref, onMounted } from 'vue';
import { supabase } from '../../supabaseClient';

export function useDiskCExplorer() {
  const currentPath = ref('C:');
  const projects = ref([]);
  const isLoading = ref(false);

  const loadProjects = async () => {
    isLoading.value = true;
    try {
      const { data, error } = await supabase
        .from('code_projects')
        .select('*')
        .eq('is_deleted', false)
        .order('id', { ascending: true });
        
      if (!error && data) {
        projects.value = data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const openRepos = () => {
    currentPath.value = 'C:\\Repos Code Studio';
    loadProjects(); // Recargar proyectos al entrar a la carpeta
  };

  const goBack = () => {
    currentPath.value = 'C:';
  };

  onMounted(() => {
    loadProjects();
  });

  return {
    currentPath,
    projects,
    isLoading,
    openRepos,
    goBack
  };
}
