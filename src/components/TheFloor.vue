<template>
	<div class="floor">
			<div class="space"></div>
			<button class="btn" type="button" @click="handleClick" :class="isPressed ? 'pressed' : ''">{{ number }}</button>
	</div>
</template>


<script setup>
import { defineProps, ref } from 'vue';

const { el, add } = defineProps(['el', 'add']);
const number = ref(el);
const isPressed = ref(false);

const toggleBtn = () => {
	isPressed.value = !isPressed.value;
};

const handleClick = () => {
	if (!isPressed.value) {
		add(number.value, toggleBtn);
	}
};





</script>

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

	


</style>