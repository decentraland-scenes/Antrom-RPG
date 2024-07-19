import * as utils from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import * as ui from 'dcl-ui-toolkit'
import { Player } from '../player/player'
import Announcement from '../ui/announcement/announcement'
import Banner from '../ui/banner/bannerComponent'
import {
  BANNER_DURATION,
  BannerPosition,
  type BannerType
} from '../ui/banner/bannerConstants'
import Canvas from '../ui/canvas/Canvas'
import { PlayDungeonUI } from '../ui/dungeon/playDungeon'
import { LoadingUI } from '../ui/loading/loading'
import { CreationPlayerController } from './creation-player.controller'
import { type GameController } from './game.controller'
import { MainHudController } from './main-hud'

export class UIController {
  loadingUI: LoadingUI
  playDungeonUI: PlayDungeonUI
  // Banner
  gameController: GameController

  bannerIdCounter: number = 0
  banners = new Map<
    number,
    {
      timerId: utils.TimerId
      bannerType: BannerType
      bannerPosition: BannerPosition
    }
  >()

  isAnnouncementVisible: boolean = false
  announcement: string = ''
  announcement_color: Color4 = Color4.White()
  announcementTimerId: utils.TimerId | undefined = undefined

  creationPlayerUi: CreationPlayerController | null = null
  mainHud: MainHudController | null = null

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingUI = new LoadingUI(this)
    this.playDungeonUI = new PlayDungeonUI(this)
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  }

  showMainHud(): void {
    this.mainHud = new MainHudController()
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
    const id = this.bannerIdCounter
    this.bannerIdCounter++

    this.banners.set(id, {
      timerId: utils.timers.setTimeout(() => {
        this.banners.delete(id)
      }, BANNER_DURATION * 1000),
      bannerType,
      bannerPosition: bannerPosition ?? BannerPosition.BP_CENTER_TOP
    })
  }

  /**
   * Start the player creation process and wait until it's done
   * @returns true if
   */
  async startPlayerCreation(): Promise<{
    created: boolean
    tutorial: boolean
  }> {
    this.creationPlayerUi = new CreationPlayerController()
    await this.creationPlayerUi.ready()
    const tutorial = this.creationPlayerUi.isTutorialActive()

    // cleanup
    this.creationPlayerUi = null

    return { created: true, tutorial }
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
        {Array.from(this.banners.values()).map((item) => (
          <Banner type={item.bannerType} position={item.bannerPosition} />
        ))}

        {/* Dungoen HUD and screens */}
        {this.playDungeonUI.isVisible && this.playDungeonUI.DungeonUI()}

        {/* Player HUD */}
        {Player.getInstanceOrNull()?.PlayerUI()}

        {/* Main HUD */}
        {this.mainHud?.render()}

        {/* Creation Player step if it applies */}
        {this.creationPlayerUi?.render()}

        {/* NPC utils library UI */}
        <Canvas>{NpcUtilsUi()}</Canvas>

        {/* ui utils library */}
        <Canvas>{ui.render()}</Canvas>

        {/* Loadin screen */}
        {this.loadingUI.visible() && this.loadingUI.mainUi()}
      </UiEntity>
    )
  }
}
