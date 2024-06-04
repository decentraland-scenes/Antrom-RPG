import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { setupTimer } from './timer'

export const canvasInfo = {
  width: 0,
  height: 0
}

export function main():void {
  engine.addSystem((deltaTime) => {
    const uiCanvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

    if (uiCanvasInfo === null) return

    canvasInfo.width = uiCanvasInfo.width
    canvasInfo.height = uiCanvasInfo.height
  })

  // draw UI

  setupTimer()
}
