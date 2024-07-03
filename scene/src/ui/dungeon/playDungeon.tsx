import { engine } from '@dcl/sdk/ecs'
import type { SelectOptionProps } from './dungeonComponent'
import { DUNGEONS, DUNGEONS_TO_SHOW, DIFFICULTIES } from './dungeonsData'
import Dungeon from './dungeonComponent'
import ReactEcs from '@dcl/sdk/react-ecs'
import type { UIController } from '../../controllers/ui.controller'

export class PlayDungeonUI {
  public isLoading: boolean
  public isOpen: boolean
  public isInfo: boolean
  public isVisible: boolean
  public scrollPosition: number
  public dungeon: string
  public difficulty: string
  public isPlayable: boolean
  public timer: number
  private readonly uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isLoading = false
    this.isInfo = false
    this.isVisible = false
    this.isOpen = false
    this.scrollPosition = 0
    this.dungeon = ''
    this.difficulty = ''
    this.isPlayable = false
    this.timer = 2
  }

  setVisibility(visibility: boolean): void {
    this.isVisible = visibility
  }

  setOpen(open: boolean): void {
    this.isOpen = open
  }

  scrollRight(): void {
    if (this.scrollPosition < DUNGEONS.length - DUNGEONS_TO_SHOW) {
      this.scrollPosition++
    }
  }

  scrollLeft(): void {
    if (this.scrollPosition > 0) {
      this.scrollPosition--
    }
  }

  getLoadingImage(): string {
    if (this.dungeon === 'dungeon2') {
      return 'assets/images/Loading_The_Cave.png'
    }
    return 'assets/images/Loading_The_Dungeon.png'
  }

  selectOption({ id, array }: SelectOptionProps): void {
    let isDungeon: boolean = false
    let isDifficulty: boolean = false
    if (array === DUNGEONS) {
      isDungeon = true
    } else if (array === DIFFICULTIES) {
      isDifficulty = true
    }

    const selectedOption = array.filter((option) => option.id === id)[0]
    if (selectedOption.available) {
      if (selectedOption.selected) {
        selectedOption.selected = false
        if (isDungeon) {
          this.dungeon = ''
        } else if (isDifficulty) {
          this.difficulty = ''
        }
        this.isPlayable = false
      } else {
        for (const option of array) {
          option.selected = false
        }
        selectedOption.selected = true
        if (isDungeon) {
          this.dungeon = selectedOption.id
          this.getLoadingImage()
        } else if (isDifficulty) {
          this.difficulty = selectedOption.id
        }
        if (this.difficulty !== '' && this.dungeon !== '') {
          this.isPlayable = true
        }
      }
    }
  }

  changeInfo(): void {
    this.isInfo = !this.isInfo
  }

  playDungeon(): void {
    this.timer = 2
    engine.addSystem(this.loadingDungeonSystem.bind(this))
    this.isLoading = true
  }

  loadingDungeonSystem(dt: number): void {
    if (this.timer - dt <= 0 && this.isLoading) {
      this.isLoading = false
      engine.removeSystem(this.loadingDungeonSystem)
      this.setOpen(false)
    } else {
      this.timer = this.timer - dt
    }
  }

  openDungeonSelection(): void {
    this.setOpen(true)
    for (const dungeon of DUNGEONS) {
      dungeon.selected = false
    }
    for (const difficulty of DIFFICULTIES) {
      difficulty.selected = false
    }
    this.isLoading = false
    this.isInfo = false
    this.isVisible = true
    this.scrollPosition = 0
    this.dungeon = ''
    this.difficulty = ''
    this.isPlayable = false
  }

  DungeonUI(): ReactEcs.JSX.Element {
    return (
      <Dungeon
        isLoading={this.isLoading}
        isOpen={this.isOpen}
        isInfo={this.isInfo}
        isVisible={this.isVisible}
        scrollPosition={this.scrollPosition}
        isPlayable={this.isPlayable}
        setOpen={this.setOpen.bind(this)}
        scrollRight={this.scrollRight.bind(this)}
        scrollLeft={this.scrollLeft.bind(this)}
        selectOption={this.selectOption.bind(this)}
        changeInfo={this.changeInfo.bind(this)}
        getLoadingImage={this.getLoadingImage.bind(this)}
        playDungeon={this.playDungeon.bind(this)}
        openDungeonSelection={this.openDungeonSelection.bind(this)}
        dungeon={this.dungeon}
        difficulty={this.difficulty}
      />
    )
  }
}
