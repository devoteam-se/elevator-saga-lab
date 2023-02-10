({
  init:
    /**
     * @param {Elevator[]} elevators - the elevators
     * @param {Floor[]} floors - the floors
     */
    function init(elevators, floors) {
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
          // elevators[0].goToFloor(floor.floorNum());
          addFloorToQue(elevators[0], floor.floorNum());

          // console.log(elevator.destinationQueue);
        });
        floor.on("down_button_pressed", () => {
          addFloorToQue(elevators[0], floor.floorNum());
          // console.log(elevator.destinationQueue);
        });
      }

      for (const elevator of elevators) {
        elevator.on("floor_button_pressed", (floorNum) => {
          // elevator.goToFloor(floorNum);
          addFloorToQue(elevator, floorNum);
          console.log(elevator.destinationQueue);
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
