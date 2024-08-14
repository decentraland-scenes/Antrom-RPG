import { getPlayer } from '@dcl/sdk/src/players'
import {
  type WearableItem,
  WEARABLES_MAPPING,
  type WearableString,
  type WearableType
} from '../../ui/inventory/inventoryData'
import { type Stats, WearablesConfig } from '../wearables-config'
import { Player } from '../player'

function getWearablesFromArray(
  array: WearableType[]
): [WearableItem, WearableType] | null {
  const playerWearables = getPlayer()?.wearables ?? []

  for (const key of array) {
    const wearableString = key.name as WearableString
    if (checkItem(playerWearables, key.name)) {
      const { stats, duplicates, dStats, urn, label } =
        WEARABLES_MAPPING[wearableString]
      return [
        {
          label,
          stats,
          duplicates,
          dStats,
          urn
        },
        key
      ]
    }
  }
  return null
}

function checkItem(wearables: string[], key: string): boolean {
  if (!(key in WEARABLES_MAPPING)) return false
  const { urn } = WearablesConfig.mapping[key]
  let result = false
  for (let wearable of wearables) {
    // temp fix for DCL urn bug
    const w = wearable.split(':')
    if (w.length > 6) wearable = w.slice(0, -1).join(':')
    if (wearable === urn) {
      result = true
    }
  }
  return result
}

export function getWearables(): Array<[WearableItem, WearableType]> {
  const head = WearablesConfig.wearables.head
  const body = WearablesConfig.wearables.body
  const legs = WearablesConfig.wearables.legs
  const feet = WearablesConfig.wearables.feet
  const mainhand = WearablesConfig.wearables.mainhand
  const offhand = WearablesConfig.wearables.offhand
  const extra = WearablesConfig.wearables.extra
  const crown = WearablesConfig.wearables.crown

  const wearables: Array<[WearableItem, WearableType] | null> = []
  wearables.push(getWearablesFromArray(head))
  wearables.push(getWearablesFromArray(body))
  wearables.push(getWearablesFromArray(legs))
  wearables.push(getWearablesFromArray(feet))
  wearables.push(getWearablesFromArray(mainhand))
  wearables.push(getWearablesFromArray(offhand))
  wearables.push(getWearablesFromArray(extra))
  wearables.push(getWearablesFromArray(crown))

  return wearables.filter((e) => {
    return e != null
  })
}

export function getWearablesEffects(
  wearables: Array<[WearableItem, WearableType]>
): Stats {
  const stats: any = {}

  for (const [wearable] of wearables) {
    const wearabldStats: any = wearable.dStats ?? {}
    const wearablStats: any = wearable.stats ?? {}
    const duplicates = wearable.duplicates ?? 0

    Object.keys(wearablStats).forEach((key) => {
      if (key in stats) {
        if (key in wearabldStats && duplicates > 0) {
          stats[key] += wearablStats[key] + wearabldStats[key] * duplicates
        } else {
          stats[key] += wearablStats[key]
        }
      } else {
        if (key in wearabldStats && duplicates > 0) {
          stats[key] = wearablStats[key] + wearabldStats[key] * duplicates
        } else {
          stats[key] = wearablStats[key]
        }
      }
    })
  }

  const curatedStats: Stats = {
    luckBuff: 0,
    attackBuff: 0,
    defBuff: 0,
    health: 0,
    distance: 0,
    critRate: 0,
    critDamage: 0,
    magicBuff: 0
  }

  for (const key in curatedStats) {
    if (key in stats) {
      ;(curatedStats as any)[key] = stats[key]
    }
  }

  return stats
}

export function applyWearableStatsEffect(prevStats: Stats, stats: Stats): void {
  const player = Player.getInstance()
  if (player == null) return

  player.updateDefBuff((stats.defBuff ?? 0) - (prevStats.defBuff ?? 0))
  player.updateAtkBuff((stats.attackBuff ?? 0) - (prevStats.attackBuff ?? 0))
  player.updateLuckBuff((stats.luckBuff ?? 0) - (prevStats.luckBuff ?? 0))
  player.updateMaxHp((stats.health ?? 0) - (prevStats.health ?? 0))
  player.updateCritRate((stats.critRate ?? 0) - (prevStats.critRate ?? 0))
  player.critDamageBuff += (stats.critDamage ?? 0) - (prevStats.critDamage ?? 0)
  player.updateMagic((stats.magicBuff ?? 0) - (prevStats.magicBuff ?? 0))
}
