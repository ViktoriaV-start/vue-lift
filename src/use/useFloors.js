import { reactive } from 'vue';
import { FLOOR_QUANTITY, LIFTS_QUANTITY } from '../config/constants';

export function useFloors() {
	const floors = reactive([]);
	const levels = reactive({});
	const liftsRange = reactive([]);

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
	const setLiftsRange = () => {
		for (let i = 1; i <= LIFTS_QUANTITY; i++) {
			liftsRange.push(i);
		}
	};

	setFloors();
	setLevels();
	setLiftsRange();

	return [floors, levels, liftsRange];
}
