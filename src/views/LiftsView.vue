<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import LiftInGroup from '../components/LiftInGroup.vue';
import FloorInGroup from '../components/FloorInGroup.vue';
import { useGlobalObservable } from '../store/store';
import { useGroupLiftFloors } from '../use/useGroupLiftFloors.js';

const store = useGlobalObservable();
store.value.checkGroupLocalStorage();

const [floors, levels, liftsRange] = useGroupLiftFloors();
const liftComponentRef = ref([]);
let timerId = null;
let liftsArray = reactive([]);
const isSingleLift = false;

const checkForTheSameFloor = (value) => {
	if(liftsArray.find(item => item[1].lift.currentFloor === value)) return true;
};

const pushFloor = (value) => {
	if(!store.value.getLiftQueue(isSingleLift).includes(value)) {
		let queue = [...store.value.getLiftQueue(isSingleLift)];
		queue.push(value);
		liftsArray[0][1].saveQueueToLocalStorage(queue);
	}
};

const findTheNearestLift = (value) => {
	let notRunning = liftsArray.filter(item => !item[1].lift.isRun);
	let nearestArr = [];

	if (notRunning.length) {
		nearestArr = notRunning.reduce((acc, item) => {
			if (((Math.abs(value - item[1].lift.currentFloor) - Math.abs(value - acc[1].lift.currentFloor)) === 0) && !item[1].lift.isRun) {
				if(item[1].lift.currentFloor > value) return item;
				return acc;
			}
			if (((Math.abs(value - item[1].lift.currentFloor) - Math.abs(value - acc[1].lift.currentFloor)) > 0) && !item[1].lift.isRun) {
				return acc;
			}
			return item;
		}, notRunning[0]);
	}

	return nearestArr;
};

const add = (value) => {
	let isTheSameFloor = checkForTheSameFloor(value);

	if (!isTheSameFloor) {
		pushFloor(value);
		let nearest = findTheNearestLift(value);

		if(nearest.length) {
			nearest[1].addFloor(value);
		} else {
			timerId = setTimeout(() => add(value), 500);
		}
	}
};

onMounted(() => {
	liftComponentRef.value.forEach(item => {
		item.setParams();
		if(item.lift.isRun) {
			item.run();
		}
	});
	liftsArray = Object.entries(liftComponentRef.value);
	let currentQueue = store.value.getLiftQueue(isSingleLift);
	if(currentQueue.length) {
		for (let key in currentQueue) {
			add(currentQueue[key]);
		}
	}

	console.log('MOUNTED in App');
});

onUnmounted(() => {
	clearTimeout(timerId);
});
</script>

<template>
  <section class="lifts-container">
    <FloorInGroup
        v-for="el of floors"
        :key="el"
        :el="el"
        :liftsRange="liftsRange"
        :add="add"
    >
    </FloorInGroup>
    <LiftInGroup
        v-for="item of liftsRange"
        :key="item"
        :liftId="item"
        :levels="levels"
        ref="liftComponentRef"
    />
  </section>
</template>


<style scoped>

html,
body {
  height: 100%;
  background-color: #FFF9F0;
}

.lifts-container {
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
