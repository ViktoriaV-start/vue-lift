import { createWebHistory , createRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';


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
	{
		path: '/task',
		name: 'task',
		component: () => import('../views/TaskView.vue')
	},
	// {
	// 	path: '/:pathMatch(.*)*',
	// 	name: 'notFound',
	// 	component: ()=> import('../views/NotFoundView.vue')
	// }
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

export default router;
