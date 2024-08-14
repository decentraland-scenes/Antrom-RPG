import { Color4 } from '@dcl/sdk/math'
import { GetPlayerInfo, GetPlayerInventory, GetPlayerLevels } from '../api/api'
import { GameController } from '../controllers/game.controller'
import { LEVEL_TYPES } from '../player/LevelManager'
import { Player } from '../player/player'
import { CLASS_MAIN_SKILL } from '../player/skills/classes-main-skill'
import {
  type CharacterClasses,
  type CharacterRaces,
  CLASS_BUFF_VARIABLES,
  RACE_BUFF_VARIABLES
} from '../ui/creation-player/creationPlayerData'
import {
  isThereAnyGltfLoading,
  setPlayerPosition,
  waitNextTick
} from '../utils/engine'

let gameInstance: GameController

export function main(): void {
  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
}

async function init(retry: boolean): Promise<void> {
  await waitNextTick()
  await waitNextTick()

  gameInstance = new GameController()
  gameInstance.uiController.loadingUI.startLoading()
  gameInstance.realmController.switchRealm('antrom', 'easy')

  await waitNextTick()

  let playerInfoResponse = await GetPlayerInfo()
  const shouldCreatePlayer = !(playerInfoResponse?.player !== null)

  // Wait until every gltf is loaded
  while (isThereAnyGltfLoading()) {
    await waitNextTick()
  }

  // Initial position
  setPlayerPosition(-22.21, 5.43, -26.53)
  await waitNextTick()

  // UI
  gameInstance.uiController.loadingUI.finishLoading()
  if (shouldCreatePlayer) {
    const result = await gameInstance.uiController.startPlayerCreation()
    playerInfoResponse = await GetPlayerInfo()

    const failedCreation = !(playerInfoResponse?.player !== null)
    if (failedCreation) {
      gameInstance.uiController.displayAnnouncement(
        'Player creation failed',
        Color4.Red(),
        5
      )

      if (retry) {
        throw new Error('Player creation failed after retry')
      } else {
        await init(true)
      }
      return
    }

    if (result.tutorial) {
      // TODO: assign first quest
    }
  }

  if (playerInfoResponse?.player == null) {
    console.error('Player not found')
    if (retry) {
      throw new Error('Player creation failed after retry')
    } else {
      await init(true)
    }
    return
  }

  const [inventory, levels] = await Promise.all([
    GetPlayerInventory(),
    GetPlayerLevels()
  ])

  // Set all the player info
  const myPlayer = new Player(
    gameInstance,
    playerInfoResponse.player.race,
    playerInfoResponse.player.skill,
    playerInfoResponse.player.alliance
  )

  // Set up player
  Player.createInstance(myPlayer)
  updateClassBuffs(myPlayer, myPlayer.class)
  updateRaceBuffs(myPlayer, myPlayer.race)

  if (myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER) > 1) {
    const multipleValue =
      myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER) <= 60
        ? myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER)
        : 60
    myPlayer.updateMaxHp(multipleValue * 4 - 4)
    myPlayer.attack += multipleValue - 1
  }

  myPlayer.setSkill(0, CLASS_MAIN_SKILL[myPlayer.class]())

  if (
    inventory?.computed_player_inventory !== undefined &&
    Array.isArray(inventory.computed_player_inventory)
  ) {
    console.log({ inventory })

    for (const item of inventory.computed_player_inventory) {
      myPlayer.inventory.setItem(item.itemId, item.count)
    }
  } else {
    console.error('Inventory not found')
  }

  if (levels?.levels !== undefined) {
    const levelTypes = Array.from(Object.values(LEVEL_TYPES).values())
    for (const level of levels.levels) {
      if (levelTypes.includes(level.level_type as LEVEL_TYPES)) {
        myPlayer.levels.setLevel(
          level.level_type as LEVEL_TYPES,
          level.level,
          level.xp
        )
      }
    }

    console.log({ levels })
  } else {
    console.error('Levels not found')
  }

  myPlayer.maxHealth =
    myPlayer.maxHealth + myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER)

  if (myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER) <= 6000000) {
    myPlayer.attack =
      myPlayer.attack + myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER) * 2
    // adjust magic stat as necessary
    myPlayer.magic =
      myPlayer.magic + myPlayer.levels.getLevel(LEVEL_TYPES.PLAYER) * 2
  } else {
    myPlayer.attack = myPlayer.attack + 60
    myPlayer.magic = myPlayer.magic + 60
  }

  gameInstance.uiController.playDungeonUI.setVisibility(true)
  gameInstance.uiController.showMainHud()
}

function updateRaceBuffs(player: Player, race: CharacterRaces): void {
  const raceBuff = RACE_BUFF_VARIABLES[race]
  player.updateAtkBuff(raceBuff.attackBuff)
  player.updateDefBuff(raceBuff.defBuff)
  player.updateLuckBuff(raceBuff.luckBuff)
  player.updateMaxHp(raceBuff.maxHealth)
}

function updateClassBuffs(player: Player, classType: CharacterClasses): void {
  const classBuff = CLASS_BUFF_VARIABLES[classType]
  player.updateAtkBuff(classBuff.atkBuff)
  player.updateDefBuff(classBuff.defBuff)
  player.updateLuckBuff(classBuff.luckBuff)
  player.updateMaxHp(classBuff.maxHealth)
  player.updateCritRate(classBuff.critRate)
}
