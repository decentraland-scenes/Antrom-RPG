import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import QuestLog from '../../ui/quest-log/questLog'
import { QUEST_STAGES } from '../../ui/quest-log/questsData'
import { engine } from '@dcl/sdk/ecs'

const TIME_SHOW_PROGRESS: number = 5

export class UI {
  public timer: number
  public isInfo: boolean
  public isVisible: boolean
  public selectedStage: string
  public stageDescription: string
  public stageNeeded: number
  public stageProgress: number
  public progress: string
  public isProgressVisible: boolean

  constructor() {
    this.timer = TIME_SHOW_PROGRESS
    this.isInfo = false
    this.isVisible = false
    this.selectedStage = ''
    this.stageDescription = ''
    this.stageNeeded = 0
    this.stageProgress = 0
    this.progress = ''
    this.isProgressVisible = false
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.QuestLogUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  changeVisibility(): void {
    this.isVisible = !this.isVisible
  }

  setStage(id: string): void {
    const stage = QUEST_STAGES.filter((stage) => stage.id === id)[0]
    this.stageDescription = stage.info
    this.stageNeeded = stage.need
    this.stageProgress = stage.progress
    this.selectedStage = stage.id
    this.progress = stage.progress.toString() + '/' + stage.need.toString()
    this.isProgressVisible = false
  }

  openQuestLog(): void {
    this.setStage('quest')
    this.isVisible = true
  }

  showingProgressSystem(dt: number): void {
    console.log('The system is still active')
    if (this.isProgressVisible) {
      if (this.timer - dt <= 0) {
        this.isProgressVisible = false
      } else {
        this.timer = this.timer - dt
        console.log(this.timer)
      }
    } else {
      this.hideProgress()
    }
  }

  showProgress(): void {
    this.timer = TIME_SHOW_PROGRESS
    this.isProgressVisible = true
    engine.addSystem(this.showingProgressSystem.bind(this))
  }

  hideProgress(): void {
    engine.removeSystem(this.showingProgressSystem.bind(this))
  }

  QuestLogUI(): ReactEcs.JSX.Element {
    return (
      <QuestLog
        isInfo={this.isInfo}
        isVisible={this.isVisible}
        selectedStage={this.selectedStage}
        stageDescription={this.stageDescription}
        stageNeeded={this.stageNeeded}
        stageProgress={this.stageProgress}
        progress={this.progress}
        isProgressVisible={this.isProgressVisible}
        setStage={this.setStage.bind(this)}
        openQuestLog={this.openQuestLog.bind(this)}
        showProgress={this.showProgress.bind(this)}
        changeVisibility={this.changeVisibility.bind(this)}
      />
    )
  }
}

export function main(): void {
  // all the initializing logic
  const gameUI = new UI()
  gameUI.QuestLogUI()
}
