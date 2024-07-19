import { LEVEL_TYPES } from '../player/LevelManager'
import { ensurePlayer } from '../utils/wallet'
import { getData, postData, updateData } from './core'
import { type QuestType } from './types'

const QUESTS_SERVICE_BASE_URL = `https://640sy1ms60.execute-api.us-east-1.amazonaws.com`

export async function GetPlayerDungeonEasyLeaderBoard(): Promise<unknown> {
  return await getData(`/api/rest/dng-easy`)
}

export async function LogInventoryToServer(
  actionType: string,
  itemId: string,
  count: number
): Promise<void> {
  const myPlayer = await ensurePlayer()
  await postData(`/api/rest/item/action/${myPlayer.userId}`, {
    actionType,
    itemId,
    count
  })
}

export async function GetPlayerInventory(): Promise<unknown> {
  const { userId } = await ensurePlayer()
  return await getData(`/api/rest/inventory/${userId}`)
}

export async function GetPlayerLandedLogs(): Promise<unknown> {
  const { userId } = await ensurePlayer()
  return await getData(`/api/rest/all_logs/${userId}`)
}

export async function LogPlayerLanded(
  playerId: string,
  timestamp: unknown
): Promise<void> {
  console.log('in api: ', playerId, timestamp)
  await postData(`/api/rest/landed_log`, {
    timestamp,
    playerId
  })
}

export async function GetPlayerLevels(): Promise<unknown> {
  const { userId } = await ensurePlayer()
  return await getData(`/api/rest/level/${userId}`)
}

export async function GetPlayerLevelLeaderboards(
  levelType: LEVEL_TYPES = LEVEL_TYPES.PLAYER
): Promise<unknown> {
  return await getData(`/api/rest/leaderbaord/levels/${levelType}`)
}

export async function WriteXpToServer(
  levelType: string,
  level: number,
  xp: number,
  total: number
): Promise<void> {
  const { userId } = await ensurePlayer()

  await postData(`/api/rest/level/${levelType}/xp/${userId}/add`, {
    level,
    xp,
    total
  })
}

export enum ACTION_LOG_TYPES {
  WOOD_CUT = 'WOOD_CUT',
  MINE_ROCK = 'MINE_ROCK',
  MEAT_GATHER = 'MEAT_GATHER',
  BONE_COLLECTED = 'BONE_COLLECTED',
  DUNGEON_RUN = 'DUNGEON_RUN'
}

export async function writeActionLogToServer(
  actionName: string
): Promise<void> {
  const { userId } = await ensurePlayer()
  await postData(`/api/rest/action/${userId}/${actionName}`)
}

export async function writeDungeonActionLogToServer(
  actionName: string
): Promise<void> {
  const { userId } = await ensurePlayer()
  await postData(`/api/rest/dungeon/${userId}/${actionName}`)
}

export async function GetPlayerDungeonCount(): Promise<unknown> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/dungeonCount/${userId}`)
}

export async function GetPlayerDungeonCountEasy(): Promise<unknown> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/dng-easy/${userId}`)
}

// Dungeons Easy Stage
export async function AddPlayerDungeonCountEasy(
  dngCompleted: unknown
): Promise<void> {
  const { userId, name } = await ensurePlayer()

  await postData(`/api/rest/dng-easy`, {
    dng_completed: dngCompleted,
    action_name: 'test_action',
    username: name,
    player_id: userId
  })
}

// Dungeons Easy Stage
export async function updatePlayerDungeonCountEasy(
  dngCompleted: unknown
): Promise<unknown> {
  // api/rest/rounds/:playerID
  const { userId } = await ensurePlayer()
  return await updateData(`/api/rest/dng-easy`, {
    player_id: userId,
    dng_completed: dngCompleted
  })
}

// writeActionLogToServer(ACTION_LOG_TYPES.MINE_ROCK)

export async function AddPlayerEquipableItem({
  itemType,
  itemId,
  equipped = true
}: {
  itemType: string
  itemId: string
  equipped: boolean
}): Promise<void> {
  const { userId } = await ensurePlayer()

  await postData(`/api/rest/item/equip/${userId}`, {
    item_type: itemType,
    item_id: itemId,
    equipped
  })
}

export async function RemovePlayerEquipableItem({
  itemType,
  itemId
}: {
  itemType: unknown
  itemId: string
}): Promise<void> {
  const { userId } = await ensurePlayer()

  await postData(`/api/rest/item/${userId}/equip/${itemId}`, {
    equipped: false
  })
}

export async function GetPlayerEquipItems(): Promise<unknown> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/item/equip/${userId}`)
}

export async function GetPlayerEquippedItems(): Promise<unknown> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/item/equip/${userId}/equiped`)
}

export async function AddPetToPlayer(petType: string): Promise<void> {
  const { userId } = await ensurePlayer()

  await postData(`/api/rest/pet/${userId}/${petType}`)
}

export async function GetPlayerTotalCompletedQuests(): Promise<unknown> {
  const { userId } = await ensurePlayer()
  const response: {
    value?: Array<{ count: number }>
  } = await getData(`/api/rest/quests/completed/${userId}/count`)

  if (
    response?.value !== undefined &&
    Array.isArray(response.value) &&
    response.value.length > 0
  ) {
    return response.value[0].count
  } else {
    return 0
  }
}

export async function GetPlayerPets(): Promise<unknown> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/pet/${userId}`)
}

export async function AddAvatarModels(
  model: string,
  weight: number = 0
): Promise<void> {
  const { userId } = await ensurePlayer()

  await postData(`/api/rest/player/${userId}/avatar`, {
    model,
    weight
  })
}
export async function GetPlayerAvatars(): Promise<{
  models: Array<{ file: string; weight: number }>
}> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/player/${userId}/avatar`)
}

export async function CreatePlayer(
  alliance: number,
  race: number,
  skill: number
): Promise<void> {
  const { userId } = await ensurePlayer()

  const response = await postData(`/api/rest/player/${userId}/info`, {
    alliance,
    race,
    skill
  })

  console.log('CreatePlayer response', response)
}

export async function GetPlayerInfo(): Promise<{
  error?: any
  player?: {
    alliance: number
    player_id: string
    race: number
    skill: number
    userInfo: {
      username: string
    }
  }
}> {
  const { userId } = await ensurePlayer()

  return await getData(`/api/rest/player/${userId}/info`)
}

/**
 * Gets a list of today's quests and all the details for those quests
 * @returns : QuestType[] - The array of quests
 */
export async function GetTodaysQuests(): Promise<QuestType[]> {
  const { userId } = await ensurePlayer()

  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/get_today_quests/${userId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow' // manual, *follow, error
    }
  )
  if (response.status !== 200) throw new Error('Problem getting todays quests!')

  return await response.json()
}

/**
 * Server side validation which confirms if the user can claim the reward
 * for an individual quest
 * @param questId : number - The quest id for which the user is trying to claim reward
 * @returns : boolean - Whether the user can claim the reward or not
 */
export async function CanUserClaimReward(questId: number): Promise<boolean> {
  const { userId } = await ensurePlayer()
  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/claim_reward_request/${userId}/${questId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow' // manual, *follow, error
    }
  )
  if (response.status !== 200) return false
  return true
}

/**
 * Server side validation which confirms if the user can claim the bonus reward
 * for completing all quests today
 * @returns : boolean - Whether the user can claim the bonus reward
 */
export async function CanUserClaimBonusReward(): Promise<boolean> {
  const { userId } = await ensurePlayer()
  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/claim_bonus_reward_request/${userId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow' // manual, *follow, error
    }
  )
  if (response.status !== 200) return false
  return true
}

/**
 * Updates the progress of a player's quest to the DB
 * @param questId : number - The id for the quest for which the progress needs to be updated
 * @param progress : number - The latest progress which needs to be updated to the DB
 * @returns : boolean - The server returns whether the quest has been completed or not
 */
export async function UpdatePlayerQuestLog(
  questId: number,
  progress: number
): Promise<boolean> {
  const { userId } = await ensurePlayer()
  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/patch_player_quest_log`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow', // manual, *follow, error
      body: JSON.stringify({
        playerId: userId,
        questId,
        progress
      })
    }
  )
  if (response.status !== 200)
    throw new Error('Something went wrong while updating quest progress')
  const data = await response.json()
  return data.has_completed
}

export async function WriteUserUsername(): Promise<void> {
  const { userId, name } = await ensurePlayer()

  await postData(`/api/rest/userinfo/${userId}/add`, {
    username: name
  })
}
