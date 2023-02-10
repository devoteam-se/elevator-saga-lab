({
  init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {
      function almostOnFloor() {}

      function addFloorToQue(elevator, floorNum) {
        console.log(elevator.destinationQueue);
        if (
          !elevator.destinationQueue ||
          !elevator.destinationQueue.includes(floorNum)
        ) {
          elevator.goToFloor(floorNum);
        }
      }
      for (const floor of floors) {
        floor.on("up_button_pressed", () => {
          if (elevators[0].loadFactor() < 1) {
            addFloorToQue(elevators[0], floor.floorNum());
          } else {
            addFloorToQue(elevators[1], floor.floorNum());
          }
        });
        floor.on("down_button_pressed", () => {
          if (elevators[2].loadFactor() < 1) {
            addFloorToQue(elevators[2], floor.floorNum());
          } else {
            addFloorToQue(elevators[3], floor.floorNum());
          }
        });
      }

      for (const elevator of elevators) {
        elevator.on("floor_button_pressed", (floorNum) => {
          // elevator.goToFloor(floorNum);
          addFloorToQue(elevator, floorNum);
          console.log(elevator.destinationQueue);
        });

        elevator.on("passing_floor", (floorNum, direction) => {
          if (elevator.getPressedFloors().includes(floorNum)) {
            elevator.destinationQueue = elevator.destinationQueue.filter(
              (destination) => destination != floorNum
            );
            elevator.destinationQueue.unshift(floorNum);
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

          elevator.checkDestinationQueue();
        });
        // if in pressed floors
        // -> stop = move to top of queie
        // if floor.up
        // -> if full -> do not stop
        // -> if not full && direction -> stop = move to top of queie

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
