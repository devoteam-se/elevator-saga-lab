({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {
            for (const elevator of elevators) {
                elevator.on('idle', () => {
                    elevator.getPressedFloors().forEach(f => elevator.goToFloor(f));
                    if (elevator.getPressedFloors().length === 0) {
                        elevator.goToFloor(0);
                    }
                })
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
