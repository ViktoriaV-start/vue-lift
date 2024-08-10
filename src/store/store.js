import {
	LIFT_KEY,
	QUEUE_KEY,
	STATE_KEY,
	UP,
	LIFTS_QUANTITY,
	GROUP_LIFT_KEY,
} from '../config/constants';
import { createGlobalObservable, useLocalObservable } from 'mobx-vue-lite';

export const useGlobalObservable = createGlobalObservable(() => {
	return useLocalObservable(() => ({

		liftQueue: [],
		groupLiftQueue: [],
	
		liftState: {
			bottom: 0,
			currentFloor: 1,
			isRun: false,
			destination: 1,
			movement: UP
		},

		groupLiftState: {},

		getGroupInitialState() {
			for(let i = 1; i <= LIFTS_QUANTITY; i++) {
				this.groupLiftState[i] = {
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

		getDestinationFloor(isSingleLift = true) {
			if (isSingleLift) return this.liftState.destination;
			return this.groupLiftState.destination;
		},

		getLiftState() {
			this.checkLocalStorage();
			return this.liftState;
		},

		getGroupLiftState(id) {
			return this.groupLiftState[id];
		},

		getLiftQueue(isSingleLift = true) {
			if (isSingleLift) return this.liftQueue;
			return this.groupLiftQueue;
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

		checkGroupLocalStorage() {
			const setInitial = () => {
				this.getGroupInitialState();
				localStorage.setItem(GROUP_LIFT_KEY, JSON.stringify({
					[QUEUE_KEY]: [...this.groupLiftQueue],
					[STATE_KEY]: {...this.groupLiftState}
				}));
			};

			if(!localStorage.getItem(GROUP_LIFT_KEY)) {
				setInitial();
			} else {
				const storage = JSON.parse(localStorage.getItem(GROUP_LIFT_KEY));

				if(Object.keys(storage[STATE_KEY]).length !== LIFTS_QUANTITY) {
					setInitial();
				} else {
					this.groupLiftState = { ...storage[STATE_KEY]};
					this.groupLiftQueue = [ ...storage[QUEUE_KEY]];
				}
			}
		},

		setLiftState(newLiftState) {
			this.liftState = {...newLiftState};
			localStorage.setItem(LIFT_KEY, JSON.stringify({
				[QUEUE_KEY]: [...this.liftQueue],
				[STATE_KEY]: {...this.liftState}
			}));
		},

		setGroupLiftState(newLiftState) {
			this.groupLiftState = {...this.groupLiftState, [newLiftState.id]: newLiftState};

			localStorage.setItem(GROUP_LIFT_KEY, JSON.stringify({
				[QUEUE_KEY]: [...this.groupLiftQueue],
				[STATE_KEY]: {...this.groupLiftState} }));
		},

		setLiftQueue(newQueue) {
			this.liftQueue = [...newQueue];
			localStorage.setItem(LIFT_KEY,
				JSON.stringify({
					[QUEUE_KEY]: [...this.liftQueue],
					[STATE_KEY]: {...this.liftState}
				}));
		},

		setGroupLiftQueue(newQueue) {
			this.groupLiftQueue = [...newQueue];
			localStorage.setItem(GROUP_LIFT_KEY,
				JSON.stringify({
					[QUEUE_KEY]: [...this.groupLiftQueue],
					[STATE_KEY]: {...this.groupLiftState}
				}));
		}

	}));
});
