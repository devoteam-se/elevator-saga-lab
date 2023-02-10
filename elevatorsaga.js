({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {
            for (const elevator of elevators) {
                elevator.on('idle', () => {
                    elevator.goToFloor(0);
                })
                elevator.on('floor_button_pressed', (floorNum) => {
                    elevator.goToFloor(floorNum);
                })
            }

            const getEmptiestElevator = () => {
                return [...elevators].sort((e1, e2) => {
                    return e1.destinationQueue.length - e2.destinationQueue.length;
                })[0];
            }
            const onFloorButtonPressed = (floor) => {
                const elevatorsGoingThere = elevators
                    .filter(e => e.destinationQueue.includes(floor.floorNum()))
                    .filter(e => e.loadFactor() === 0)
                if (!elevatorsGoingThere.length) {
                    getEmptiestElevator().goToFloor(floor.floorNum());
                }
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

