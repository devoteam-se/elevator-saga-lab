({
    init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {

        // Add floor to elevator with smallest que if the floor isn't already in que
        const callElevator = (floor) => {
            const elevatorWithSmallestCue = elevators.reduce((a, b) => a.destinationQueue.length <= b.destinationQueue.length ? a : b)
            const pendingFloors = elevators.flatMap(elevator => elevator.destinationQueue)
       
            if (!pendingFloors.includes(floor.level)) {
                elevatorWithSmallestCue.destinationQueue.push(floor.level)
                elevatorWithSmallestCue.checkDestinationQueue();
            }
        }

        elevators.forEach(elevator => {
            // Go to floor when button in elevator is pressed.
            elevator.on('floor_button_pressed', (floorNum => {
                if (!elevator.destinationQueue.includes(floorNum)) {
                    elevator.destinationQueue.push(floorNum)
                    elevator.checkDestinationQueue();
                  }
            }))

            // Stop at floor if the passing floor is in the destinationQueue
            elevator.on('passing_floor', (floorNum, direction) => {
                if(elevator.destinationQueue.includes(floorNum)) {
                    const index = elevator.destinationQueue.indexOf(floorNum)
                    elevator.destinationQueue.splice(index, 1);
                    elevator.destinationQueue.unshift(floorNum)
                    elevator.checkDestinationQueue();
                }
            })
        })

        // Call elevator to floor
        floors.forEach(floor => {
            floor.on('down_button_pressed', () => {
                callElevator(floor)
            })

            floor.on('up_button_pressed', () => {
                callElevator(floor)
            })
        })
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
