import { createRouter, createWebHashHistory ,createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DonationView from '@/views/DonationView.vue'
import DestructureView from '@/views/DestructureView.vue'
import MealView from '@/views/MealView.vue'

// Dynamically get the base URL from the current location
const getBaseUrl = () => {
  const baseElement = document.querySelector('base');
  if (baseElement) {
    return baseElement.getAttribute('href').replace(/\/+$/, '') + '/';
  }

  const { pathname } = window.location;
  const pathArray = pathname.split('/');

  // If the path array length is greater than 1, join the segments to form the base URL
  if (pathArray.length > 1) {
    const baseUrl = `/${pathArray.slice(1, -1).join('/')}`;
    return baseUrl.replace(/\/+$/, '') + '/';
  }

  return '/'; // Fallback to root if nothing else is found
};

const router = createRouter({

  history: createWebHashHistory(getBaseUrl()),
  // history:createWebHistory(getBaseUrl()),


  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/sadaqa',
      name: 'donation',
      component: DonationView
    },
    {
      path: '/travauxdestructure',
      name: 'destructure',
      component: DestructureView
    },


    {
      path: '/zakatalmal',
      name: 'meal',
      component: MealView
    },


  ]
})

export default router
