import { ref } from 'vue';

export function useMyPictureExplorer() {
  const currentPath = ref('Imágenes');

  const openFolder = (folder) => {
    currentPath.value = `Imágenes\\${folder}`;
  };

  const goBack = () => {
    if (currentPath.value !== 'Imágenes') {
      currentPath.value = 'Imágenes';
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

const mainImages = [
  {
    name: 'HTML5',
    url: 'https://developer.mozilla.org/es/docs/Web/HTML',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" class="w-full h-full" alt="HTML5 Logo" />'
  },
  {
    name: 'CSS3',
    url: 'https://developer.mozilla.org/es/docs/Web/CSS',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" class="w-full h-full" alt="CSS3 Logo" />'
  },
  {
    name: 'JavaScript',
    url: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" class="w-full h-full" alt="JavaScript Logo" />'
  },
  {
    name: 'Vue.js',
    url: 'https://vuejs.org/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="w-full h-full" alt="Vue.js Logo" />'
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    svg: '<svg viewBox="0 0 54 33" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" fill="#06B6D4"></path></svg>'
  },
  {
    name: 'Node.js',
    url: 'https://nodejs.org/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" class="w-full h-full" alt="Node.js Logo" />'
  },
  {
    name: 'Bootstrap',
    url: 'https://getbootstrap.com/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" class="w-full h-full" alt="Bootstrap Logo" />'
  },
  {
    name: 'SharePoint 2013',
    url: 'https://learn.microsoft.com/en-us/sharepoint/sharepoint-server',
    svg: '<svg viewBox="-0.12979372698077785 0 32.12979372698078 32" xmlns="http://www.w3.org/2000/svg" width="2500" height="2480"><circle cx="15" cy="9.5" fill="#036c70" r="9.5"/><circle cx="23.875" cy="17.875" fill="#1a9ba1" r="8.125"/><circle cx="16" cy="25.5" fill="#37c6d0" r="6.5"/><path d="M16.667 7H5.833A9.506 9.506 0 0 0 15 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 0 0 9.5 25.5q0 .252.019.5h7.148A1.337 1.337 0 0 0 18 24.667V8.333A1.337 1.337 0 0 0 16.667 7z" opacity=".1"/><path d="M15.667 8H5.617A9.505 9.505 0 0 0 15 19c.277 0 .551-.013.823-.036l.005.038A6.505 6.505 0 0 0 9.674 27h5.993A1.337 1.337 0 0 0 17 25.667V9.333A1.337 1.337 0 0 0 15.667 8z" opacity=".2"/><path d="M15.667 8H5.617A9.505 9.505 0 0 0 15 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 0 0 9.518 25h6.149A1.337 1.337 0 0 0 17 23.667V9.333A1.337 1.337 0 0 0 15.667 8z" opacity=".2"/><path d="M14.667 8h-9.05A9.505 9.505 0 0 0 15 19c.277 0 .551-.013.823-.036l.005.038A6.5 6.5 0 0 0 9.518 25h5.149A1.337 1.337 0 0 0 16 23.667V9.333A1.337 1.337 0 0 0 14.667 8z" opacity=".2"/><path d="M1.333 8h13.334A1.333 1.333 0 0 1 16 9.333v13.334A1.333 1.333 0 0 1 14.667 24H1.333A1.333 1.333 0 0 1 0 22.667V9.333A1.333 1.333 0 0 1 1.333 8z" fill="#03787c"/><path d="M5.67 15.825a2.645 2.645 0 0 1-.822-.87 2.361 2.361 0 0 1-.287-1.19 2.29 2.29 0 0 1 .533-1.541A3.142 3.142 0 0 1 6.51 11.3a5.982 5.982 0 0 1 1.935-.3 7.354 7.354 0 0 1 2.549.357v1.8a3.986 3.986 0 0 0-1.153-.471 5.596 5.596 0 0 0-1.349-.162 2.926 2.926 0 0 0-1.386.293.91.91 0 0 0-.549.833.844.844 0 0 0 .233.59 2.122 2.122 0 0 0 .627.448q.394.196 1.176.52a1.232 1.232 0 0 1 .169.067 9.697 9.697 0 0 1 1.483.732 2.654 2.654 0 0 1 .877.883 2.558 2.558 0 0 1 .317 1.332 2.48 2.48 0 0 1-.499 1.605 2.789 2.789 0 0 1-1.335.896A6.049 6.049 0 0 1 7.703 21a10.028 10.028 0 0 1-1.722-.142 5.912 5.912 0 0 1-1.4-.404v-1.902a4.5 4.5 0 0 0 1.416.675 5.513 5.513 0 0 0 1.558.25 2.68 2.68 0 0 0 1.413-.3.947.947 0 0 0 .475-.847.904.904 0 0 0-.266-.648 2.704 2.704 0 0 0-.735-.512q-.469-.236-1.386-.62a7.86 7.86 0 0 1-1.386-.725z" fill="#fff"/><path d="M0 0h32v32H0z" fill="none"/></svg>'
  }
];

const learningImages = [
  {
    name: 'Python',
    url: 'https://www.python.org/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" class="w-full h-full" alt="Python Logo" />'
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" class="w-full h-full" alt="Supabase Logo" />'
  },
  {
    name: 'Angular',
    url: 'https://angular.io/',
    svg: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" class="w-full h-full" alt="Angular Logo" />'
  }
];

  return {
    currentPath,
    openFolder,
    goBack,
    openLink,
    mainImages,
    learningImages
  };
}