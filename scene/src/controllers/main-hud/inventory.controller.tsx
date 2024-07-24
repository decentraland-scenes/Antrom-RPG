import * as utils from '@dcl-sdk/utils'
import ReactEcs from '@dcl/sdk/react-ecs'
import { Player } from '../../player/player'
import { type SkillDefinition } from '../../player/skills'
import {
  CLASS_SKILLS_TO_SHOW,
  GENERAL_SKILLS_TO_SHOW,
  SKILL_DATA,
  type SkillKey
} from '../../ui/bottom-bar/skillsData'
import CompanionsPage from '../../ui/inventory/companionsPage'
import Inventory from '../../ui/inventory/inventoryComponent'
import {
  CHARACTER_WEARABLES_TO_SHOW,
  inventorySprites,
  skillsPageSprites,
  wearables,
  type WearableType
} from '../../ui/inventory/inventoryData'
import InventoryPage, {
  type InventoryItemSlot
} from '../../ui/inventory/inventoryPage'
import ProfessionsPage from '../../ui/inventory/professionsPage'
import SkillsPage from '../../ui/inventory/skillsPage'
import { type Sprite } from '../../utils/ui-utils'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { ThiefMainSkill } from '../../player/skills/classes-main-skill'
import { CharacterClasses } from '../../ui/creation-player/creationPlayerData'

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
  public generalSkillsArray: SkillDefinition[] = this.loadSkills('general')
  public classSkillsArray: SkillDefinition[] = this.loadSkills('class')
  public leftGeneralSprite: Sprite = inventorySprites.leftArrowButton
  public rightGeneralSprite: Sprite = inventorySprites.rightArrowButton
  public leftClassSprite: Sprite = inventorySprites.leftArrowButton
  public rightClassSprite: Sprite = inventorySprites.rightArrowButton
  public selectedSkillType: string = ''

  // Inventory Page
  public selectedWearable: WearableType | undefined
  public characterWearables: WearableType[] = [
    wearables.body[0],
    wearables.head[1],
    wearables.legs[0],
    wearables.crown[0],
    wearables.body[0],
    wearables.head[1],
    wearables.legs[0],
    wearables.crown[0]
  ]

  public wearableIndex: number = 0
  public increaseWearableIndexSprite: Sprite = inventorySprites.upArrow
  public decreaseWearableIndexSprite: Sprite = inventorySprites.downArrow

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
              selectWearable={this.selectWearable.bind(this)}
              selectedWearable={this.selectedWearable}
              processStatName={this.processStatName.bind(this)}
              characterWearables={this.characterWearables}
              wearablesIndex={this.wearableIndex}
              scrollUpWearables={this.decreaseWearableIndex.bind(this)}
              scrollUpWearablesSprite={this.decreaseWearableIndexSprite}
              scrollDownWearables={this.increaseWearableIndex.bind(this)}
              scrollDownWearablesSprite={this.increaseWearableIndexSprite}
            />
          )
        }
        break
      case 1:
        this.companions = () => <CompanionsPage prop={undefined} />
        break
      case 2:
        this.skills = () => (
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
            selectSkillType={this.selectSkillType.bind(this)}
          />
        )
        break
      case 3:
        this.professions = () => <ProfessionsPage prop={undefined} />
        break
    }
  }

  selectWearable(wearable: WearableType): void {
    if (this.selectedWearable !== wearable) {
      this.selectedWearable = wearable
    } else {
      this.selectedWearable = undefined
    }
  }

  increaseWearableIndex(): void {
    if (
      this.wearableIndex <
      Math.floor(this.characterWearables.length / CHARACTER_WEARABLES_TO_SHOW)
    ) {
      this.increaseWearableIndexSprite = inventorySprites.downArrowClicked
      this.wearableIndex++
      this.updateSpritesButtons(150)
    }
  }

  decreaseWearableIndex(): void {
    if (this.wearableIndex > 0) {
      this.decreaseWearableIndexSprite = inventorySprites.upArrowClicked
      this.wearableIndex--
      this.updateSpritesButtons(150)
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
    if (
      this.classSkillsIndex <
      Math.floor(this.generalSkillsArray.length / CLASS_SKILLS_TO_SHOW)
    ) {
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
      if (this.wearableIndex === 0) {
        this.decreaseWearableIndexSprite = inventorySprites.upArrowUnavailable
      } else {
        this.decreaseWearableIndexSprite = inventorySprites.upArrow
      }
      if (
        this.wearableIndex ===
        Math.floor(this.characterWearables.length / CHARACTER_WEARABLES_TO_SHOW)
      ) {
        this.increaseWearableIndexSprite = inventorySprites.downArrowUnavailable
      } else {
        this.increaseWearableIndexSprite = inventorySprites.downArrow
      }
    }, milisecs)
  }

  equipSkill(): void {
    // TODO Equip this.selectedSkill if it isn't equiped.
    if (this.selectedSkill !== undefined) {
      console.log('Equiped skill')
      Player.getInstance().setSkill(
        this.getLowerSkillIndex(),
        new ThiefMainSkill()
      )
    } else {
      console.error('You should choise a skill to equip')
    }
  }

  getLowerSkillIndex(): number {
    // TODO Obtain the skills array
    // const firstFreePosition = array.findIndex(element => element === undefined);
    // return firstFreePosition
    return 0
  }

  disableSkill(): void {
    // TODO Disable this.selectedSkill if it is equiped.
    if (this.selectedSkill !== undefined) {
      console.log('Disabled skill')
    } else {
      console.error('You should choise a skill to disable')
    }
  }

  loadSkills(type: 'class' | 'general'): SkillDefinition[] {
    let filterCriteria: string
    if (type === 'class') {
      filterCriteria = CharacterClasses[Player.getInstance().class].slice(3)
    } else {
      filterCriteria = 'GENERAL'
    }

    return Object.keys(SKILL_DATA)
      .filter((key) => key.includes(filterCriteria))
      .map((key) => SKILL_DATA[key as SkillKey])
  }

  selectSkillType(type: 'class' | 'general'): void {
    if (type === 'class') {
      const characterClassName = CharacterClasses[Player.getInstance().class]
        .slice(3)
        .toLowerCase()
      this.selectedSkillType =
        characterClassName.charAt(0).toUpperCase() +
        characterClassName.slice(1) +
        ' Skill'
    } else {
      this.selectedSkillType = 'General' + ' Skill'
    }
  }

  processStatName(key: string): string {
    let title: string = ''
    switch (key) {
      case 'luckBuff':
        title = 'Luck Modifier'
        break
      case 'attackBuff':
        title = 'Attack Modifier'
        break
      case 'defBuff':
        title = 'Defense Modifier'
        break
      case 'health':
        title = 'Health Increase'
        break
      case 'distance':
        title = 'Health Increase'
        break
      case 'critRate':
        title = 'Critical Rate Increase'
        break
      case 'critDamage':
        title = 'Critical Damage Increase'
        break
      case 'magicBuff':
        title = 'Magic Modifier'
        break
    }
    return title
  }
}
