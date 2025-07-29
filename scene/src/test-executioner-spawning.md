# Executioner Spawning System Implementation

## Overview

This implementation provides a new executioner spawning system with the following requirements:

1. **Initial Delay**: No executioners spawn for the first 5 minutes
2. **Spawn Cycles**: After 5 minutes, executioners spawn every 3 minutes for 45 seconds
3. **Countdown Timer**: A 60-minute countdown timer is displayed in the UI

## Implementation Details

### GargoyleFountain.ts

- Modified to use the new spawning system
- Removed old continuous spawning logic
- Added spawn cycle management with 5-minute initial delay
- Integrated with CountdownTimerManager for game time tracking

### CountdownTimerManager.ts

- Singleton class that manages the 60-minute game timer
- Provides current time state to UI components
- Handles timer visibility and game over conditions

### CountdownTimer.tsx

- React component for displaying the countdown timer
- Shows minutes:seconds format
- Positioned at top-center of screen with semi-transparent background

### MainHudComponent.tsx

- Integrated CountdownTimer component
- Uses CountdownTimerManager to get current time state

## System Behavior

### Timeline:

1. **0:00 - 5:00**: No executioners spawn, countdown shows 60:00 to 55:00
2. **5:00**: First spawn cycle begins (45 seconds of spawning)
3. **5:45**: Spawn window ends, 2:15 wait until next cycle
4. **8:00**: Second spawn cycle begins
5. **...**: Continues every 3 minutes until 60 minutes elapsed
6. **60:00**: Game ends, timer disappears

### Spawn Details:

- 3 executioners spawn every 5 seconds during the 45-second window
- Total of ~27 executioners per spawn cycle
- Spawn points are predefined around the gargoyle fountain

### UI Features:

- Countdown timer shows remaining game time
- Timer positioned at top-center of screen
- Semi-transparent black background with yellow "GAME TIME" label
- White time display in MM:SS format

## Technical Notes

- Uses `utils.timers.setTimeout` and `utils.timers.setInterval` for timing
- Singleton pattern for CountdownTimerManager ensures single timer instance
- Game over triggered when timer reaches 00:00
- All timers properly cleaned up when game ends
