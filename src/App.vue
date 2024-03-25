<template>
  <header>
  </header>

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

import { onMounted, ref } from 'vue';
import TheLift from './components/TheLift.vue';
import TheFloor from './components/TheFloor.vue';
import { useFloors } from './use/useFloors';


const [floors, levels] = useFloors();
const liftComponentRef = ref(null);

const add = (...args) => {
	liftComponentRef.value.addFloor(...args);
};

onMounted(() => {
	liftComponentRef.value.setParams();
	console.log('MOUNTED in App');
});

</script>


<style scoped>

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

	.main {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.lift {
		width: 98px;
		height: 100px;
		position: absolute;
		bottom: 1px;
		left: 1px;
		background-color: #59d298;
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
