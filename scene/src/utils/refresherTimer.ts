import { engine } from '@dcl/sdk/ecs'

export let dailyRewardsShown = false
export const showDailyRewards = (): void => {
  dailyRewardsShown = true
}
export const hideDailyRewards = (): void => {
  dailyRewardsShown = false
}

export let refreshtimer: number = 0
export function setRefreshTimer(num: number): void {
  refreshtimer = num
}
export let questTimerText: string

class KingQuest {
  public questOff: boolean
  questComplete: boolean
  timer: number
  constructor() {
    this.questOff = true
    this.questComplete = false
    this.timer = 0
  }

  turnOnKingQuestTimer(): void {
    this.questOff = false
  }

  removeKingQuestTimer(): void {
    if (questTimerText != null) questTimerText = ''
  }

  turnOffKingQuestTimer(): void {
    this.questOff = true
  }

  format = (secs: number): string => {
    const secNum = Math.floor(secs) // Convert seconds to an integer
    const hours = Math.floor(secNum / 3600)
    const minutes = Math.floor(secNum / 60) % 60
    const seconds = secNum % 60 // Keep seconds as an integer

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':')
  }
}
export const quest = new KingQuest()

export const createQuestTimerText = (): string => {
  if (questTimerText != null) {
    return questTimerText
  }
  // questTimerText = new UIText(canvas)
  // questTimerText.value = ""
  // questTimerText.hAlign = "left"
  // questTimerText.vAlign = "top"
  // questTimerText.positionY = -120
  // questTimerText.positionX = 20
  // questTimerText.fontSize = 25
  // questTimerText.color = Color4.Yellow()
  return questTimerText
}

export class LoopSystem {
  private _rewardsTimer: number = 0
  private readonly _rewardsTimer24H: number = 0
  private _kingQuestTimer: number = 0
  private _questTimerIterations: number = 0

  System = (dt: number): void => {
    if (refreshtimer > 0) {
      refreshtimer -= dt
    }
    void this.rewardsTimer(dt)
    this.kingQuestTimer(dt)
    // console.log(refreshtimer)
  }

  kingQuestTimer = (dt: number): void => {
    if (quest.questOff || quest.questComplete) return // Stop updating if quest is off or completed

    this._questTimerIterations++
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const total = (this._kingQuestTimer += dt)

    if (this._questTimerIterations === 5) {
      // questTimerText.value = quest.format(total)
      this._questTimerIterations = 0
    }
  }

  async rewardsTimer(dt: number): Promise<void> {
    this._rewardsTimer += dt
    if (dailyRewardsShown != null) {
      // TODO Canvas and UIs
      // setMenuDailyRewardTimerText(
      //     formatSeconds(Math.round(900 - this._rewardsTimer))
      // )
    } else {
      // setMenuDailyRewardTimerText("")
    }
    if (Math.round(this._rewardsTimer) >= 900) {
      // const isWearingWearableCoinCouture = await isUserWearingWearable(
      //     "urn:decentraland:matic:collections-v2:0x8f69e4a278e3451b8a93b52cca27b25798658fc0:0"
      // )
      // const isWearingWearableAura = await isUserWearingWearable(
      //     "urn:decentraland:matic:collections-v2:0x844a933934fba88434dfade0b04b1d211e92d7c4:0"
      // )
      // if (isWearingWearableCoinCouture) {
      //     player.inventory.incrementItem(ITEM_TYPES.COIN, 5)
      //     player.writeDataToServer()
      // }
      // if (isWearingWearableAura) {
      //     player.inventory.incrementItem(ITEM_TYPES.COIN, 3)
      //     player.writeDataToServer()
      // }
      this._rewardsTimer = 0
    }
  }

  resetQuestTimer(): void {
    this._kingQuestTimer = 0
    this._questTimerIterations = 0
  }
}
const loopSystem = new LoopSystem()
engine.addSystem(loopSystem.System)
