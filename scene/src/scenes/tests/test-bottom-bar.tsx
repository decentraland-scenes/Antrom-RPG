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
  public progressOne: number = 0
  public oneIsCooling: boolean = false
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
    if (!this.oneIsCooling) {
      this.slotOneSkillCooldown = time
      console.log(time)
      this.cooldownTimeOne = time
      this.oneIsCooling = true
      engine.addSystem(
        this.cooldownSystemSlotOne.bind(this),
        1,
        'slotOneSystem'
      )
    }
  }

  cooldownSystemSlotOne(dt: number): void {
    if (this.cooldownTimeOne - dt >= 0 && this.oneIsCooling) {
      this.cooldownTimeOne = this.cooldownTimeOne - dt
      this.progressOne =
        (this.cooldownTimeOne / this.slotOneSkillCooldown) * 100
    } else {
      this.oneIsCooling = false
      this.progressOne = 0
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
