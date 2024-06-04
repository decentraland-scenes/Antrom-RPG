import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { BONE_TRADER_DIALOGS } from './dialogsData'
import { setupNpcDialogUi } from './npcDialog'

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

  setupNpcDialogUi(BONE_TRADER_DIALOGS)
}
