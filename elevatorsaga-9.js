({
  init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {
      function addFloorToQue(elevator, floorNum) {
        if (
          !elevator.destinationQueue ||
          !elevator.destinationQueue.includes(floorNum)
        ) {
          elevator.goToFloor(floorNum);
        }
      }
      for (const floor of floors) {
        floor.on("up_button_pressed", () => {
          const randomElevator =
            elevators[Math.floor(Math.random() * elevators.length)];
          addFloorToQue(randomElevator, floor.floorNum());
        });
        floor.on("down_button_pressed", () => {
          const randomElevator =
            elevators[Math.floor(Math.random() * elevators.length)];
          addFloorToQue(randomElevator, floor.floorNum());
        });
      }

      for (const elevator of elevators) {
        elevator.on("floor_button_pressed", (floorNum) => {
          addFloorToQue(elevator, floorNum);
        });

        elevator.on("passing_floor", (floorNum, direction) => {
          const someoneWantsToGoUp =
            floors[floorNum].buttonStates.up === "activated";
          const someoneWantsToGoDown =
            floors[floorNum].buttonStates.down === "activated";
          const hasSpaceLeft = elevator.loadFactor() < 0.9;
          const someoneWantsToGetOffHere = elevator
            .getPressedFloors()
            .includes(floorNum);
          const goingUp = direction === "up";
          const goingDown = direction === "down";

          if (someoneWantsToGetOffHere) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
            elevator.destinationQueue.unshift(floorNum);
          }

          if (someoneWantsToGoUp && hasSpaceLeft && goingUp) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
            elevator.destinationQueue.unshift(floorNum);
          }

          if (someoneWantsToGoDown && hasSpaceLeft && goingDown) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
            elevator.destinationQueue.unshift(floorNum);
          }

          elevator.checkDestinationQueue();
        });

        elevator.on("stopped_at_floor", (floorNum) => {
          const allFloorsWithQueue = floors.filter((floor) => {
            return (
              floor.buttonStates.up === "activated" ||
              floor.buttonStates.down === "activated"
            );
          });

          elevator.destinationQueue = elevator.destinationQueue.filter(
            (destination) => {
              return (
                allFloorsWithQueue
                  .map((floor) => floor.floorNum())
                  .includes(destination) ||
                elevator.getPressedFloors().includes(destination)
              );
            }
          );

          elevator.checkDestinationQueue();
        });

        elevator.on("idle", () => {
          elevator.goToFloor(0);
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
