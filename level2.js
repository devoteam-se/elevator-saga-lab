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

        /**
     * @param {Elevator} elevator - the elevator
     */
        const triggerElevatorCheck = (elevator) => {
            if (elevator.loadFactor() > 0.01 && elevator.getPressedFloors().length > 0) {
                const pressedFloors = elevator.getPressedFloors();
                pressedFloors.sort((a, b) => {
                    return Math.abs(elevator.currentFloor() - b) - Math.abs(elevator.currentFloor() - a);
                });

                const closestFloor = pressedFloors[0];
                console.log(pressedFloors, closestFloor);
                elevator.goToFloor(closestFloor);
            } else {
                const floorWithWaiting = floors.find(floor => {
                    const buttonState = floor.buttonStates
                    console.log("Buttonstate: ", buttonState);
                    return buttonState.down !== '' || buttonState.up != ''
                });

                console.log("Waingin", floorWithWaiting);

                if (floorWithWaiting) {
                    elevator.goToFloor(floorWithWaiting.floorNum())
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
            });
        }

        for (const floor of floors) {
            floor.on("up_button_pressed", () => {
                triggerAllElevatorChecks();
            });

            floor.on("down_button_pressed", () => {
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