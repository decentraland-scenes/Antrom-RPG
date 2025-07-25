import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

interface ScreenFlashProps {
  isVisible: boolean
  intensity: number
  duration: number
}

export function ScreenFlash({ isVisible, intensity, duration }: ScreenFlashProps) {
  console.log('ScreenFlash: Rendering with isVisible:', isVisible, 'intensity:', intensity)
  if (!isVisible) return null

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: '100%',
        height: '100%',
        position: { top: 0, left: 0 },
        alignSelf: 'stretch'
      }}
      uiBackground={{
        color: Color4.create(1, 0, 0, intensity)
      }}
    />
  )
}

// Screen flash manager class
export class ScreenFlashManager {
  private static instance: ScreenFlashManager
  private isVisible: boolean = false
  private intensity: number = 0
  private duration: number = 0
  private timer: number = 0

  static getInstance(): ScreenFlashManager {
    if (!ScreenFlashManager.instance) {
      ScreenFlashManager.instance = new ScreenFlashManager()
    }
    return ScreenFlashManager.instance
  }

  flash(intensity: number = 0.3, duration: number = 200): void {
    console.log('ScreenFlashManager: Flash triggered with intensity:', intensity, 'duration:', duration)
    this.isVisible = true
    this.intensity = intensity
    this.duration = duration
    this.timer = duration

    // Auto-hide after duration
    utils.timers.setTimeout(() => {
      // console.log('ScreenFlashManager: Hiding flash')
      this.isVisible = false
    }, duration)
  }

  // Test method to show a flash immediately
  testFlash(): void {
    console.log('ScreenFlashManager: Test flash triggered')
    this.isVisible = true
    this.intensity = 1.0
    this.duration = 3000
    this.timer = 3000

    // Auto-hide after 3 seconds
    utils.timers.setTimeout(() => {
      console.log('ScreenFlashManager: Test flash hiding')
      this.isVisible = false
    }, 3000)
  }

  // Debug method to check current state
  debugState(): void {
    console.log('ScreenFlashManager debug state:', {
      isVisible: this.isVisible,
      intensity: this.intensity,
      duration: this.duration
    })
  }

  getFlashProps(): { isVisible: boolean; intensity: number; duration: number } {
    return {
      isVisible: this.isVisible,
      intensity: this.intensity,
      duration: this.duration
    }
  }
} 