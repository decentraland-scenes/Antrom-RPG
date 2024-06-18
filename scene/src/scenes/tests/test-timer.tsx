import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Timer from '../../ui/timer/timer'
import { engine } from '@dcl/sdk/ecs'

// This INITIAL_TIME must be saved when quest or event starts
const INITIAL_TIME = new Date()

export class UI {
  public seconds: string
  public minutes: string
  public hours: string | undefined

  constructor() {
    this.seconds = ''
    this.minutes = ''
    const uiComponent = (): ReactEcs.JSX.Element => [this.TimerUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  timerSystem(dt: number): void {
    const now = new Date()
    const difference = -(INITIAL_TIME.getTime() - now.getTime())
    const formatNumber = (num: number): string => num.toString().padStart(2, '0')

    this.seconds = formatNumber(Math.floor((difference / 1000) % 60))
    this.minutes = formatNumber(Math.floor((difference / (1000 * 60)) % 60))
    if (Math.floor(difference / (1000 * 60 * 60)) > 0) {
      this.hours = formatNumber(Math.floor(difference / (1000 * 60 * 60)))
    }
  }

  startTimer(): void {
    engine.addSystem(this.timerSystem.bind(this))
  }

  TimerUI(): ReactEcs.JSX.Element {
    return (
      <Timer hours={this.hours} minutes={this.minutes} seconds={this.seconds}/>
    )
  }
}

export function main(): void {
  // all the initializing logic
  const gameUI = new UI()
  gameUI.TimerUI()
  gameUI.startTimer()
}