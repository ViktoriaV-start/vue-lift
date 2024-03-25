<template>
	<div class="lift" ref="liftRef" >
		<div>{{ lift.isRun ? lift.destination : '' }}</div>
		<div>{{ lift.isRun ? lift.movement : '' }}</div>
	</div>
</template>


<script setup>
import { defineProps, reactive, ref, watch } from 'vue';
import { UP, DOWN } from '../config/constants';
import { useGlobalObservable } from '../store/store';

const store = useGlobalObservable();

let lift = reactive({...store.value.getLiftState()});

defineExpose({
	addFloor,
	setParams,
	lift
});

const { levels } = defineProps(['levels']);
const requestId = ref(null);
const liftRef = ref(null);
let liftContainer = null;
//const queue = reactive([[...store.value.getLiftQueue()]]);
const queue = reactive([]);
const timer = ref(null);



const run = () => {


	if (!lift.isRun) {
		lift.isRun = true;
		lift.destination = queue[0].floor;

		if (lift.currentFloor < queue[0].floor) {
			lift.progress = Math.abs(lift.progress);
			lift.movement = UP;
		} else {
			lift.progress = Math.abs(lift.progress) * -1;
			lift.movement = DOWN;
		}
		animate(queue[0].floor);
	} 
};


function addFloor(floor, toggleBtn) {

	//lift.destination = floor;

	const execute = () => {
		toggleBtn();
		queue.push({floor, toggleBtn});
		run();
	};

	if (!lift.isRun && !queue.includes(floor) && lift.currentFloor !== floor) {
		execute();
	} else if (lift.isRun && !queue.includes(floor)) {
		execute();
	}
};
 
function setParams() {
	// элемент DOM будет определён в ref после первоначальной отрисовки
	store.value.checkLocalStorage();
	liftContainer = liftRef.value;
	liftContainer.style.bottom = lift.bottom + 'px';
	console.log(liftContainer.style.bottom);
	console.log(lift, {...store.value.getLiftState()});
};

const draw = () => {

	lift.bottom = lift.bottom + lift.progress;
	liftRef.value.style.bottom = lift.bottom + 'px';
};

const delay = () => {
	return new Promise((resolve) => {
		timer.value = setTimeout(resolve, 3000);
	})
		.catch (er => console.log(er));
};

const animate = (floor) => {

	requestId.value = requestAnimationFrame(function animate() {

		if (liftContainer) draw();

		if (requestId.value && lift.bottom !== levels[floor]) {
			requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(requestId.value);
			liftContainer.classList.add('blink');
			requestId.value = null;
			lift.currentFloor = floor;

			queue[0].toggleBtn();
			queue.shift();
			delay().then(() => {
				lift.isRun = false;
				liftContainer.classList.remove('blink');
				setTimeout(() => {
					
					if (queue.length) run();
				}, 400);
			});
		}
	});
};

watch(lift, () => {
	store.value.setLiftState({...lift});
});


</script>

<style scoped>

.lift {
	width: 98px;
	height: 100px;
	position: absolute;
	bottom: 1px;
	left: 1px;
	background-color: #59d298;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	color: #48524D;
	font-size: 14px;
	font-weight: 700;
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