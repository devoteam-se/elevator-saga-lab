({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {

            const pickUpLeaveQuota = 0.5;

            const waitingOnFloor = [];
            floors.forEach(floor => {
                waitingOnFloor.push(0);
            });

            const anyElevatorIsGoingThereSoon = (floorNumber) => {
                let foundOne = false;
                elevators.forEach((elevator, index) => {
                    if (index < 2) {
                        foundOne = elevator.destinationQueue.some(destination => destination == floorNumber)
                    }
                });
                return foundOne;
            };

            /**
             * @param {Floor} floor - the floors
             */
            const floorUpPressed = (floor) => {
                return floor.buttonStates.up !== '';
            }

            const floorDownPressed = (floor) => {
                return floor.buttonStates.down !== '';
            }

            const bestWaitingIndex = () => {
                let bestIndex = -1
                let bestWaiting = 0
                waitingOnFloor.forEach((peopleWaiting, index) => {
                    if (peopleWaiting > bestWaiting && !anyElevatorIsGoingThereSoon(index)) {
                        bestIndex = index
                    }
                });

                console.log("Floors", waitingOnFloor);
                console.log("Waingin", bestIndex);

                if (bestIndex >= 0) {
                    return {
                        floor: bestIndex,
                        waiting: bestWaiting
                    };
                } else {
                    return null;
                }
            }

            /**
             * @param {number} floorNum - the elevator
             * @param {Elevator} elevatorTakingFloor - the elevator
            */
            const removeFloorFromOtherQueues = (floorNum, elevatorTakingFloor) => {
                elevators.forEach(elevator => {
                    if (elevator != elevatorTakingFloor) {
                        const currentQueue = elevator.destinationQueue
                        const filteredQueue = currentQueue.filter(f => f != floorNum);
                        if (filteredQueue.length != currentQueue.length) {
                            elevator.destinationQueue = filteredQueue
                            elevator.checkDestinationQueue();
                        }
                    }
                });
            };

            /**
                * @param {Elevator} elevator - the elevator
            */
            const triggerElevatorCheck = (elevator) => {

                if (elevator.destinationQueue.length > 0) {
                    return;
                }

                const waiting = bestWaitingIndex();

                if (elevator.getPressedFloors().length > 0 && (waiting == null || waiting.waiting * pickUpLeaveQuota < elevator.loadFactor())) {
                    const pressedFloors = elevator.getPressedFloors();
                    pressedFloors.sort((a, b) => {
                        return Math.abs(elevator.currentFloor() - b) - Math.abs(elevator.currentFloor() - a);
                    });

                    const closestFloor = pressedFloors[0];
                    console.log(pressedFloors, closestFloor);
                    elevator.goToFloor(closestFloor);
                } else {
                    if (waiting != null && waiting.floor >= 0) {
                        //elevator.stop();
                        elevator.goToFloor(waiting.floor);
                    }
                }

                elevators.forEach(elevatorToCheck => {
                    setTimeout(() => {
                        if (elevatorToCheck != elevator && elevatorToCheck.destinationQueue.length == 0) {
                            triggerElevatorCheck(elevatorToCheck);
                        }
                    }, 20);
                });
            };

            const triggerAllElevatorChecks = () => {
                for (const elevator of elevators) {
                    triggerElevatorCheck(elevator);
                }
            };

            // Let's go through all the elevators
            for (const elevator of elevators) {
                // Whenever the elevator is idle, make it go to all the floors
                elevator.on('idle', () => {
                    triggerElevatorCheck(elevator);
                });

                elevator.on('stopped_at_floor', () => {
                    const floor = elevator.currentFloor();
                    waitingOnFloor[floor] = 0;
                    elevator.stop();
                    triggerElevatorCheck(elevator);
                });

                elevator.on('passing_floor', (floorNum, direction) => {
                    const floor = floors[floorNum]
                    const peopleInMyDirectionWaiting = floorUpPressed(floor) && direction == "up" || floorDownPressed(floor) && direction == "down";
                    if (elevator.loadFactor() < 0.8 && peopleInMyDirectionWaiting) {
                        elevator.goToFloor(floorNum, true);
                        removeFloorFromOtherQueues(floorNum, elevator);
                    } else if (elevator.getPressedFloors().includes(floor.floorNum())) {
                        elevator.goToFloor(floorNum, true);
                        removeFloorFromOtherQueues(floorNum, elevator);
                    }
                });
            }

            for (const floor of floors) {
                floor.on("up_button_pressed", () => {
                    waitingOnFloor[floor.floorNum()] = waitingOnFloor[floor.floorNum()] + 1;
                    triggerAllElevatorChecks();
                });

                floor.on("down_button_pressed", () => {
                    waitingOnFloor[floor.floorNum()] = waitingOnFloor[floor.floorNum()] + 1;
                    triggerAllElevatorChecks();
                });
            }
        },

    update:
        /**
         * @param {number} dt - time difference from last call
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function update(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
})