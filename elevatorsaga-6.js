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
          for (const elevator of elevators) {
            addFloorToQue(elevator, floor.floorNum());
          }
        });
        floor.on("down_button_pressed", () => {
          for (const elevator of elevators) {
            addFloorToQue(elevator, floor.floorNum());
          }
        });
      }

      for (const elevator of elevators) {
        elevator.on("floor_button_pressed", (floorNum) => {
          // elevator.goToFloor(floorNum);
          addFloorToQue(elevator, floorNum);
        });

        elevator.on("passing_floor", (floorNum, direction) => {
          const nitherFloorButtonPressed =
            floors[floorNum].buttonStates.up === "" &&
            floors[floorNum].buttonStates.down === "";
          const shouldNotDropSomeoneOff = !elevator
            .getPressedFloors()
            .includes(floorNum);

          if (nitherFloorButtonPressed && shouldNotDropSomeoneOff) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
          }

          if (floors[floorNum].buttonStates.up === "activated") {
            if (!(elevator.loadFactor() < 1) && direction === "up") {
              elevator.destinationQueue = elevator.destinationQueue.filter(
                (destination) => destination != floorNum
              );
              elevator.destinationQueue.unshift(floorNum);
            }
          }

          if (floors[floorNum].buttonStates.down === "activated") {
            if (!(elevator.loadFactor() < 1) && direction === "down") {
              elevator.destinationQueue = elevator.destinationQueue.filter(
                (destination) => destination != floorNum
              );
              elevator.destinationQueue.unshift(floorNum);
            }
          }

          if (elevator.getPressedFloors().includes(floorNum)) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
            elevator.destinationQueue.unshift(floorNum);
          }

          elevator.checkDestinationQueue();
        });

        elevator.on("idle", () => {
          console.log("idle");
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
