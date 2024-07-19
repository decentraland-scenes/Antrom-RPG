// import { PointerEventType, engine, inputSystem } from '@dcl/sdk/ecs';
import type ReactEcs from '@dcl/sdk/react-ecs'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'

export class UI {
  public isVisible: boolean = true
  public currentHpPercent: number
  public currentXp: number
  public levelXp: number
  public level: number
  // public slotsData: SkillSlotData[] | undefined
  public withOutSystemLoaded: boolean = false

  constructor() {
    this.currentHpPercent = 75.6
    this.currentXp = 250
    this.levelXp = 1000
    this.level = 1
    // this.slotsData = slotsDataToTest

    ReactEcsRenderer.setUiRenderer(() => [this.bottomBarUI()])
  }

  showCooldownSlot(index: number): void {
    // if (this.slotsData !== undefined) {
    //   if (this.slotsData[index] !== undefined) {
    // const slot = this.slotsData[index]
    // if (!slot.isCooling && slot.skill !== undefined) {
    //   slot.cooldownTime = slot.skill.cooldown
    //   if (!this.slotsData.some((slot) => slot.isCooling)) {
    //     engine.addSystem(
    //       this.cooldownSystemSlot.bind(this),
    //       1,
    //       'skillsCoolingSystem'
    //     )
    //   }
    //   slot.isCooling = true
    // }
    //   }
    // }
  }

  cooldownSystemSlot(dt: number): void {
    // if (this.slotsData !== undefined) {
    //   if (this.slotsData.every((slot) => !slot.isCooling)) {
    //     engine.removeSystem('skillsCoolingSystem')
    //     console.log('system removed')
    //   }
    //   this.slotsData.forEach((slot) => {
    //     if (slot.cooldownTime - dt >= 0 && slot.isCooling) {
    //       slot.cooldownTime = slot.cooldownTime - dt
    //     } else {
    //       if (slot.skill !== undefined) {
    //         slot.isCooling = false
    //       }
    //     }
    //   })
    // }
  }

  addInputEvents(): void {
    // inputKeysArray.forEach((inputKey: slotsInputs, index: number) => {
    //   engine.addSystem(() => {
    //     if (inputSystem.isTriggered(inputKey, PointerEventType.PET_DOWN)) {
    //       this.showCooldownSlot(index)
    //     }
    //   })
    // })
  }

  bottomBarUI(): ReactEcs.JSX.Element | null {
    return null
    // return (
    //   <BottomBar
    //     currentHpPercent={this.currentHpPercent}
    //     levelXp={this.levelXp}
    //     currentXp={this.currentXp}
    //     level={this.level}
    //     slotsData={this.slotsData}
    //     onClickSlot={this.showCooldownSlot.bind(this)}
    //   />
    // )
  }
}

export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
  gameUi.addInputEvents()
}
