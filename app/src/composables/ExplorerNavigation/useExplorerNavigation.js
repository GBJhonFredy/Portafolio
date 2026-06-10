import { computed, unref } from 'vue';

export function useExplorerNavigation(currentIdRef, emitEvents) {
  // Mapa de jerarquía: id -> padre
  const hierarchy = {
    'mi-pc': null,
    'disco-c': 'mi-pc',
    'disco-c-repos': 'disco-c',
    'mis-documentos': 'mi-pc',
    'imagenes': 'mis-documentos',
    'imagenes-aprendizaje': 'imagenes',
    'musica': 'mis-documentos',
    'proyectos': 'mis-documentos',
    'papelera': 'mi-pc'
  };

  const pathNames = {
    'mi-pc': 'Mi PC',
    'disco-c': 'Disco local (C:)',
    'disco-c-repos': 'C:\\Repos Code Studio',
    'mis-documentos': 'Mis documentos',
    'imagenes': 'Imágenes',
    'imagenes-aprendizaje': 'Imágenes\\Aprendizaje',
    'musica': 'Música',
    'proyectos': 'Proyectos',
    'papelera': 'Papelera de reciclaje'
  };

  const icons = {
    'mi-pc': 'my-pc',
    'disco-c': 'disk',
    'disco-c-repos': 'folder',
    'mis-documentos': 'folder',
    'imagenes': 'folder',
    'imagenes-aprendizaje': 'folder',
    'musica': 'folder',
    'proyectos': 'folder',
    'papelera': 'folder'
  };

  const getId = () => unref(currentIdRef);

  const canGoBack = computed(() => {
    const id = getId();
    return hierarchy[id] !== null && hierarchy[id] !== undefined;
  });

  // El adelante no lo implementaremos con un historial real por ahora, 
  // solo usaremos back hacia el padre según la especificación del usuario.
  const canGoForward = computed(() => false);

  const currentPath = computed(() => pathNames[getId()] || getId());
  const currentIcon = computed(() => icons[getId()] || 'folder');

  const goBack = () => {
    if (canGoBack.value) {
      const parentId = hierarchy[getId()];
      // Emitimos un evento global o mediante prop para que el componente padre
      // o XpDesktop gestione el cierre de la actual y apertura de la nueva.
      emitEvents('navigate', parentId);
    }
  };

  const goUp = () => {
    goBack(); // Funciona igual que back en esta jerarquía simple
  };

  const navigateTo = (targetId) => {
    if (targetId !== getId()) {
      emitEvents('navigate', targetId);
    }
  };

  return {
    canGoBack,
    canGoForward,
    currentPath,
    currentIcon,
    goBack,
    goUp,
    navigateTo
  };
}
