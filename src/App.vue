<template>
	<main class="main">
		<TheFloor
		v-for="el of floors"
		:key="el"
		:el="el"
		:add="add"
		>
	</TheFloor>
		<TheLift :levels="levels" ref="liftComponentRef" />
	</main>

</template>

<script setup>

import { onMounted, onUpdated, ref } from 'vue';
import TheLift from './components/TheLift.vue';
import TheFloor from './components/TheFloor.vue';
import { useFloors } from './use/useFloors';


const [floors, levels] = useFloors();
const liftComponentRef = ref(null);

const add = (value) => {
	liftComponentRef.value.addFloor(value);
};

onMounted(() => {
	liftComponentRef.value.setParams();
	console.log('MOUNTED in App');
});

onUpdated(() => {
	console.log('UPDATE IN APP');
});

</script>


<style scoped>

html,
body {
	height: 100%;
	background-color: #FFF9F0;
}

	.main {
		display: flex;
		flex-direction: column;
		position: relative;
		margin: 5rem 0 0 5rem;
	}

	.blink {
  animation-name: blinker;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(1.0,0,0,1.0);
  animation-duration: 0.6s;
  -webkit-animation-name: blinker;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: cubic-bezier(1.0,0,0,1.0);
  -webkit-animation-duration: 0.6s;
}
 
@keyframes blinker {
  from { opacity: 1.0; }
  to { opacity: 0.0; }
}
 
@-webkit-keyframes blinker {
  from { opacity: 1.0; }
  to { opacity: 0.0; }
}

</style>
