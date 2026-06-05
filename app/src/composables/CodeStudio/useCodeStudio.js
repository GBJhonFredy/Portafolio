import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../supabaseClient';

export function useCodeStudio(emit) {
  const projects = ref([]);
  const activeProjectId = ref(null);
  const activeProject = computed(
    () => projects.value.find((p) => p.id === activeProjectId.value) || null
  );

  const files = ref([]);
  const activeFileId = ref(null);

  const isLoading = ref(false);
  const loadError = ref(null);

  const showNewFilePanel = ref(false);
  const newFileName = ref('');
  const newFileType = ref('html');
  const errorMessage = ref('');

  const showAlert = ref(false);
  const alertMessage = ref('');

  const activeFile = computed(
    () => files.value.find((f) => f.id === activeFileId.value) || null
  );

  const isSaving = ref(false);
  const saveSuccess = ref(false);
  let saveTimeout = null;

  const collapsedProjects = ref([]);
  const toggleProjectCollapse = (id) => {
    if (collapsedProjects.value.includes(id)) {
      collapsedProjects.value = collapsedProjects.value.filter((pid) => pid !== id);
    } else {
      collapsedProjects.value.push(id);
    }
  };
  const isProjectCollapsed = (id) => collapsedProjects.value.includes(id);

  const saveContent = async (fileId, content) => {
    isSaving.value = true;
    saveSuccess.value = false;
    try {
      const { error } = await supabase
        .from('code_files')
        .update({ content })
        .eq('id', fileId);

      if (error) {
        console.error('Error al guardar el archivo:', error);
      } else {
        saveSuccess.value = true;
      }
    } catch (err) {
      console.error('Excepción al guardar archivo:', err);
    } finally {
      isSaving.value = false;
      setTimeout(() => {
        saveSuccess.value = false;
      }, 2000);
    }
  };

  const scheduleSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      if (activeFile.value) {
        saveContent(activeFile.value.id, activeFile.value.content);
      }
    }, 1000);
  };

  const activeFileContent = computed({
    get() {
      return activeFile.value ? activeFile.value.content : '';
    },
    set(value) {
      if (activeFile.value) {
        const lines = value.split('\n');
        if (lines.length > 35) {
          activeFile.value.content = lines.slice(0, 35).join('\n');
          openAlert('Solo se permiten 35 líneas por archivo.');
        } else {
          activeFile.value.content = value;
        }
        scheduleSave();
      }
    },
  });

  const lineCount = computed(() => {
    if (!activeFile.value || !activeFile.value.content) return 1;
    const lines = activeFile.value.content.split('\n');
    return Math.min(lines.length, 35);
  });

  const openAlert = (message) => {
    alertMessage.value = message;
    showAlert.value = true;
  };

  const resetNewFileForm = () => {
    newFileName.value = '';
    newFileType.value = 'html';
    errorMessage.value = '';
  };

  const cancelCreateFile = () => {
    showNewFilePanel.value = false;
    resetNewFileForm();
  };

  const openNewFilePanel = () => {
    if (!activeProject.value) {
      openAlert('Primero crea o selecciona una carpeta.');
      return;
    }
    showNewFilePanel.value = true;
  };

  const projectFiles = (projectId) => {
    return files.value.filter((file) => file.projectId === projectId);
  };

  const setActiveProject = (id) => {
    activeProjectId.value = id;
    const firstFile = files.value.find((f) => f.projectId === id) || null;
    activeFileId.value = firstFile ? firstFile.id : null;
  };

  const setActiveFile = (id) => {
    if (saveTimeout && activeFile.value) {
      clearTimeout(saveTimeout);
      saveContent(activeFile.value.id, activeFile.value.content);
    }
    activeFileId.value = id;
  };

  const loadProjectsAndFiles = async () => {
    try {
      isLoading.value = true;
      loadError.value = null;

      const { data: projectsData, error: projectsError } = await supabase
        .from('code_projects')
        .select('*')
        .eq('is_deleted', false)
        .order('id', { ascending: true });

      if (projectsError) {
        console.error('Error al cargar proyectos:', projectsError);
        loadError.value = 'Error al cargar proyectos';
        return;
      }

      projects.value = projectsData || [];

      const { data: filesData, error: filesError } = await supabase
        .from('code_files')
        .select('*')
        .eq('is_deleted', false)
        .order('id', { ascending: true });

      if (filesError) {
        console.error('Error al cargar archivos:', filesError);
        loadError.value = 'Error al cargar archivos';
        return;
      }

      files.value = (filesData || []).map((file) => ({
        id: file.id,
        projectId: file.project_id,
        name: file.name,
        type: file.type,
        content: file.content || '',
      }));

      if (projects.value.length > 0) {
        activeProjectId.value = projects.value[0].id;
        const firstFile = files.value.find(
          (f) => f.projectId === activeProjectId.value
        );
        activeFileId.value = firstFile ? firstFile.id : null;
      } else {
        activeProjectId.value = null;
        activeFileId.value = null;
      }
    } catch (err) {
      console.error('Excepción al cargar proyectos/archivos:', err);
      loadError.value = 'Error inesperado al cargar datos';
    } finally {
      isLoading.value = false;
    }
  };

  const createProject = async () => {
    try {
      const number = projects.value.length + 1;
      const name = `Carpeta ${number}`;

      const { data, error } = await supabase
        .from('code_projects')
        .insert([{ name }])
        .select('*')
        .single();

      if (error) {
        console.error('Error al crear proyecto:', error);
        openAlert('No se pudo crear la carpeta en Supabase.');
        return;
      }

      projects.value.push({
        id: data.id,
        name: data.name,
      });

      activeProjectId.value = data.id;
      activeFileId.value = null;
      showNewFilePanel.value = false;
      resetNewFileForm();
    } catch (err) {
      console.error('Excepción al crear proyecto:', err);
      openAlert('Ocurció un error inesperado creando la carpeta.');
    }
  };

  const createFile = async () => {
    errorMessage.value = '';

    const name = newFileName.value.trim();
    const type = newFileType.value;

    if (!activeProject.value) {
      errorMessage.value = 'Primero crea una carpeta.';
      return;
    }

    if (!name) {
      errorMessage.value = 'El archivo necesita un nombre.';
      return;
    }

    if (type === 'html' && !name.endsWith('.html')) {
      errorMessage.value = 'Para HTML, usa una extensión .html';
      return;
    }
    if (type === 'css' && !name.endsWith('.css')) {
      errorMessage.value = 'Para CSS, usa una extensión .css';
      return;
    }
    if (type === 'js' && !name.endsWith('.js')) {
      errorMessage.value = 'Para JS, usa una extensión .js';
      return;
    }

    const sameTypeExists = files.value.some(
      (f) => f.projectId === activeProjectId.value && f.type === type
    );

    if (sameTypeExists) {
      openAlert(`Ya existe un archivo ${type.toUpperCase()} en esta carpeta.`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('code_files')
        .insert([
          {
            project_id: activeProjectId.value,
            name,
            type,
            content: '',
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error al crear archivo:', error);
        openAlert('No se pudo crear el archivo en Supabase.');
        return;
      }

      const newFile = {
        id: data.id,
        projectId: data.project_id,
        name: data.name,
        type: data.type,
        content: data.content || '',
      };

      files.value.push(newFile);
      activeFileId.value = newFile.id;
      showNewFilePanel.value = false;
      resetNewFileForm();
    } catch (err) {
      console.error('Excepción al crear archivo:', err);
      openAlert('Ocurrió un error inesperado creando el archivo.');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('¿Mover esta carpeta a la papelera?')) return;
    try {
      const { error } = await supabase.from('code_projects').update({ is_deleted: true }).eq('id', id);
      await supabase.from('code_files').update({ is_deleted: true }).eq('project_id', id);
      if (error) throw error;
      projects.value = projects.value.filter((p) => p.id !== id);
      if (activeProjectId.value === id) {
        activeProjectId.value = projects.value.length ? projects.value[0].id : null;
        const remainingFiles = projectFiles(activeProjectId.value);
        activeFileId.value = remainingFiles.length ? remainingFiles[0].id : null;
      }
    } catch (err) {
      console.error(err);
      openAlert('Error al eliminar la carpeta.');
    }
  };

  const renameProject = async (id, currentName) => {
    const newName = prompt('Nuevo nombre de la carpeta:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    try {
      const { error } = await supabase.from('code_projects').update({ name: newName.trim() }).eq('id', id);
      if (error) throw error;
      const proj = projects.value.find((p) => p.id === id);
      if (proj) proj.name = newName.trim();
    } catch (err) {
      console.error(err);
      openAlert('Error al renombrar la carpeta.');
    }
  };

  const deleteFile = async (id) => {
    if (!confirm('¿Mover este archivo a la papelera?')) return;
    try {
      const { error } = await supabase.from('code_files').update({ is_deleted: true }).eq('id', id);
      if (error) throw error;
      files.value = files.value.filter((f) => f.id !== id);
      if (activeFileId.value === id) {
        const remaining = projectFiles(activeProjectId.value);
        activeFileId.value = remaining.length ? remaining[0].id : null;
      }
    } catch (err) {
      console.error(err);
      openAlert('Error al eliminar el archivo.');
    }
  };

  const renameFile = async (id, currentName) => {
    const newName = prompt('Nuevo nombre del archivo:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    try {
      const { error } = await supabase.from('code_files').update({ name: newName.trim() }).eq('id', id);
      if (error) throw error;
      const file = files.value.find((f) => f.id === id);
      if (file) file.name = newName.trim();
    } catch (err) {
      console.error(err);
      openAlert('Error al renombrar el archivo.');
    }
  };

  const buildHtmlDocument = () => {
    const projectFilesList = files.value.filter(
      (f) => f.projectId === activeProjectId.value
    );

    const htmlFile = projectFilesList.find((f) => f.type === 'html');
    const cssFile = projectFilesList.find((f) => f.type === 'css');
    const jsFile = projectFilesList.find((f) => f.type === 'js');

    const htmlContent = htmlFile ? htmlFile.content : '';
    const cssContent = cssFile ? cssFile.content : '';
    const jsContent = jsFile ? jsFile.content : '';

    const jsWrapper = jsContent
      ? 'window.addEventListener("load", function(){\n' + jsContent + '\n});'
      : '';

    const finalHtml =
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<title>Preview</title>' +
      (cssContent ? '<style>' + cssContent + '</style>' : '') +
      '</head>' +
      '<body>' +
      (htmlContent || '<h1>Sin HTML todavía</h1>') +
      '<script>' +
      jsWrapper +
      '<' +
      '/script>' +
      '</body>' +
      '</html>';

    return finalHtml;
  };

  const runPreview = () => {
    if (saveTimeout && activeFile.value) {
      clearTimeout(saveTimeout);
      saveContent(activeFile.value.id, activeFile.value.content);
    }
    const html = buildHtmlDocument();
    emit('run', html);
  };

  onMounted(async () => {
    await loadProjectsAndFiles();
  });

  return {
    projects,
    activeProjectId,
    activeProject,
    files,
    activeFileId,
    isLoading,
    loadError,
    showNewFilePanel,
    newFileName,
    newFileType,
    errorMessage,
    showAlert,
    alertMessage,
    activeFile,
    activeFileContent,
    isSaving,
    saveSuccess,
    lineCount,
    cancelCreateFile,
    openNewFilePanel,
    projectFiles,
    setActiveProject,
    setActiveFile,
    createProject,
    createFile,
    renameProject,
    deleteProject,
    renameFile,
    deleteFile,
    runPreview,
    toggleProjectCollapse,
    isProjectCollapsed
  };
}
