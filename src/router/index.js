import { createMemoryHistory, createRouter } from 'vue-router';
import HomeView from '@/views/HomeView.vue';


const routes =  [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/lifts',
		name: 'lifts',
		component: () => import('../views/LiftsView.vue')
	},
	// {
	// 	path: '/:pathMatch(.*)*',
	// 	name: 'NotFound',
	// 	component: ()=> import('@/views/NotFoundView.vue')
	// }
];

const router = createRouter({
	history: createMemoryHistory(),
	routes
});

export default router;
