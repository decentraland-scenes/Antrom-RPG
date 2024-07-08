import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import BottomBar from '../../ui/bottom-bar/bottomBar'
import * as utils from '@dcl-sdk/utils'
import { engine } from '@dcl/sdk/ecs'

export class UI {
  public isVisible: boolean = true
  public currentHpPercent: number
  public currentXp: number
  public levelXp: number
  public level: number
  public cooldownTimeOne: number = 0
  public progressOne: number = 0
  public slotOneSkillCooldown: number = 0

  constructor() {
    this.currentHpPercent = 75.6
    this.currentXp = 250
    this.levelXp = 1000
    this.level = 1

    const uiComponent = (): ReactEcs.JSX.Element[] => [this.bottomBarUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  showCooldownSlotOne(time: number): void {
    this.slotOneSkillCooldown = time
    if (this.progressOne <= 0) {
      console.log(time)
      this.cooldownTimeOne = time
      engine.addSystem(
        this.cooldownSystemSlotOne.bind(this),
        1,
        'slotOneSystem'
      )

      utils.timers.setTimeout(() => {
        this.progressOne = 0
        engine.removeSystem('slotOneSystem')
      }, time * 1000)
    }
  }

  cooldownSystemSlotOne(dt: number): void {
    if (this.cooldownTimeOne - dt >= 0) {
      console.log('system is loaded')
      this.cooldownTimeOne = this.cooldownTimeOne - dt
      this.progressOne =
        (this.cooldownTimeOne / this.slotOneSkillCooldown) * 100
    }
  }

  bottomBarUI(): ReactEcs.JSX.Element {
    return (
      <BottomBar
        isVisible={this.isVisible}
        currentHpPercent={this.currentHpPercent}
        levelXp={this.levelXp}
        currentXp={this.currentXp}
        level={this.level}
        onClickSlotOne={this.showCooldownSlotOne.bind(this)}
        progressOne={this.progressOne}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
