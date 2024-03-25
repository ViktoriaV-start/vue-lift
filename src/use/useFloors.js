import { reactive } from 'vue';
import { FLOOR_QUANTITY } from '../config/constants';

export function useFloors() {
	const floors = reactive([]);
	const levels = reactive({});

	const setFloors = () => {
		for (let i = FLOOR_QUANTITY; i > 0; i--) {
			floors.push(i);
		}
	};
	const setLevels = () => {
		for (let i = 1; i <= FLOOR_QUANTITY; i++) {
			levels[i] = i * 100 - 100;
		}
	};

	setFloors();
	setLevels();

	return [floors, levels];
}
