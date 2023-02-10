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
        elevator.on("idle", () => {
          elevator.goToFloor(0);
        });

        elevator.on("floor_button_pressed", function (floorNum) {
          elevator.goToFloor(floorNum);
        });

        elevator.on("passing_floor", function (floorNum, direction) {
          if (elevator.destinationQueue.includes(floorNum)) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (q) => q !== floorNum
            );
            elevator.checkDestinationQueue();
            elevator.goToFloor(floorNum, true);
          }
        });

        elevator.on("stopped_at_floor", function (floorNum) {
          if (elevator.destinationQueue.includes(floorNum)) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (q) => q !== floorNum
            );
            elevator.checkDestinationQueue();
          }
        });
      }

      /**
       *
       * @param {Floor} floor
       */
      const onButtonPressed = (floor) => {
        if (
          elevators.some((e) => e.destinationQueue.includes(floor.floorNum()))
        ) {
          return;
        }
        const freeElevators = elevators
          .filter((e) => e.loadFactor() === 0)
          .filter((e) => e.destinationQueue.length === 0);
        if (freeElevators.length) {
          freeElevators[0].goToFloor(floor.floorNum());
        } else {
          const leastBusy = elevators.sort(
            (e1, e2) => e2.destinationQueue.length - e1.destinationQueue.length
          );
          leastBusy[0].goToFloor(floor.floorNum());
        }
      };

      for (const floor of floors) {
        floor.on("up_button_pressed", function () {
          onButtonPressed(floor);
        });

        floor.on("down_button_pressed", function () {
          onButtonPressed(floor);
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
    },
});
