import { LIFT_KEY, QUEUE_KEY, STATE_KEY, UP } from '@/config/constants';
import { createGlobalObservable, useLocalObservable } from 'mobx-vue-lite';

export const useGlobalObservable = createGlobalObservable(() => {
	return useLocalObservable(() => ({

		liftQueue: [],
	
		liftState: {
			progress: 2,
			bottom: 0,
			currentFloor: 1,
			isRun: false,
			destination: 1,
			movement: UP
		},

		getDestinationFloor() {
			return this.liftState.destination;
		},

		getLiftState() {
			this.checkLocalStorage();
			return this.liftState;
		},

		getLiftQueue() {
			return this.liftQueue;
		},

		checkLocalStorage() {

			if(!localStorage.getItem(LIFT_KEY)) {
				localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
			} else {
				const storage = JSON.parse(localStorage.getItem(LIFT_KEY));
				this.liftState = { ...storage[STATE_KEY]};
				this.liftQueue = [ ...storage[QUEUE_KEY]];
			}
		},

		setLiftState(newLiftState) {
			this.liftState = {...newLiftState};
			localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
		},

		setLiftQueue(newQueue) {

			this.liftQueue = [...newQueue];
			localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
		}

	}));
});
