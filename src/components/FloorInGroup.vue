<script setup>
import { defineProps, ref } from 'vue';
import { useGlobalObservable } from '../store/store';

const store = useGlobalObservable();

const { el, add, liftsRange } = defineProps(['el', 'add', 'liftsRange']);
const number = ref(el);
const isSingleLift = false;

const getClass = () => {
	let lifts = Object.values(store.value.groupLiftState);

	let isDestination = lifts.find(item => item.destination === number.value);
	if(isDestination) return true;
	return false;
};

const handleClick = () => {
	add(number.value);
};
</script>


<template>
  <div class="floor">
    <div
        v-for="item of liftsRange"
        :key="item"
        :tube-number="item"
        class="space"
    >
    </div>

    <button
        class="btn"
        type="button"
        @click="handleClick"
        :class="store.getLiftQueue(isSingleLift).includes(number) ?
			getClass() ? 'destination' :
			'pressed' : ''"
    >
      {{ number }}
    </button>
  </div>
</template>


<style scoped>

.floor {
  display: flex;
  height: 100px;
  column-gap: 20px;
}

.space {
  height: 100px;
  width: 100px;
  border: 1px solid #D16658;
  border-top: 0;
}

.floor:first-child .space {
  border-top: 1px solid #D16658;
}

.btn {
  font-size: 16px;
  font-weight: 700;
  height: 50px;
  width: 50px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  align-self: center;
}

.btn:hover {
  background-color: #D16658;
  color: #ffffff;
}

.pressed {
  background-color: #D16658;
  color: #ffffff;
}

.destination {
  background-color: #ffa599;;
}
</style>
