// type for the schema of a fetched quest
export type QuestType = {
  id: number
  target_item: string
  target_quantity: number
  description: string
  rewards: Array<[string, number]>
  progress: number
  has_completed: boolean
  is_reward_claimed: boolean
  is_bonus_reward_claimed: boolean
}
