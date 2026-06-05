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
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-full h-full" fill="#E34F26"><path d="M0 32l34.9 392.5L192 480l157.1-55.5L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/></svg>'
    },
    {
      name: 'CSS3',
      url: 'https://developer.mozilla.org/es/docs/Web/CSS',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-full h-full" fill="#1572B6"><path d="M0 32l34.9 392.5L192 480l157.1-55.5L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/></svg>'
    },
    {
      name: 'JavaScript',
      url: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-full h-full" fill="#F7DF1E"><path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 36.8 0 57.3 18.1 66.1 41.2l-34.2 19.2c-6.3-17.6-14.5-22.6-31.1-22.6-15 0-25 7.8-25 19.2 0 11.4 8.7 16.6 27.1 24.4l10.5 4.5c34.9 14.7 54.3 31.6 54.3 64.6 0 35.1-24.8 59-65.3 59z"/></svg>'
    },
    {
      name: 'Vue.js',
      url: 'https://vuejs.org/',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-full h-full"><path fill="#41B883" d="M224 373.1L24.5 24h97.4L224 205.1 326.1 24h97.4L224 373.1z"/><path fill="#34495E" d="M224 373.1L121.9 192H24.5L224 512l199.5-320h-97.4L224 373.1z"/></svg>'
    },
    {
      name: 'Tailwind CSS',
      url: 'https://tailwindcss.com/',
      svg: '<svg viewBox="0 0 54 33" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" fill="#06B6D4"/></svg>'
    },
    {
      name: 'Node.js',
      url: 'https://nodejs.org/',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-full h-full" fill="#339933"><path d="M356.5 259.9c0 51.5-42.3 93.3-94.4 93.3-25.1 0-48.4-10-65.7-27l30.4-31.5c10.4 10.9 22.8 16.3 35.8 16.3 27 0 46.8-19.1 46.8-48.8V119h47.2v140.9zm-136.2-75.1c0-10.4-2.2-20.2-6.5-29.2l-37.4 19.2c1.7 4.1 2.2 8.5 2.2 13v93.3h-47.2V119h47.2v65.7zM0 256C0 114.6 114.6 0 256 0s256 114.6 256 256-114.6 256-256 256S0 397.4 0 256zm256-213c-117.5 0-213 95.5-213 213s95.5 213 213 213 213-95.5 213-213-95.5-213-213-213z"/></svg>'
    },
    {
      name: 'Bootstrap',
      url: 'https://getbootstrap.com/',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-full h-full" fill="#7952B3"><path fill-rule="evenodd" d="M2.5 14.5A1.5 1.5 0 0 1 1 13V3a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 12 3v10a1.5 1.5 0 0 1-1.5 1.5h-8zM5 5v6h1.714V8.5h1.26c1.642 0 2.65-.968 2.65-2.26C10.624 5.093 9.772 4 8 4H5v1h3c1.037 0 1.554.551 1.554 1.25S9.03 7.5 8 7.5H6.714V5H5zm2.714 4.5v1.5H9c1.08 0 1.696-.638 1.696-1.516 0-.89-.607-1.484-1.696-1.484H7.714v1.5z"/></svg>'
    },
    {
      name: 'SharePoint 2013',
      url: 'https://learn.microsoft.com/en-us/sharepoint/sharepoint-server',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-full h-full"><path fill="#036C70" d="M128 0a128 128 0 1 0 128 128A128.1 128.1 0 0 0 128 0Zm0 236a108 108 0 1 1 108-108 108.1 108.1 0 0 1-108 108Zm-3.5-163.5a18.5 18.5 0 1 1-18.5 18.5A18.5 18.5 0 0 1 124.5 72.5Zm-23.7 94.3a6.5 6.5 0 0 1-6.5-6.5V110a6.5 6.5 0 1 1 13 0v50.3A6.5 6.5 0 0 1 100.8 166.8Zm71.5 10a27.6 27.6 0 0 1-27.5-27.5v-39a6.5 6.5 0 1 1 13 0v39a14.5 14.5 0 0 0 29 0v-39a6.5 6.5 0 1 1 13 0v39a27.6 27.6 0 0 1-27.5 27.5Z"/></svg>'
    }
  ];

  const learningImages = [
    {
      name: 'Python',
      url: 'https://www.python.org/',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-full h-full" fill="#3776AB"><path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4 .1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8 .1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3 0-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"/></svg>'
    },
    {
      name: 'Supabase',
      url: 'https://supabase.com/',
      svg: '<svg viewBox="0 0 24 24" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 21.65l9.266-5.35-9.266-13.8L2.734 16.3 12 21.65z" fill="#3ECF8E"/></svg>'
    },
    {
      name: 'Angular',
      url: 'https://angular.io/',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" class="w-full h-full"><path fill="#DD0031" d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path fill="#C3002F" d="M125 30v200l78.9-43.7 14.2-123.1z"/><path fill="#FFF" d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 113.4h-34l17-40.9 17 40.9z"/></svg>'
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