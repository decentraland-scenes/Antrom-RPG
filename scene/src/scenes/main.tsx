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
import { getPlayer } from '@dcl/sdk/src/players'
import { getWearables, getWearablesEffects, applyWearableStatsEffect } from '../player/wearables'

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

  // TESTING
  const t = getPlayer()
  console.log(t?.userId, 'HERE')

  gameInstance = new GameController()
  gameInstance.uiController.loadingUI.startLoading()
  gameInstance.realmController.switchRealm('antrom', 'easy')

  await waitNextTick()

  // TODO: Database connection required - commenting out for testing
  // let playerInfoResponse = await GetPlayerInfo()
  // const shouldCreatePlayer = !(playerInfoResponse?.player !== null)
  let playerInfoResponse = null
  const shouldCreatePlayer = true // Force player creation for testing

  // Wait until every gltf is loaded
  while (isThereAnyGltfLoading()) {
    await waitNextTick()
  }

  // Initial position
  setPlayerPosition(-22.21, 5.43, -26.53)
  await waitNextTick()

  // UI
  gameInstance.uiController.loadingUI.finishLoading()
  // TODO: Database connection required - commenting out for testing
  if (shouldCreatePlayer) {
    // const result = await gameInstance.uiController.startPlayerCreation()
    // playerInfoResponse = await GetPlayerInfo()

    // const failedCreation = !(playerInfoResponse?.player !== null)
    // if (failedCreation) {
    //   gameInstance.uiController.displayAnnouncement(
    //     'Player creation failed',
    //     Color4.Red(),
    //     5
    //   )

    //   if (retry) {
    //     throw new Error('Player creation failed after retry')
    //   } else {
    //     await init(true)
    //   }
    //   return
    // }

    // if (result.tutorial) {
    //   // TODO: assign first quest
    // }
    
    // For testing without database, create a mock player
    playerInfoResponse = {
      player: {
        race: 0, // Default race
        skill: 0, // Default class
        alliance: 0, // Default alliance
        player_id: 'test-player',
        userInfo: {
          username: 'TestPlayer'
        }
      }
    }
  }

  // TODO: Database connection required - commenting out for testing
  if (playerInfoResponse?.player == null) {
    console.error('Player not found')
    if (retry) {
      throw new Error('Player creation failed after retry')
    } else {
      await init(true)
    }
    return
  }

  // TODO: Database connection required - commenting out for testing
  // const [inventory, levels] = await Promise.all([
  //   GetPlayerInventory(),
  //   GetPlayerLevels()
  // ])
  
  // Mock data for testing without database
  const inventory = { 
    computed_player_inventory: [] as Array<{ itemId: string; count: number }> 
  }
  const levels = { 
    levels: [] as Array<{ level_type: string; level: number; xp: number }> 
  }

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

  // Apply wearable stats
  const wearables = getWearables()
  const wearableStats = getWearablesEffects(wearables)
  applyWearableStatsEffect({}, wearableStats)

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
