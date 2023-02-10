({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {

            const pickUpLeaveQuota = 0.3;
            const nullWaitingOnFloor = {
                people: 0,
                longestWait: -1
            };

            const waitingOnFloor = [];
            floors.forEach(floor => {
                waitingOnFloor.push(nullWaitingOnFloor);
            });

            const waitTimeInElevator = []
            elevators.forEach(e => {
                const perElevator = [];
                floors.forEach(f => {
                    perElevator.push(-1)
                });
                waitTimeInElevator.push(perElevator);
            });

            const elevatorIsGoingThereSoon = (floorNumber) => {
                let otherElevator = null;
                elevators.forEach((elevator, index) => {
                    if (index < 2) {
                        if (elevator.destinationQueue.find(destination => destination == floorNumber)) {
                            otherElevator = elevator
                        }
                    }
                });
                return otherElevator;
            };

            const anyElevatorIsGoingThereSoon = (floorNumber) => {
                return elevatorIsGoingThereSoon(floorNumber) != null;
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

            const maxPeopleFloorNoElevatorTaken = () => {
                let bestIndex = -1
                let bestWaiting = 0
                waitingOnFloor.forEach(({ people }, index) => {
                    if (people > bestWaiting && !anyElevatorIsGoingThereSoon(index)) {
                        bestIndex = index
                        bestWaiting = people
                    }
                });

                if (bestIndex >= 0) {
                    return {
                        floor: bestIndex,
                        waiting: bestWaiting
                    };
                } else {
                    return null;
                }
            }

            const maxTimeFloorNoElevatorTaken = () => {
                let bestIndex = -1
                let bestWaiting = 0
                waitingOnFloor.forEach(({ people, longestWaitTime }, index) => {
                    if (longestWaitTime < bestWaiting && !anyElevatorIsGoingThereSoon(index)) {
                        bestIndex = index
                        bestWaiting = longestWaitTime
                    }
                });

                if (bestIndex >= 0) {
                    return {
                        floor: bestIndex,
                        waiting: Date.now() - bestWaiting
                    };
                } else {
                    return null;
                }
            }

            /**
             * @param {number} timeCoeff - the elevator
            */
            const bestFloorNoElevatorTaken = (timeCoeff) => {
                const maxPeopleFloor = maxPeopleFloorNoElevatorTaken();
                const maxTimeFloor = maxTimeFloorNoElevatorTaken();
                if (maxPeopleFloor == null) {
                    return maxTimeFloor;
                } else if (maxTimeFloor == null) {
                    return maxPeopleFloor;
                } else if(maxTimeFloor.waiting * timeCoeff > maxPeopleFloor.waiting){
                    return maxTimeFloor
                } else {
                    return maxPeopleFloor
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

            const longestWaitedFloor = (elevatorIndex) => {
                const floorTimestamps = waitTimeInElevator[elevatorIndex];
                let longestTime = -1;
                let longestWaitFloor = -1;
                floorTimestamps.forEach((timestamp, floor) => {
                    if (longestWaitFloor == -1 || timestamp < longestTime) {
                        longestTime = timestamp;
                        longestWaitFloor = floor;
                    }
                });

                if (longestTime > 0) {
                    return {
                        floor: longestWaitFloor,
                        waitTime: longestTime
                    }
                } else {
                    return null
                }
            }

            /**
                * @param {Elevator} elevator - the elevator
            */
            const triggerElevatorCheck = (elevator, elevatorIndex) => {

                if (elevator.destinationQueue.length > 0) {
                    return;
                }

                const waiting = bestFloorNoElevatorTaken(2.0);
                if (waiting) {
                    console.log(`[${elevatorIndex}]: best floor: ${waiting.floor} because value: ${waiting.waiting}`)
                }

                if (elevator.getPressedFloors().length > 0) {
                    const longestWaited = longestWaitedFloor(elevatorIndex);
                    if (longestWaited) {
                        elevator.goToFloor(longestWaited.floor);
                    } else {
                        const pressedFloors = elevator.getPressedFloors();
                        pressedFloors.sort((a, b) => {
                            return Math.abs(elevator.currentFloor() - b) - Math.abs(elevator.currentFloor() - a);
                        });

                        const closestFloor = pressedFloors[0];
                        elevator.goToFloor(closestFloor);
                    }
                } else {
                    if (waiting != null && waiting.floor >= 0) {
                        //elevator.stop();
                        elevator.goToFloor(waiting.floor);
                    }
                }

                /*elevators.forEach(elevatorToCheck => {
                    setTimeout(() => {
                        if (elevatorToCheck != elevator && elevatorToCheck.destinationQueue.length == 0) {
                            triggerElevatorCheck(elevatorToCheck);
                        }
                    }, 20);
                });*/
            };

            const triggerAllElevatorChecks = () => {
                elevators.forEach((elevator, elevatorIndex) => {
                    triggerElevatorCheck(elevator, elevatorIndex);
                });
            };

            const increasePeopleOnFloor = (floorNum) => {
                const oldValue = waitingOnFloor[floorNum];
                const oldestTimestamp = oldValue.longestWait == -1 ? Date.now() : oldValue.longestWait;
                waitingOnFloor[floorNum] = {
                    people: oldValue.people + 1,
                    longestWait: oldestTimestamp
                }
            }

            const closestEmptyElevator = (floorNum) => {
                let bestElevator = null;
                let closestDist = 1000000;
                elevators.forEach(elevator => {
                    const dist = Math.abs(floorNum - elevator.currentFloor())
                    if (elevator.destinationQueue.length == 0 && dist < closestDist) {
                        closestDist = dist
                        bestElevator = elevator
                    }
                });
                return bestElevator
            }

            // Let's go through all the elevators
            elevators.forEach((elevator, elevatorIndex) => {
                // Whenever the elevator is idle, make it go to all the floors
                elevator.on('idle', () => {
                    triggerElevatorCheck(elevator, elevatorIndex);
                });

                elevator.on('stopped_at_floor', () => {
                    const floor = elevator.currentFloor();
                    waitTimeInElevator[elevatorIndex][floor] == -1;
                    waitingOnFloor[floor] = nullWaitingOnFloor;
                    elevator.stop();
                    triggerElevatorCheck(elevator, elevatorIndex);
                });

                elevator.on('passing_floor', (floorNum, direction) => {
                    const floor = floors[floorNum]
                    const peopleInMyDirectionWaiting = floorUpPressed(floor) && direction == "up" || floorDownPressed(floor) && direction == "down";
                    const otherIdle = closestEmptyElevator(floorNum)
                    const otherElevatorOnWay = elevatorIsGoingThereSoon(floorNum);
                    if (!otherIdle && 
                        (otherElevatorOnWay && otherElevatorOnWay.loadFactor() > elevator.loadFactor() || elevator.loadFactor() < 0.8) && 
                        peopleInMyDirectionWaiting) {
                        elevator.goToFloor(floorNum, true);
                        removeFloorFromOtherQueues(floorNum, elevator);
                    } else if (elevator.getPressedFloors().includes(floor.floorNum())) {
                        elevator.goToFloor(floorNum, true);
                        removeFloorFromOtherQueues(floorNum, elevator);
                    }
                });

                elevator.on('floor_button_pressed', floorNum => {
                    if (waitTimeInElevator[elevatorIndex][floorNum] == -1) {
                        waitTimeInElevator[elevatorIndex][floorNum] == Date.now();
                    }
                });
            });

            for (const floor of floors) {
                floor.on("up_button_pressed", () => {
                    increasePeopleOnFloor(floor.floorNum());
                    const elevator = closestEmptyElevator(floor.floorNum());
                    if (elevator) {
                        elevator.goToFloor(floor.floorNum());
                    }
                });

                floor.on("down_button_pressed", () => {
                    increasePeopleOnFloor(floor.floorNum());
                    const elevator = closestEmptyElevator(floor.floorNum());
                    if (elevator) {
                        elevator.goToFloor(floor.floorNum());
                    }
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