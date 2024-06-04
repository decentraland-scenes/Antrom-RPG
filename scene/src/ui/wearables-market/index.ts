import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { setupWearableMarket } from './wearablesMarket'
// import { APPRENTICE_WEARABLES } from './wearablesData'

export const canvasInfo = {
  width: 0,
  height: 0
}

export function main(): void {
  engine.addSystem((deltaTime) => {
    const uiCanvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

    if (uiCanvasInfo === null) return

    canvasInfo.width = uiCanvasInfo.width
    canvasInfo.height = uiCanvasInfo.height
  })

  // draw UI
  // setupWearableMarket(Object.values(APPRENTICE_WEARABLES))
  setupWearableMarket()
}
