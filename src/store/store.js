import { LIFTS_QUANTITY, LIFT_KEY, QUEUE_KEY, STATE_KEY, UP } from '@/config/constants';
import { createGlobalObservable, useLocalObservable } from 'mobx-vue-lite';

export const useGlobalObservable = createGlobalObservable(() => {
	return useLocalObservable(() => ({

		liftQueue: [],
	
		liftState: {},

		getInitialState() {
			for(let i = 1; i <= LIFTS_QUANTITY; i++) {
				this.liftState[i] = {
					id: i,
					progress: 2,
					bottom: 0,
					currentFloor: 1,
					isRun: false,
					destination: 1,
					movement: UP
				};
			}
		},

		getDestinationFloor() {
			return this.liftState.destination;
		},

		getLiftState(id) {
			return this.liftState[id];
		},

		getLiftQueue() {
			return this.liftQueue;
		},

		checkLocalStorage() {

			const setInitial = () => {
				this.getInitialState();
				localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
			};
			
			if(!localStorage.getItem(LIFT_KEY)) {
				setInitial();
			} else {
				const storage = JSON.parse(localStorage.getItem(LIFT_KEY));

				if(Object.keys(storage[STATE_KEY]).length !== LIFTS_QUANTITY) {
					setInitial();
				} else {
					this.liftState = { ...storage[STATE_KEY]};
					this.liftQueue = [ ...storage[QUEUE_KEY]];
				}
			}
		},

		setLiftState(newLiftState) {
			this.liftState = {...this.liftState, [newLiftState.id]: newLiftState};
			localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
		},

		setLiftQueue(newQueue) {
			this.liftQueue = [...newQueue];
			localStorage.setItem(LIFT_KEY, JSON.stringify({ [QUEUE_KEY]: [...this.liftQueue], [STATE_KEY]: {...this.liftState} }));
		}

	}));
});
