({
  init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {
      /**
       *
       * @param {Elevator} elevator
       * @param {number} floorNum
       */
      const removeNextFloorFromQueueIfIrrelevant = (elevator, floorNum) => {
        const nextFloorNum = elevator.destinationQueue.length
          ? elevator.destinationQueue[0]
          : -1;
        if (nextFloorNum !== -1) {
          if (elevator.getPressedFloors().includes(nextFloorNum)) {
            return;
          }
          const nextFloor = floors.find((f) => f.floorNum() === nextFloorNum);
          if (
            nextFloor.buttonStates.down === "" &&
            nextFloor.buttonStates.up === ""
          ) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (q) => q !== floorNum
            );
            elevator.checkDestinationQueue();
          }
        }
      };

      // Let's go through all the elevators
      for (const elevator of elevators) {
        elevator.on("idle", () => {
          elevator.goToFloor(0);
        });

        elevator.on("floor_button_pressed", function (floorNum) {
          elevator.goToFloor(floorNum);
        });

        elevator.on("passing_floor", function (floorNum, direction) {
          //   const slice = elevator.getPressedFloors().slice(0, 3);
          //   if (!slice.includes(floorNum)) {
          //     return;
          //   }

          if (elevator.destinationQueue.includes(floorNum)) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (q) => q !== floorNum
            );
            elevator.checkDestinationQueue();
            elevator.goToFloor(floorNum, true);
          }
        });

        elevator.on("stopped_at_floor", function (floorNum) {
          removeNextFloorFromQueueIfIrrelevant(elevator, floorNum);
        });
      }

      /**
       *
       * @param {Elevator[]} elevators
       * @param {Floor} floor
       */
      const closestElevator = (elevators, floor) => {
        return elevators.sort((e1, e2) => {
          const diff1 = Math.abs(e1.currentFloor() - floor.floorNum());
          const diff2 = Math.abs(e2.currentFloor() - floor.floorNum());
          return diff1 - diff2;
        })[0];
      };

      /**
       *
       * @param {Floor} floor
       */
      const onButtonPressed = (floor) => {
        if (
          elevators
            .map((e) => e.destinationQueue.slice(0, 2))
            .some((q) => q.includes(floor.floorNum()))
        ) {
          return;
        }
        // if (
        //   elevators
        //     .filter((e) => e.destinationQueue.length)
        //     .some((e) => e.destinationQueue[0] === floor.floorNum())
        // ) {
        //   return;
        // }

        const freeElevators = elevators.filter(
          (e) => e.destinationQueue.length === 0
        );
        if (freeElevators.length) {
          closestElevator(freeElevators, floor).goToFloor(floor.floorNum());
        } else {
          const leastBusy = elevators.sort(
            (e1, e2) => e1.destinationQueue.length - e2.destinationQueue.length
          )[0];
          const allLeastBusy = elevators.filter(
            (e) =>
              e.destinationQueue.length === leastBusy.destinationQueue.length
          );
          closestElevator(allLeastBusy, floor).goToFloor(floor.floorNum());
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
