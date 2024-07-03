import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { LoadingUI } from '../ui/loading/loading'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import Announcement from '../uis/Announcement'
import { Color4 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { type GameController } from './game.controller'
import { PlayDungeonUI } from '../ui/dungeon/playDungeon'
import { Player } from '../player/player'
import Banner from '../ui/banner/bannerComponent'
import { BANNER_DURATION, BannerPosition, type BannerType } from '../ui/banner/bannerConstants'

export class UIController {
  loadingUI: LoadingUI
  playDungeonUI: PlayDungeonUI
  isAnnouncementVisible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  // Banner
  isBannerVisible: boolean = false
  bannerType: BannerType | undefined
  bannerPosition: BannerPosition | undefined
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingUI = new LoadingUI(this)
    this.playDungeonUI = new PlayDungeonUI(this)
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const uiComponent = () => [
      Player.getInstance().PlayerUI(),
      this.loadingUI.mainUi(),
      NpcUtilsUi(),
      this.announcementUI(),
      this.playDungeonUI.DungeonUI()
    ]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  announcementUI() {
    return (
      <Announcement
        visible={this.isAnnouncementVisible}
        text={this.announcement}
        color={this.announcement_color}
      />
    )
  }

  
  displayAnnouncement(
    announcement: string,
    color: Color4,
    duration: number
  ): void {
    utils.timers.clearInterval(duration)
    console.log('OPEN ANNOUNCEMENT')
    this.announcement = announcement
    this.isAnnouncementVisible = true
    this.announcement_color = color
    utils.timers.setTimeout(() => {
      this.isAnnouncementVisible = false
    }, duration)
  }

  bannerUI(): ReactEcs.JSX.Element | null {
    let bannerPosition
    if (this.bannerType === undefined) {
      return null
    }
    if (this.bannerPosition === undefined) {
      bannerPosition = BannerPosition.BP_CENTER_TOP
    } else {
      bannerPosition = this.bannerPosition
    }
    return (
      <Banner
        isVisible={this.isBannerVisible}
        type={this.bannerType}
        position={bannerPosition}
      />
    )
  }

  displayBanner(
    bannerType: BannerType,
    bannerPosition?: BannerPosition
  ): void {
    utils.timers.clearInterval(BANNER_DURATION)
    console.log('OPEN BANNER')
    this.bannerType = bannerType
    this.isBannerVisible = true
    if (bannerPosition !== undefined) {
      this.bannerPosition = bannerPosition
    }
    utils.timers.setTimeout(() => {
      this.isBannerVisible = false
    }, BANNER_DURATION)
  }



}
