import { engine } from '@dcl/sdk/ecs'
import ReactEcs from '@dcl/sdk/react-ecs'
import { DIFFICULTIES } from './multiplayerData'
import type { UIController } from '../../controllers/ui.controller'
import type { SelectOptionProps } from './multiplayerComponent'
import Multiplayer from '../../ui/multiplayer/multiplayerComponent'
export class PlayMultiplayerUI {
  public isOpen : boolean
  public isMenuOpen: boolean
  public isVisible: boolean
  public isCreateOpen : boolean
  public difficulty: string
  public timer: number
  public dungeon: string
  public isJoinOpen: boolean

  private readonly uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isOpen = false
    this.isMenuOpen = false
    this.isVisible = false
    this.isCreateOpen = false
    this.isJoinOpen = false
    this.difficulty = ""
    this.timer = 2
    this.dungeon = "dungeon2"
  }

  setVisibility(visibility: boolean): void {
    this.isVisible = visibility
  }

  setOpen(open :boolean): void{
      this.isOpen = open
  }

  menuOpen(exit: boolean):void{
    this.isMenuOpen = exit
  }


  openCreate(open: boolean):void{
    this.isCreateOpen = open
  }

  openJoin(open:boolean):void{
    this.isJoinOpen = open
  }


  playDungeon(): void {
    console.log("Entering Dungeon")
    this.timer = 2
    engine.addSystem(this.loadingDungeonSystem.bind(this))
    this.uiController.loadRealm('dungeon', this.difficulty)
  }

  loadingDungeonSystem(dt: number): void {
    if (this.timer - dt <= 0 ) {
      engine.removeSystem(this.loadingDungeonSystem)
      this.setOpen(false)
    } else {
      this.timer = this.timer - dt
    }
  }


  selectOption({ id, array }: SelectOptionProps): void {

    let isDifficulty: boolean = false

   if (array === DIFFICULTIES) {
      isDifficulty = true
    }

    const selectedOption = array.filter((option) => option.id === id)[0]

    if (selectedOption.available) {
  
      if (selectedOption.selected) {
        selectedOption.selected = false
        if (isDifficulty) {
          this.difficulty = ''
        }
      } else {
        for (const option of array) {
          option.selected = false
        }
        selectedOption.selected = true
     
        if (isDifficulty) {
          this.difficulty = selectedOption.id
        }
    
      }


    }
  }
  
  multiplayerUI(): ReactEcs.JSX.Element {
    return (
      <Multiplayer
        isOpen={this.isOpen}
        isMenuOpen={this.isMenuOpen}
        isCreateOpen={this.isCreateOpen}
        isJoinOpen={this.isJoinOpen}
        difficulty={this.difficulty}
        setOpen={this.setOpen.bind(this)}
        openCreate={this.openCreate.bind(this)}
        openJoin={this.openJoin.bind(this)}
        selectOption={this.selectOption.bind(this)}
        playDungeon={this.playDungeon.bind(this)}
        menuOpen={this.menuOpen.bind(this)}
      />
    )
  }
}
