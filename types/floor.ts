interface Floor {
    /**
     * Gets the floor number of the floor object.
     */
    floorNum(): number

    /**
     * Indicates if someone is waiting to go up or down on this floor.
     */
    buttonStates: { up: 'activated' | '', down: 'activated' | '' }

    /**
     * The number of the floor
     */
    level: number

    /**
     * Triggered when someone has pressed the up or down button at a floor. Note that
     * passengers will press the button again if they fail to enter an elevator
     */
    on(event: 'up_button_pressed' | 'down_button_pressed', callback: () => void): void
}
