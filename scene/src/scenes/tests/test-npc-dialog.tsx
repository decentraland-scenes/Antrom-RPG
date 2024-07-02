import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { BONE_TRADER_DIALOGS } from '../../ui/npc-dialog/dialogsData'
import type { Dialog } from '../../ui/npc-dialog/dialogsData'

import NpcDialog from '../../ui/npc-dialog/npcDialog'

export class UI {
  public isLoading: boolean
  public isVisible: boolean
  public dialogIndex: number
  public assignedDialogs: Dialog[]

  constructor() {
    this.isLoading = true
    this.isVisible = true
    this.dialogIndex = 0
    this.assignedDialogs = []
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.DialogUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  goToDialog(dialogId: string): void {
    this.dialogIndex = this.assignedDialogs.findIndex(
      (dialog) => dialog.id === dialogId
    )
    console.log(dialogId)
  }

  assignDialog(dialogs: Dialog[]): void {
    this.assignedDialogs = dialogs
    this.dialogIndex = 0
  }

  nextMessage(): void {
    if (
      this.assignedDialogs[this.dialogIndex].isEndOfDialog !== true &&
      !this.assignedDialogs[this.dialogIndex].isQuestion
    ) {
      this.dialogIndex++
    } else if (this.assignedDialogs[this.dialogIndex].isEndOfDialog === true) {
      this.changeVisibility()
    }
  }

  DialogUI(): ReactEcs.JSX.Element {
    return (
      <NpcDialog
        isVisible={this.isVisible}
        nextMessage={this.nextMessage.bind(this)}
        goToDialog={this.goToDialog.bind(this)}
        dialogIndex={this.dialogIndex}
        assignedDialogs={this.assignedDialogs}
      />
    )
  }
}

export function main(): void {
  // all the initializing logic
  const gameUI = new UI()
  gameUI.assignDialog(BONE_TRADER_DIALOGS)
}
