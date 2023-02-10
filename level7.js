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

            const anyElevatorIsGoingThere = (floorNumber) => {
                return elevators.some((elevator) => {
                    return elevator.destinationQueue.some(destination => destination == floorNumber)
                });
            };

            /**
                * @param {Elevator} elevator - the elevator
            */
            const triggerElevatorCheck = (elevator) => {
                if (elevator.loadFactor() > 0.5 && elevator.getPressedFloors().length > 0) {
                    const pressedFloors = elevator.getPressedFloors();
                    pressedFloors.sort((a, b) => {
                        return Math.abs(elevator.currentFloor() - b) - Math.abs(elevator.currentFloor() - a);
                    });

                    const closestFloor = pressedFloors[0];
                    console.log(pressedFloors, closestFloor);
                    elevator.goToFloor(closestFloor);
                } else {
                    let bestIndex = -1
                    let bestWaiting = 0
                    waitingOnFloor.forEach((peopleWaiting, index) => {
                        if (peopleWaiting > bestWaiting && !anyElevatorIsGoingThere(index)) {
                            bestIndex = index
                        }
                    });

                    console.log("Floors", waitingOnFloor);
                    console.log("Waingin", bestIndex);

                    if (bestIndex >= 0) {
                        //elevator.stop();
                        elevator.goToFloor(bestIndex);
                    }
                }
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
                    triggerElevatorCheck(elevator);
                    const floor = elevator.currentFloor();
                    waitingOnFloor[floor] = 0;
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