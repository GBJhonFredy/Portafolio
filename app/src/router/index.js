import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ReplyMessenger from '../views/ReplyMessenger.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // tu escritorio XP
  },
  {
    path: '/ReplyMessenger',
    name: 'reply-messenger',
    component: ReplyMessenger, // el panel de respuestas
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;