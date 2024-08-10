<script setup>
import { defineProps, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { UP, DOWN } from '@/config/constants';
import { useGlobalObservable } from '@/store/store';

const store = useGlobalObservable();

const { levels, liftId } = defineProps(['levels', 'liftId']);
let lift = reactive({...store.value.getGroupLiftState(liftId)});

defineExpose({
	addFloor,
	setParams,
	liftId,
	lift,
	saveQueueToLocalStorage,
	run
});

const requestId = ref(null);
const liftRef = ref(null);
let liftContainer = null;
const ownQueue = [];
let timerId = null;
let isMounted = ref(true);
const isSingleLift = false;


function run () {

	const start = () => {
		lift.destination = ownQueue[0];

		if (lift.currentFloor < ownQueue[0]) {
			lift.progress = Math.abs(lift.progress);
			lift.movement = UP;
		} else {
			lift.progress = Math.abs(lift.progress) * -1;
			lift.movement = DOWN;
		}

		animate(ownQueue[0]);
	};

	if (!lift.isRun) {
		lift.isRun = true;
		isMounted.value = false;
		start();
	} else if (isMounted.value && lift.isRun) {
		ownQueue.push(lift.destination);
		isMounted.value = false;
		//lift.destination = ownQueue[0];
		animate(ownQueue[0]);
	}

};

function addFloor(floor) {

	const execute = () => {
		ownQueue.push(floor);
		run();
	};

	if (!lift.isRun) {
		execute();
	} else if (lift.isRun) {
		execute();
	}
}

function setParams() {
	liftContainer = liftRef.value;
	liftContainer.style.bottom = lift.bottom + 'px';
	liftContainer.style.left = (liftId-1) * 100 + (liftId-1) * 20 + 1 + 'px';

	if (ownQueue.length && lift.isRun) run();
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
	lift.currentFloor = floor;

	let start =  performance.now(); // временная метка в миллисекундах c начала очередного запуска ф-ции animate
	const startBottom = lift.bottom;
	const duration = (Math.abs(lift.bottom - levels[floor])*10); // 1000 2000 3000 4000

	requestId.value = requestAnimationFrame(function animate(time) {
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

				let queue = [...store.value.getLiftQueue(isSingleLift)].filter(item => item != floor);

				saveQueueToLocalStorage(queue);

				ownQueue.shift();
				delay().then(() => {
					lift.isRun = false;
					liftContainer.classList.remove('blink');
					if (ownQueue.length) run();
				});
			}
		}
	});
};

watch(lift, () => {
	store.value.setGroupLiftState({...lift});
});

function saveQueueToLocalStorage(queue) {
	const queueFloors = [];
	for (let key in queue) {
		queueFloors.push(queue[key]);
	}
	store.value.setGroupLiftQueue(queueFloors);
};

onMounted(() => console.log('MOUNTED LIFT: ', lift.id));

onUnmounted(() => {
	clearTimeout(timerId);
});

</script>

<template>
  <div class="lift" ref="liftRef" >
    <div>{{ lift.isRun ? lift.destination : '' }}</div>
    <div>{{ lift.isRun ? lift.movement : '' }}</div>
  </div>
</template>


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
