import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/Canvas'
import Loading from './loadingComponent'
import { getWearables, getWearablesEffects, applyWearableStatsEffect } from '../../player/wearables'
import { Player } from '../../player/player'
import { GeneralDisruptiveBlow } from '../../player/skills/definitions'
import { GeneralFirstAidKit } from '../../player/skills/definitions'
import { GeneralFireball } from '../../player/skills/definitions'
import { GeneralStorm } from '../../player/skills/definitions'
import { GeneralLuckyCharm } from '../../player/skills/definitions'
import { CLASS_MAIN_SKILL } from '../../player/skills/classes-main-skill'

export class LoadingUI {
  private isLoading: boolean
  private isVisible: boolean
  public timer: number = 2

  private readonly uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isLoading = true
    this.isVisible = true
  }

  startLoading(): void {
    this.isLoading = true
  }

  finishLoading(): void {
    this.isLoading = false
  }

  setVisibility(visible: boolean): void {
    this.isVisible = visible
  }

  visible(): boolean {
    return this.isVisible
  }

  mainUi(): ReactEcs.JSX.Element {
    return (
      <Canvas>
        <Loading
          isLoading={this.isLoading}
          isVisible={this.isVisible}
          changeVisibility={() => {
            this.isVisible = false
            // Apply wearable stats when play button is clicked
            const player = Player.getInstance()
            if (player) {
              const wearables = getWearables()
              const rawStats = getWearablesEffects(wearables)
              const curatedStats = {
                luckBuff: rawStats.luckBuff ?? 0,
                attackBuff: rawStats.attackBuff ?? 0,
                defBuff: rawStats.defBuff ?? 0,
                health: rawStats.health ?? 0,
                distance: rawStats.distance ?? 0,
                critRate: rawStats.critRate ?? 0,
                critDamage: rawStats.critDamage ?? 0,
                magicBuff: rawStats.magicBuff ?? 0
              }
              // Reset health to max before applying new stats
              player.health = player.maxHealth
              applyWearableStatsEffect({}, curatedStats)
              // Update health bar after applying stats
              player.updateHealthBar()

              // Initialize player skills
              player.setSkill(0, CLASS_MAIN_SKILL[player.class]())
              player.setSkill(1, new GeneralDisruptiveBlow())
              player.setSkill(2, new GeneralFirstAidKit())
              player.setSkill(3, new GeneralFireball())
              player.setSkill(4, new GeneralStorm())
              player.setSkill(5, new GeneralLuckyCharm())
            }
          }}
        />
      </Canvas>
    )
  }
}
