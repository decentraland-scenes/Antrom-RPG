import * as utils from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import { Player } from '../player/player'
import Announcement from '../ui/announcement/announcement'
import Banner from '../ui/banner/bannerComponent'
import {
  BANNER_DURATION,
  BannerPosition,
  type BannerType
} from '../ui/banner/bannerConstants'
import { PlayDungeonUI } from '../ui/dungeon/playDungeon'
import { LoadingUI } from '../ui/loading/loading'
import { type GameController } from './game.controller'
import Canvas from '../ui/canvas/Canvas'

export class UIController {
  loadingUI: LoadingUI
  playDungeonUI: PlayDungeonUI
  // Banner
  gameController: GameController

  isBannerVisible: boolean = false
  bannerTimerId: utils.TimerId | undefined = undefined
  bannerType: BannerType | undefined
  bannerPosition: BannerPosition | undefined

  isAnnouncementVisible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  announcementTimerId: utils.TimerId | undefined = undefined

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingUI = new LoadingUI(this)
    this.playDungeonUI = new PlayDungeonUI(this)
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  }

  displayAnnouncement(
    announcement: string,
    color: Color4,
    duration: number
  ): void {
    if (this.announcementTimerId !== undefined) {
      utils.timers.clearInterval(this.announcementTimerId)
    }

    console.log(
      'OPEN ANNOUNCEMENT ',
      announcement,
      'COLOR ',
      color,
      'DURATION ',
      duration
    )
    this.announcement = announcement
    this.isAnnouncementVisible = true
    this.announcement_color = color

    this.announcementTimerId = utils.timers.setTimeout(() => {
      console.log('CLOSE ANNOUNCEMENT tiemout')
      this.isAnnouncementVisible = false
    }, duration)
  }

  displayBanner(bannerType: BannerType, bannerPosition?: BannerPosition): void {
    if (this.bannerTimerId !== undefined) {
      utils.timers.clearInterval(this.bannerTimerId)
    }

    this.bannerType = bannerType
    this.isBannerVisible = true
    if (bannerPosition !== undefined) {
      this.bannerPosition = bannerPosition
    }

    this.bannerTimerId = utils.timers.setTimeout(() => {
      this.isBannerVisible = false
    }, BANNER_DURATION * 1000)
  }

  ui(): ReactEcs.JSX.Element {
    return (
      <UiEntity>
        {/* Announcement Overlay */}
        {this.isAnnouncementVisible && (
          <Announcement
            text={this.announcement}
            color={this.announcement_color}
          />
        )}

        {/* Banner Overlay */}
        {this.bannerType !== undefined && this.isBannerVisible && (
          <Banner
            type={this.bannerType}
            position={this.bannerPosition ?? BannerPosition.BP_CENTER_TOP}
          />
        )}

        {/* Dungoen HUD and screens */}
        {this.playDungeonUI.isVisible && this.playDungeonUI.DungeonUI()}

        {/* Player HUD */}
        {Player.getInstance().PlayerUI()}

        {/* NP utils library UI */}
        <Canvas>{NpcUtilsUi()}</Canvas>

        {/* Loadin screen */}
        {this.loadingUI.visible() && this.loadingUI.mainUi()}
      </UiEntity>
    )
  }
}
