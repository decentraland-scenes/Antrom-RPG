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
import { arrayOfSkills, CLASS_SKILLS_TO_SHOW } from '../../ui/bottom-bar/skillsData'
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
  public selectedSkill: SkillDefinition | undefined   
  public equipButtonSprite: Sprite = skillsPageSprites.equipButton
  public unequipButtonSprite: Sprite = skillsPageSprites.disableButton
  public classSkillsIndex: number = 0
  public generalSkillsIndex: number = 0
  public generalSkillsArray: SkillDefinition[] = arrayOfSkills
  public classSkillsArray: SkillDefinition[] = arrayOfSkills
  public leftGeneralSprite: Sprite = inventorySprites.leftArrowButton
  public rightGeneralSprite: Sprite = inventorySprites.rightArrowButton
  public leftClassSprite: Sprite = inventorySprites.leftArrowButton
  public rightClassSprite: Sprite = inventorySprites.rightArrowButton
  public playerLevel: number = 10 // TODO get level from player 


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

  selectSkill(skill:SkillDefinition): void {
    this.selectedSkill = skill
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
            generalSkillsIndex={this.generalSkillsIndex}
            classSkillsIndex={this.classSkillsIndex}
            playerLevel={this.playerLevel}
            selectSkill={this.selectSkill.bind(this)}
            scrollRightGeneralSkills={this.increaseGeneralSkillIndex.bind(this)}
            scrollLeftGeneralSkills={this.decreaseGeneralSkillIndex.bind(this)}
            scrollRightClassSkills={this.increaseClassSkillIndex.bind(this)}
            scrollLeftClassSkills={this.decreaseClassSkillIndex.bind(this)}
            generalSkillsLeftSprite={this.leftGeneralSprite}
            generalSkillsRightSprite={this.rightGeneralSprite}
            classSkillsLeftSprite={this.leftClassSprite}
            classSkillsRightSprite={this.rightClassSprite}
            generalSkills={this.generalSkillsArray}
            classSkills={this.classSkillsArray}
            equipSkill={this.equipSkill.bind(this) }
            disableSkill={this.disableSkill.bind(this)}
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

  increaseGeneralSkillIndex(): void {
    if (this.generalSkillsIndex < Math.floor(this.generalSkillsArray.length / CLASS_SKILLS_TO_SHOW)) {
      console.log(this.generalSkillsIndex)
      this.rightGeneralSprite = inventorySprites.rightArrowButtonClicked
      this.generalSkillsIndex++
      this.updateSpritesButtons(150)

    }
  }

  decreaseGeneralSkillIndex(): void {
    if (this.generalSkillsIndex > 0) {
      this.leftGeneralSprite = inventorySprites.leftArrowButtonClicked
      this.generalSkillsIndex--
      this.updateSpritesButtons(150)
    }
  }

  increaseClassSkillIndex(): void {
    if (this.classSkillsIndex < 3) {
      this.rightSprite = inventorySprites.rightArrowButtonClicked
      this.classSkillsIndex++
      this.updateSpritesButtons(150)

    }
  }

  decreaseClassSkillIndex(): void {
    if (this.classSkillsIndex > 0) {
      this.leftSprite = inventorySprites.leftArrowButtonClicked
      this.classSkillsIndex--
      this.updateSpritesButtons(150)

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
      if (this.generalSkillsIndex === 0) {
        this.leftGeneralSprite = inventorySprites.leftArrowButtonUnavailable
      } else {
        this.leftGeneralSprite = inventorySprites.leftArrowButton
      }
      if (this.generalSkillsIndex === Math.floor(this.generalSkillsArray.length/CLASS_SKILLS_TO_SHOW)-1) {
        this.rightGeneralSprite = inventorySprites.rightArrowButtonUnavailable
      } else {
        this.rightGeneralSprite = inventorySprites.rightArrowButton
      }
    }, milisecs)
  }

  equipSkill(): void {
    // TODO Equip this.selectedSkill if it isn't equiped.
    if (this.selectedSkill !== undefined) {
      console.log('Equiped skill')
    } else {
      console.error('You should choise a skill to equip')
    }
  }

  disableSkill(): void {
    // TODO Disable this.selectedSkill if it is equiped.
    if (this.selectedSkill !== undefined) {
      console.log('Disabled skill') 
    } else {
      console.error('You should choise a skill to disable')
      
    }
  }
}



export function main(): void {
  const gameUI = new UI()
  gameUI.showInventory()
}
