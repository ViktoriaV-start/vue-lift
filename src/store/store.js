import { createGlobalObservable, useLocalObservable } from 'mobx-vue-lite';

export const useGlobalObservable = createGlobalObservable(() => {
	return useLocalObservable(() => ({
		count: 543,
		state: {
			currentFloor: 1,
			destinationFloor: 1
		},
		getSate: () => {
			return this.state;
		},
		// set: ({}) => {

		// }

	}));
});