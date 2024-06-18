import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { LoadingUI } from '../uis/loading'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import Announcement from '../uis/Announcement'
import { Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { type GameController } from './game.controller'

export class UIController {
  loadingUI: LoadingUI
  announcement_visible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingUI = new LoadingUI(this)
    const uiComponent = () => [
      this.loadingUI.mainUi(),
      NpcUtilsUi(),
      this.announcementUI()
    ]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  announcementUI() {
    return (
      <Announcement
        visible={this.announcement_visible}
        text={this.announcement}
        color={this.announcement_color}
      />
    )
  }

  displayAnnouncement(announcement: string, color: Color4, duration: number) {
    utils.timers.clearInterval(duration)
    console.log('OPEN ANNOUNCEMENT')
    this.announcement = announcement
    this.announcement_visible = true
    this.announcement_color = color
    utils.timers.setTimeout(() => {
      this.announcement_visible = false
    }, duration)
  }
}
