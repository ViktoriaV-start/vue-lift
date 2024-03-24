<template>
  <header>
  </header>

	<main class="main">
		<TheFloor v-for="el of floors" :key="el" :el="el" :add="add"></TheFloor>
		<!-- <div class="lift" ref="liftRef"></div> -->

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


// const requestId = ref(null);
// const liftRef = ref(null);
// let liftContainer = null;
// const queue = reactive([]);
// const timer = ref(null);

// const lift = reactive({
// 	progress: 2,
// 	bottom: 0,
// 	currentFloor: 1,
// 	isRun: false
// });

// const run = () => {
// 	if (!lift.isRun) {
// 		lift.isRun = true;

// 		if (lift.currentFloor < queue[0].floor) {
// 			lift.progress = Math.abs(lift.progress);
// 		} else {
// 			lift.progress = Math.abs(lift.progress) * -1;
// 		}
// 		animate(queue[0].floor);
// 	}

// };


// const addFloor = (floor, toggleBtn) => {

// 	const execute = () => {
// 		toggleBtn();
// 		queue.push({floor, toggleBtn});
// 		run();
// 	};
// 	if (!lift.isRun && !queue.includes(floor) && lift.currentFloor !== floor) {
// 		execute();
// 	} else if (lift.isRun && !queue.includes(floor)) {
// 		execute();
// 	}
// };

// const draw = () => {

// 	lift.bottom = lift.bottom + lift.progress;
// 	liftRef.value.style.bottom = lift.bottom + 'px';
// };

// const delay = () => {
// 	return new Promise((resolve) => {
// 		timer.value = setTimeout(resolve, 3000);
// 	})
// 		.catch (er => console.log(er));
// };

// const animate = (floor) => {

// 	requestId.value = requestAnimationFrame(function animate() {

// 		if (liftContainer) draw();

// 		if (requestId.value && lift.bottom !== levels[floor]) {
// 			requestAnimationFrame(animate);
// 		} else {
// 			cancelAnimationFrame(requestId.value);
// 			liftContainer.classList.add('blink');
// 			requestId.value = null;
// 			lift.currentFloor = floor;

// 			queue[0].toggleBtn();
// 			queue.shift();
// 			delay().then(() => {
// 				lift.isRun = false;
// 				liftContainer.classList.remove('blink');
// 				setTimeout(() => {
					
// 					if (queue.length) run();
// 				}, 400);

				
				
// 			});
			
			
// 		}
// 	});



// };


onMounted(() => {
	// элемент DOM будет определён в ref после первоначальной отрисовки

	// liftContainer = lift.value;
	// liftContainer.style.bottom = lift.bottom + 'px';
	// console.log(liftContainer.style.bottom);

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

