import { createRouter, createWebHistory } from 'vue-router';
import PanVerification from '@/components/pan-verification.vue';

const routes = [
  {
    path: '/pan-verification',
    name: 'PanVerification',
    component: PanVerification,  
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
