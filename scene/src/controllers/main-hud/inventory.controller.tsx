import * as utils from '@dcl-sdk/utils'

import ReactEcs from '@dcl/sdk/react-ecs'
import { Player } from '../../player/player'
import { type MaybeSkill, type SkillDefinition } from '../../player/skills'
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
  // type WearableItem,
  wearables,
  // WEARABLES_MAPPING,
  // type WearableString,
  type WearableType
} from '../../ui/inventory/inventoryData'
import InventoryPage, {
  type InventoryItemSlot
} from '../../ui/inventory/inventoryPage'
import ProfessionsPage from '../../ui/inventory/professionsPage'
import SkillsPage from '../../ui/inventory/skillsPage'
import { type Sprite } from '../../utils/ui-utils'
import { LEVEL_TYPES } from '../../player/LevelManager'
// import { ThiefMainSkill } from '../../player/skills/classes-main-skill'
import { CharacterClasses } from '../../ui/creation-player/creationPlayerData'
import {
  companionPageSprite,
  companions,
  PetTypes,
  type CompanionType
} from '../../ui/inventory/companionsData'
import { type ProfessionType } from '../../ui/inventory/professionsData'
import {
  BerserkerBloodDance,
  BerserkerBloodFury,
  BerserkerDeathStrike,
  BerserkerFuryMomentum,
  BerserkerRampage,
  BerserkerSavagePrecision,
  ClericGeraldsBlessing,
  ClericHealingTouch,
  ClericHolyRetribution,
  ClericProtectorBlessing,
  ClericSacredBarrier,
  ClericSmiteEvil,
  GeneralCelestialRetribution,
  GeneralConfusingBlades,
  GeneralDefensiveAura,
  GeneralDefensivePosture,
  GeneralDisruptiveBlow,
  GeneralFireball,
  GeneralFirstAidKit,
  GeneralFortressOfResilience,
  GeneralFortunesFavor,
  GeneralGodricsBlessing,
  GeneralHammerShot,
  GeneralIronDefense,
  GeneralLuckyCharm,
  GeneralMightyAssault,
  GeneralOathToDemonKing,
  GeneralPrecisionFocus,
  GeneralShieldWall,
  GeneralSoulRelease,
  GeneralSpellCancel,
  GeneralStorm,
  GeneralStrike,
  GeneralVampiricTransfusion,
  GeneralVenomousBlade,
  GeneralVitalityBoost,
  GeneralVitalitySurge,
  MageArcaneMissile,
  MageArmorSap,
  MageBlink,
  MageFireball,
  MageRestoration,
  MageShadowChains,
  RangerDeadlyPrecision,
  RangerMightyShot,
  RangerPoisonArrows,
  RangerRecoilShot,
  RangerSavageStrike,
  RangerVitalShot,
  ThiefBleedForMe,
  ThiefFortunesFavor,
  ThiefLastBlow,
  ThiefShadowStrike,
  ThiefStoneHeart,
  ThiefSwiftFoot
} from '../../player/skills/definitions'
import { equipCompanion } from '../../inventory/equipCompanion'
// import { WearablesConfig } from '../../player/wearables-config'
// import {type GetPlayerDataRes, getPlayer }  from '@dcl/sdk/src/players'

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
  public leftGeneralSprite: Sprite = skillsPageSprites.leftArrowReg
  public rightGeneralSprite: Sprite = skillsPageSprites.rightArrowReg
  public leftClassSprite: Sprite = skillsPageSprites.leftArrowReg
  public rightClassSprite: Sprite = skillsPageSprites.rightArrowReg
  public selectedSkillType: string = ''

  // Inventory Page
  public selectedWearable: WearableType | undefined
  public characterWearables: WearableType[] = [
    wearables.body[0],
    wearables.head[1],
    wearables.legs[0],
    wearables.crown[0],
    wearables.extra[0],
    wearables.mainhand[1],
    wearables.offhand[0],
    wearables.feet[0]
  ]

  public wearableIndex: number = 0
  public increaseWearableIndexSprite: Sprite = inventorySprites.upArrow
  public decreaseWearableIndexSprite: Sprite = inventorySprites.downArrow

  // Companion Page
  public selectedCompanion: CompanionType | undefined
  public equipedCompanion: CompanionType | undefined = companions[1]
  public componionButtonSprite: Sprite = companionPageSprite.Reg_equip_button
  public purchasedCompanions: CompanionType[] = [companions[0], companions[1]]

  // Profession Page
  public selectedProfession: ProfessionType | undefined

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
    this.selectedWearable = undefined
    this.selectedCompanion = this.equipedCompanion

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
        this.companions = () => (
          <CompanionsPage
            selectedCompanion={this.selectedCompanion}
            equipedCompanion={this.equipedCompanion}
            selectCompanion={this.selectCompanion.bind(this)}
            onClickButton={this.componionOnClickButton.bind(this)}
            buttonSprite={this.componionButtonSprite}
            purchasedCompanions={[]}
          />
        )

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
        this.professions = () => (
          <ProfessionsPage
            selectedProfession={this.selectedProfession}
            selectProfession={this.selectProfession.bind(this)}
          />
        )
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

  selectProfession(profession: ProfessionType): void {
    this.selectedProfession = profession
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
      this.rightGeneralSprite = inventorySprites.rightArrowClicked
      this.generalSkillsIndex++
      this.updateSpritesButtons(150)
    }
  }

  decreaseGeneralSkillIndex(): void {
    if (this.generalSkillsIndex > 0) {
      this.leftGeneralSprite = inventorySprites.leftArrowClicked
      this.generalSkillsIndex--
      this.updateSpritesButtons(150)
    }
  }

  increaseClassSkillIndex(): void {
    if (
      this.classSkillsIndex <
      Math.floor(this.classSkillsArray.length / CLASS_SKILLS_TO_SHOW)
    ) {
      this.rightClassSprite = inventorySprites.rightArrowClicked
      this.classSkillsIndex++
      this.updateSpritesButtons(150)
    }
  }

  decreaseClassSkillIndex(): void {
    if (this.classSkillsIndex > 0) {
      this.leftClassSprite = inventorySprites.leftArrowClicked
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
        this.leftGeneralSprite = skillsPageSprites.leftArrowUnavail
      } else {
        this.leftGeneralSprite = skillsPageSprites.leftArrowReg
      }
      if (
        this.generalSkillsIndex ===
        Math.floor(this.generalSkillsArray.length / GENERAL_SKILLS_TO_SHOW)
      ) {
        this.rightGeneralSprite = skillsPageSprites.rightArrowUnavail
      } else {
        this.rightGeneralSprite = skillsPageSprites.rightArrowReg
      }
      if (
        this.classSkillsIndex ===
        Math.floor(this.classSkillsArray.length / CLASS_SKILLS_TO_SHOW)
      ) {
        this.rightClassSprite = skillsPageSprites.rightArrowUnavail
      } else {
        this.rightClassSprite = skillsPageSprites.rightArrowReg
      }
      if (this.classSkillsIndex === 0) {
        this.leftClassSprite = skillsPageSprites.leftArrowUnavail
      } else {
        this.leftClassSprite = skillsPageSprites.leftArrowReg
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
      if (this.selectedCompanion !== undefined) {
        if (
          this.purchasedCompanions.find(
            (companion) =>
              this.selectedCompanion !== undefined &&
              companion.name === this.selectedCompanion.name
          ) != null
        ) {
          this.componionButtonSprite = companionPageSprite.Reg_equip_button
        } else {
          this.componionButtonSprite = companionPageSprite.Purchase_reg
        }
        if (this.selectedCompanion === this.equipedCompanion) {
          this.componionButtonSprite = companionPageSprite.Disable_button
        }
      }
    }, milisecs)
  }

  equipSkill(): void {
    const player = Player.getInstance()
    const playerSkills = player.getSkills()
    const skillAlreadyEquipped = playerSkills.some(
      (skill) => skill?.definition.name === this.selectedSkill?.name
    )

    if (skillAlreadyEquipped) {
      console.error('This skill is already equipped.')
      return
    }
    if (this.selectedSkill !== undefined) {
      const firstFreePosition = this.getLowerSkillIndex()
      if (firstFreePosition !== -1) {
        console.log(this.selectedSkill)
        const skill = this.getSelectedSkill(this.selectedSkill.name)
        if (skill != null) {
          Player.getInstance().setSkill(firstFreePosition, skill)
        } else {
          console.error('Skill not found')
        }
      } else {
        console.error('You already equipped 6 ksill')
      }
    } else {
      console.error('You should choise a skill to equip')
    }
  }

  getLowerSkillIndex(): number {
    const player = Player.getInstance()
    const firstFreePosition = player.skills.findIndex(
      (skill) => skill === undefined
    )
    return firstFreePosition
  }

  getSelectedSkill(skillName: string): MaybeSkill {
    switch (skillName) {
      case "Gerald's Blessing":
        return new ClericGeraldsBlessing()
      case "Protector's Blessing":
        return new ClericProtectorBlessing()
      case 'Healing Touch':
        return new ClericHealingTouch()
      case 'Sacred Barrier':
        return new ClericSacredBarrier()
      case 'Holy Retribution':
        return new ClericHolyRetribution()
      case 'Smite Evil':
        return new ClericSmiteEvil()
      case 'Arcane Missile':
        return new MageArcaneMissile()
      case 'Shadow Chains':
        return new MageShadowChains()
      case 'Armor Sap':
        return new MageArmorSap()
      case 'Ether Protection':
        return new MageBlink()
      case 'Restoration':
        return new MageRestoration()
      case 'Fireball Aura':
        return new MageFireball()
      case 'Swiftfoot':
        return new ThiefSwiftFoot()
      case 'Shadowstrike':
        return new ThiefShadowStrike()
      case 'Fortunes Favor':
        return new ThiefFortunesFavor()
      case 'Stoneheart':
        return new ThiefStoneHeart()
      case 'Bleed For Me':
        return new ThiefBleedForMe()
      case 'Last Blow':
        return new ThiefLastBlow()
      case 'Deadly Precision':
        return new RangerDeadlyPrecision()
      case 'Savage Strike':
        return new RangerSavageStrike()
      case 'Mighty Shot':
        return new RangerMightyShot()
      case 'Poison Arrows':
        return new RangerPoisonArrows()
      case 'Vital Shot':
        return new RangerVitalShot()
      case 'Recoil Shot':
        return new RangerRecoilShot()
      case 'Blood Fury':
        return new BerserkerBloodFury()
      case 'Death Strike':
        return new BerserkerDeathStrike()
      case 'Savage Precision':
        return new BerserkerSavagePrecision()
      case 'Rampage':
        return new BerserkerRampage()
      case 'Blood Dance':
        return new BerserkerBloodDance()
      case "Fury's Momentum":
        return new BerserkerFuryMomentum()
      case 'Disruptive Blow':
        return new GeneralDisruptiveBlow()
      case 'First Aid Kit':
        return new GeneralFirstAidKit()
      case 'Fireball':
        return new GeneralFireball()
      case 'Sanctified Storm':
        return new GeneralStorm()
      case 'Lucky Charm':
        return new GeneralLuckyCharm()
      case 'Precision Focus':
        return new GeneralPrecisionFocus()
      case 'Quake!':
        return new GeneralDefensivePosture()
      case 'Thunder Strike':
        return new GeneralStrike()
      case 'Iron Defense':
        return new GeneralIronDefense()
      case 'Vitality Surge':
        return new GeneralVitalitySurge()
      case 'Vitality Boost':
        return new GeneralVitalityBoost()
      case 'Shield Wall':
        return new GeneralShieldWall()
      case 'Double Hammer Shot':
        return new GeneralHammerShot()
      case 'Magic Aura':
        return new GeneralDefensiveAura()
      case 'Soul Release':
        return new GeneralSoulRelease()
      case 'Mighty Assault':
        return new GeneralMightyAssault()
      case 'Big Red Resilience':
        return new GeneralFortressOfResilience()
      case 'Oath to the King':
        return new GeneralOathToDemonKing()
      case "Godric's Blessing":
        return new GeneralGodricsBlessing()
      case 'Confusing Blades':
        return new GeneralConfusingBlades()
      case 'Venomous Blade':
        return new GeneralVenomousBlade()
      case 'Intimidation':
        return new GeneralSpellCancel()
      case 'Vampiric Transfusion':
        return new GeneralVampiricTransfusion()
      case 'Celestial Retribution':
        return new GeneralCelestialRetribution()
      case 'Fortunes Benediction':
        return new GeneralFortunesFavor()
    }
  }

  disableSkill(): void {
    // TODO Disable this.selectedSkill if it is equiped.
    console.log('selected skill undefined')
    if (this.selectedSkill !== undefined) {
      console.log('Disabled skill')
      const player = Player.getInstance()
      player.removeSkill(this.selectedSkill.name)
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

  selectCompanion(companion: CompanionType): void {
    if (companion.type !== PetTypes.PLACEHOLDER) {
      this.selectedCompanion = companion
      this.updateSpritesButtons(150)
    }
  }

  componionOnClickButton(): void {
    if (this.selectedCompanion !== undefined) {
      if (this.selectedCompanion === this.equipedCompanion) {
        this.componionButtonSprite =
          companionPageSprite.Disable_button_while_clicked
        // execute function disable companion
        console.log('disable')
        this.equipedCompanion = undefined
      } else if (
        this.purchasedCompanions.find(
          (companion) => companion.name === this.selectedCompanion?.name
        ) != null
      ) {
        this.componionButtonSprite =
          companionPageSprite.equip_button_when_clicked
        // execute function equip companion
        equipCompanion(this.selectedCompanion.name)
        this.equipedCompanion = this.selectedCompanion
      } else {
        this.componionButtonSprite = companionPageSprite.Purchase_while_clicked
        // execute function purchase companion
        console.log('purchase')
        this.purchasedCompanions.push(this.selectedCompanion)
      }

      this.updateSpritesButtons(150)
    }
  }

  // This code is to obtain and display equiped wearables and filter them in inventory. Also take snapshot of character body with wearables.
  // Is an approach from sdk6 original code but isn't implemented yet

  // createWearablesIcon = async (array: WearableType[], playerData: GetPlayerDataRes): Promise<WearableItem | null> => {
  //   for (const key of array) {
  //     const wearableString = key.name as WearableString
  //       if (await this.checkItem(playerData, key.name)) {
  //         const { stats, duplicates, dStats, urn, label } = WEARABLES_MAPPING[wearableString]
  //         return {
  //             label,
  //             stats,
  //             duplicates,
  //             dStats,
  //             urn
  //         }
  //     }

  //   }
  //   return null
  // }

  // checkItem = async (playerData: GetPlayerDataRes, key: string): Promise<boolean> => {
  //   if (!(key in WEARABLES_MAPPING)) return false
  //   const { urn } = WearablesConfig.mapping[key]
  //   let result = false
  //   if (playerData?.wearables !== undefined)
  //   for (let wearable of playerData.wearables) {
  //       // temp fix for DCL urn bug
  //       const w = wearable.split(':')
  //       if (w.length > 6)
  //           wearable = w.slice(0, -1).join(':')
  //       if (wearable === urn) {
  //           result = true
  //       }
  //   }
  //   return result
  // }

  // getWearables = async ():Promise<Array<WearableItem|null>> => {
  //   const playerData: GetPlayerDataRes | null = getPlayer()

  //   const head: any = WearablesConfig.wearables.head
  //   const body: any = WearablesConfig.wearables.body
  //   const legs: any = WearablesConfig.wearables.legs
  //   const feet: any = WearablesConfig.wearables.feet
  //   const mainhand: any = WearablesConfig.wearables.mainhand
  //   const offhand: any = WearablesConfig.wearables.offhand
  //   const extra: any = WearablesConfig.wearables.extra
  //   const crown: any = WearablesConfig.wearables.crown

  //   const wearables: Array<WearableItem | null> = []

  //   if (playerData !== null) {
  //     wearables.push(await this.createWearablesIcon(head, playerData))
  //     wearables.push(await this.createWearablesIcon(body, playerData))
  //     wearables.push(await this.createWearablesIcon(legs, playerData))
  //     wearables.push(await this.createWearablesIcon(feet, playerData))
  //     wearables.push(await this.createWearablesIcon(mainhand, playerData))
  //     wearables.push(await this.createWearablesIcon(offhand, playerData))
  //     wearables.push(await this.createWearablesIcon(extra, playerData))
  //     wearables.push(await this.createWearablesIcon(crown, playerData))
  //   }

  //   return wearables.filter((e) => {
  //       return e != null
  //   })
  // }

  // updatePlayerPicture = async (): Promise<void> => {
  //   const playerData: GetPlayerDataRes | null = getPlayer()
  //   this.characterPicture = playerData.avatar?.bodyShapeUrn
  // }
}
