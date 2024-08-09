<template>
	<div class="lift" ref="liftRef" >
		<div>{{ lift.isRun ? lift.destination : '' }}</div>
		<div>{{ lift.isRun ? lift.movement : '' }}</div>
	</div>
</template>


<script setup>
import { defineProps, onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue';
import { UP, DOWN } from '../config/constants';
import { useGlobalObservable } from '../store/store';

const store = useGlobalObservable();

let lift = reactive({...store.value.getLiftState()});

defineExpose({
	addFloor,
	setParams
});

const { levels } = defineProps(['levels']);
const requestId = ref(null);
const liftRef = ref(null);
let liftContainer = null;
const queue = reactive([...store.value.getLiftQueue()]);
let timerId = null;
let isMounted = true;

const run = () => {

	const start = () => {
		lift.destination = queue[0];

		if (lift.currentFloor < queue[0]) {
			lift.progress = Math.abs(lift.progress);
			lift.movement = UP;
		} else {
			lift.progress = Math.abs(lift.progress) * -1;
			lift.movement = DOWN;
		}
		animate(queue[0]);
	};

	if (!lift.isRun) {
		lift.isRun = true;
		isMounted = false;
		start();
	}

	if (isMounted && lift.isRun) {
		isMounted = false;
		start();
	}

};

function addFloor(floor) {

	const execute = () => {
		queue.push(floor);
		run();
	};

	if (!lift.isRun && !queue.includes(floor) && lift.currentFloor !== floor) {
		execute();
	} else if (lift.isRun && !queue.includes(floor)) {
		execute();
	}
}

function setParams() {
	liftContainer = liftRef.value;
	liftContainer.style.bottom = lift.bottom + 'px';
	if (queue.length) run();
}

const draw = (time, startLevel, duration) => {
	if (time > duration) {
		lift.bottom = levels[lift.destination];
	} else if (lift.movement === 'DOWN') {
		lift.bottom = startLevel - time/10;
	} else {
		lift.bottom = startLevel + time/10;
	}
	liftRef.value.style.bottom = lift.bottom + 'px';
	//console.log('Стартовый уровень: ', startLevel, 'Время: ', time, 'Передвинулся на: ', time/10, lift.bottom);
};

const delay = () => {
	return new Promise((resolve) => {
		timerId = setTimeout(resolve, 3000);
	})
		.catch (er => console.log(er));
};

const animate = (floor) => {

	let start =  performance.now(); // временная метка в миллисекундах c начала очередного запуска ф-ции animate
	const startBottom = lift.bottom;
	const duration = (Math.abs(lift.bottom - levels[floor])*10); // 1000 2000 3000 4000

	requestId.value = requestAnimationFrame(function animate(time) {
		// time - временная метка - начало работы requestAnimationFrame
		if (time < start) start = time - 1;
		let timePassed = time - start;

		if (lift.bottom < -5 || lift.bottom > (Object.values(levels).at(-1) + 5)) throw new Error('КОСЯК!');

		if (requestId.value && lift.bottom !== levels[floor]) {
			if (liftContainer) draw(timePassed, startBottom, duration);
			requestAnimationFrame(animate);
		} else {
			if (requestId.value) {
				cancelAnimationFrame(requestId.value);
				liftContainer.classList.add('blink');

				requestId.value = null;
				lift.currentFloor = floor;

				queue.shift();
				delay().then(() => {
					lift.isRun = false;
					liftContainer.classList.remove('blink');
					if (queue.length) run();
				});
			}
		}
	});
};

watch(lift, () => {
	store.value.setLiftState({...lift});
});

watch(queue, () => {
	const queueFloors = [];
	for (let key in queue) {
		queueFloors.push(queue[key]);
	}
	store.value.setLiftQueue(queueFloors);
});

onUnmounted(() => {
	clearTimeout(timerId);
});

onUpdated(() => {
	console.log('UPDATE IN LIFT');
});

onMounted(() => {
	setParams();
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
