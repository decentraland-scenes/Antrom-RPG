import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import Inventory from '../../ui/inventory/inventoryComponent'
import {
  inventorySprites,
  skillsPageSprites
} from '../../ui/inventory/inventoryData'
import { type Sprite } from '../../utils/ui-utils'
import * as utils from '@dcl-sdk/utils'
import SkillsPage from '../../ui/inventory/skillsPage'
import CompanionsPage from '../../ui/inventory/companionsPage'
import InventoryPage from '../../ui/inventory/inventoryPage'
import ProfessionsPage from '../../ui/inventory/professionsPage'
import { SKILL_DATA } from '../../ui/bottom-bar/skillsData'
import { type SkillDefinition } from '../../player/skills'

export class UI {
  // Nav Bar
  public isVisible: boolean = false
  public inventory: (() => ReactEcs.JSX.Element) | undefined
  public skills: (() => ReactEcs.JSX.Element) | undefined
  public companions: (() => ReactEcs.JSX.Element) | undefined
  public professions: (() => ReactEcs.JSX.Element) | undefined
  public tabIndex: number = 2
  public leftSprite: Sprite = inventorySprites.leftArrowButton
  public rightSprite: Sprite = inventorySprites.rightArrowButton

  // Skills Page
  public selectedSkill: SkillDefinition | undefined =
    SKILL_DATA.GENERAL_DEFENSIVE_AURA
  
  public equipButtonSprite: Sprite = skillsPageSprites.equipButton
  public unequipButtonSprite: Sprite = skillsPageSprites.equipUnavailableButton

  constructor() {
    const uiComponent = (): ReactEcs.JSX.Element[] => [this.inventoryUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  inventoryUI(): ReactEcs.JSX.Element {
    return (
      <Inventory
        isVisible={this.isVisible}
        inventory={this.inventory}
        companions={this.companions}
        skills={this.skills}
        professions={this.professions}
        scrollRight={this.increaseTabIndex.bind(this)}
        scrollLeft={this.decreaseTabIndex.bind(this)}
        leftSprite={this.leftSprite}
        rightSprite={this.rightSprite}
        updateTab={this.updateTab.bind(this)}
      />
    )
  }

  showInventory(): void {
    this.isVisible = true
    this.updateTab(this.tabIndex)
  }

  hideInventory(): void {
    this.isVisible = false
    this.tabIndex = 0
  }

  hideAllPages(): void {
    this.inventory = undefined
    this.skills = undefined
    this.companions = undefined
    this.professions = undefined
  }

  updateTab(index: number): void {
    this.hideAllPages()
    this.tabIndex = index
    this.updateSpritesButtons(150)
    switch (this.tabIndex) {
      case 0:
        this.inventory = () => <InventoryPage prop={undefined} />
        break
      case 1:
        this.companions = () => <CompanionsPage prop={undefined} />
        break
      case 2:
        this.skills = () => (
          <SkillsPage
            selectedSkill={this.selectedSkill}
            selectedSkillType=""
            equipButtonSprite={this.equipButtonSprite}
            unequipButtonSprite={this.unequipButtonSprite}
          />
        )
        break
      case 3:
        this.professions = () => <ProfessionsPage prop={undefined} />
        break
    }
  }

  increaseTabIndex(): void {
    if (this.tabIndex < 3) {
      this.rightSprite = inventorySprites.rightArrowButtonClicked
      this.tabIndex++
      this.updateTab(this.tabIndex)
    }
  }

  decreaseTabIndex(): void {
    if (this.tabIndex > 0) {
      this.leftSprite = inventorySprites.leftArrowButtonClicked
      this.tabIndex--
      this.updateTab(this.tabIndex)
    }
  }

  updateSpritesButtons(milisecs: number): void {
    utils.timers.setTimeout(() => {
      if (this.tabIndex === 0) {
        this.leftSprite = inventorySprites.leftArrowButtonUnavailable
      } else {
        this.leftSprite = inventorySprites.leftArrowButton
      }
      if (this.tabIndex === 3) {
        this.rightSprite = inventorySprites.rightArrowButtonUnavailable
      } else {
        this.rightSprite = inventorySprites.rightArrowButton
      }
    }, milisecs)
  }
}

export function main(): void {
  const gameUI = new UI()
  gameUI.showInventory()
}
