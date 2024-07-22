import * as utils from '@dcl-sdk/utils'
import ReactEcs from '@dcl/sdk/react-ecs'
import { Player } from '../../player/player'
import { type SkillDefinition } from '../../player/skills'
import {
  CLASS_SKILLS_TO_SHOW,
  GENERAL_SKILLS_TO_SHOW,
  SKILL_DATA
} from '../../ui/bottom-bar/skillsData'
import CompanionsPage from '../../ui/inventory/companionsPage'
import Inventory from '../../ui/inventory/inventoryComponent'
import {
  inventorySprites,
  skillsPageSprites
} from '../../ui/inventory/inventoryData'
import InventoryPage, {
  type InventoryItemSlot
} from '../../ui/inventory/inventoryPage'
import ProfessionsPage from '../../ui/inventory/professionsPage'
import SkillsPage from '../../ui/inventory/skillsPage'
import { type Sprite } from '../../utils/ui-utils'
import { LEVEL_TYPES } from '../../player/LevelManager'

export class InventoryController {
  // Nav Bar
  public inventory: (() => ReactEcs.JSX.Element) | undefined
  public skills: (() => ReactEcs.JSX.Element) | undefined
  public companions: (() => ReactEcs.JSX.Element) | undefined
  public professions: (() => ReactEcs.JSX.Element) | undefined
  public tabIndex: number = 0
  public leftSprite: Sprite = inventorySprites.leftArrowButton
  public rightSprite: Sprite = inventorySprites.rightArrowButton

  // Skills Page
  public selectedSkill: SkillDefinition | undefined
  public equipButtonSprite: Sprite = skillsPageSprites.equipButton
  public unequipButtonSprite: Sprite = skillsPageSprites.disableButton
  public classSkillsIndex: number = 0
  public generalSkillsIndex: number = 0
  public generalSkillsArray: SkillDefinition[] = []
  public classSkillsArray: SkillDefinition[] = []
  public leftGeneralSprite: Sprite = inventorySprites.leftArrowButton
  public rightGeneralSprite: Sprite = inventorySprites.rightArrowButton
  public leftClassSprite: Sprite = inventorySprites.leftArrowButton
  public rightClassSprite: Sprite = inventorySprites.rightArrowButton
  public selectedSkillType: string = ''

  constructor() {
    this.updateTab(0)
  }

  render(): ReactEcs.JSX.Element {
    return (
      <Inventory
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
        this.inventory = () => {
          const player = Player.getInstance()
          const items: InventoryItemSlot[] = Object.entries(
            player.inventory.inventory
          ).map(([key, value]) => ({
            itemId: key,
            count: value.count
          }))
          return (
            <InventoryPage
              inventorySlots={items}
              physicalAttack={player.getPlayerAttack(false)}
              magic={player.getMagic()}
              physicalDefense={player.getDefensePercent() * 100.0}
              luck={player.getLuckRange()}
              criticalHitRate={player.getCritRate()}
              criticalHitDamage={player.getCritDamage()}
              healthPoints={player.health}
              maxHealthPoints={player.maxHealth}
            />
          )
        }
        break
      case 1:
        this.companions = () => <CompanionsPage prop={undefined} />
        break
      case 2:
        this.skills = () => {
            this.loadSkills()
          return (
            <SkillsPage
              selectedSkill={this.selectedSkill}
              selectedSkillType={this.selectedSkillType}
              equipButtonSprite={this.equipButtonSprite}
              unequipButtonSprite={this.unequipButtonSprite}
              generalSkillsIndex={this.generalSkillsIndex}
              classSkillsIndex={this.classSkillsIndex}
              playerLevel={Player.getInstance().levels.getLevel(
                LEVEL_TYPES.PLAYER
              )}
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
              equipSkill={this.equipSkill.bind(this)}
              disableSkill={this.disableSkill.bind(this)}
              selectSkillType={this.selectSkillType.bind(this)} />
          )
        }
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

  selectSkill(skill: SkillDefinition): void {
    this.selectedSkill = skill
  }

  increaseGeneralSkillIndex(): void {
    if (
      this.generalSkillsIndex <
      Math.floor(this.generalSkillsArray.length / GENERAL_SKILLS_TO_SHOW)
    ) {
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
    if (this.classSkillsIndex < Math.floor(this.generalSkillsArray.length / CLASS_SKILLS_TO_SHOW)) {
      this.rightClassSprite = inventorySprites.rightArrowButtonClicked
      this.classSkillsIndex++
      this.updateSpritesButtons(150)
    }
  }

  decreaseClassSkillIndex(): void {
    if (this.classSkillsIndex > 0) {
      this.leftClassSprite = inventorySprites.leftArrowButtonClicked
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
      if (
        this.generalSkillsIndex ===
        Math.floor(this.generalSkillsArray.length / GENERAL_SKILLS_TO_SHOW)
      ) {
        this.rightGeneralSprite = inventorySprites.rightArrowButtonUnavailable
      } else {
        this.rightGeneralSprite = inventorySprites.rightArrowButton
      }
      if (
        this.classSkillsIndex ===
        Math.floor(this.classSkillsArray.length / CLASS_SKILLS_TO_SHOW)
      ) {
        this.rightClassSprite = inventorySprites.rightArrowButtonUnavailable
      } else {
        this.rightClassSprite = inventorySprites.rightArrowButton
      }
      if (this.classSkillsIndex === 0) {
        this.leftClassSprite = inventorySprites.leftArrowButtonUnavailable
      } else {
        this.leftClassSprite = inventorySprites.leftArrowButton
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

  loadSkills(): void {
    const generalSkills =  Object.keys(SKILL_DATA)
    .filter(key => key.includes("GENERAL"))
    .map(key => SKILL_DATA[key]);
    
    this.generalSkillsArray = generalSkills

    const classSkills =  Object.keys(SKILL_DATA)
    .filter(key => key.includes(Player.getInstance().class.toString().toUpperCase()))
    .map(key => SKILL_DATA[key]);
    
    this.generalSkillsArray = classSkills
    
  }

  selectSkillType(type: 'class' | 'general'): void {
    if (type === 'class') {
      // this.selectedSkillType = Player.getInstance().class.toString().toUpperCase() + ' Skill'
      this.selectedSkillType = 'Thief' + ' Skill'
    } else {
      this.selectedSkillType = 'General' + ' Skill'
    }
    }

}
