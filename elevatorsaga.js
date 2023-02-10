({
    init:
        /**
         * @param {Elevator[]} elevators - the elevators
         * @param {Floor[]} floors - the floors
         */
        function init(elevators, floors) {
            // Let's go through all the elevators
            for (const elevator of elevators) {
                // Whenever the elevator is idle, make it go to all the floors
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
