({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {
            const getEmptiestElevator = () => {
                return [...elevators].sort((e1, e2) => e1.loadFactor() - e2.loadFactor())[0];
            }

            for (const elevator of elevators) {
                elevator.on('idle', () => {
                    elevator.getPressedFloors().forEach(f => elevator.goToFloor(f));
                    if (elevator.getPressedFloors().length === 0) {
                        elevator.goToFloor(0);
                    }
                })
            }

            const onFloorButtonPressed = (floor) => {
                getEmptiestElevator().goToFloor(floor.floorNum());
            }

            for (const floor of floors) {
                floor.on('up_button_pressed', onFloorButtonPressed);
                floor.on('down_button_pressed', onFloorButtonPressed);
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
