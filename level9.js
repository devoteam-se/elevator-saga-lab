({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {

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
                * @param {Elevator} elevator - the elevator
            */
            const triggerElevatorCheck = (elevator) => {

                const waiting = bestWaitingIndex();

                if (elevator.getPressedFloors().length > 0 && (waiting == null || waiting.waiting/3 < elevator.loadFactor())) {
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
                    triggerElevatorCheck(elevator);
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