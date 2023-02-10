({
    init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {
        let goingUp = true;
        // Let's go through all the elevators
        for (const elevator of elevators) {
            // Whenever the elevator is idle, make it go to all the floors
            elevator.on('idle', () => {
                const curr = elevator.currentFloor(); 
                if (elevator.currentFloor() === floors.length) {
                    goingUp = false;
                } 
                if (elevator.currentFloor() === 0) {
                    goingUp = true;
                } 

                elevator.goToFloor((curr + (goingUp ? 1 : -1)) % floors.length);
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
