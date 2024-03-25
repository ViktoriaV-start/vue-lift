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
const queue = reactive([...store.value.getLiftQueue()]);
const timer = ref(null);
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
};

function setParams() {
	liftContainer = liftRef.value;
	liftContainer.style.bottom = lift.bottom + 'px';
	console.log(liftContainer.style.bottom);

	if (queue.length) run();
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
		if (lift.bottom < -5 || lift.bottom > (Object.values(levels).at(-1) + 5)) throw new Error('КОСЯК!');


		if (requestId.value && lift.bottom !== levels[floor]) {
			if (liftContainer) draw();
			requestAnimationFrame(animate);
		} else {

			if (requestId.value) {
				cancelAnimationFrame(requestId.value);
				liftContainer.classList.add('blink');
				console.log(requestId.value)
				requestId.value = null;
				lift.currentFloor = floor;

				queue.shift();
				delay().then(() => {
					lift.isRun = false;
					liftContainer.classList.remove('blink');
					setTimeout(() => {
						if (queue.length) run();
					}, 400);
				});
			}
			// cancelAnimationFrame(requestId.value);
			// liftContainer.classList.add('blink');
			// console.log(requestId.value)
			// requestId.value = null;
			// lift.currentFloor = floor;

			// queue.shift();
			// delay().then(() => {
			// 	lift.isRun = false;
			// 	liftContainer.classList.remove('blink');
			// 	setTimeout(() => {
			// 		if (queue.length) run();
			// 	}, 400);
			// });
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
