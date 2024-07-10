import { engine } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import BottomBar from '../../ui/bottom-bar/bottomBar'

export class UI {
  public isVisible: boolean = true
  public currentHpPercent: number
  public currentXp: number
  public levelXp: number
  public level: number
  public cooldownTimeOne: number = 0
  public isCoolingOne: boolean = false
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
    if (!this.isCoolingOne) {
      this.slotOneSkillCooldown = time
      console.log(time)
      this.cooldownTimeOne = time
      this.isCoolingOne = true
      engine.addSystem(
        this.cooldownSystemSlotOne.bind(this),
        1,
        'slotOneSystem'
      )
    }
  }

  cooldownSystemSlotOne(dt: number): void {
    if (this.cooldownTimeOne - dt >= 0 && this.isCoolingOne) {
      this.cooldownTimeOne = this.cooldownTimeOne - dt
    } else {
      this.isCoolingOne = false
      engine.removeSystem('slotOneSystem')
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
        cooldownTimeOne={this.cooldownTimeOne}
        isCoolingOne={this.isCoolingOne}
      />
    )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
