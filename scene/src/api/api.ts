import { signedFetch } from '~system/SignedFetch'
import { getUserData } from '~system/UserIdentity'
import { getPlayer } from '@dcl/sdk/src/players'

// const REDEEM_BASE_URL = `http://localhost:3000`;
const REDEEM_BASE_URL = `https://ipwpq4k3zi.execute-api.us-east-1.amazonaws.com`
const BASE_URL = `https://7ky6d8fqz1.execute-api.us-east-1.amazonaws.com`
const QUESTS_SERVICE_BASE_URL = `https://640sy1ms60.execute-api.us-east-1.amazonaws.com`

export const GetPlayerDungeonEasyLeaderBoard = async () => {
  return await getData(`/api/rest/dng-easy`)
}

export async function getData(url: string, headers = {}) {
  // Default options are marked with *
  const response = await signedFetch({
    url: `${BASE_URL}${url}`,
    init: {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    }
  })
  return JSON.parse(response.body) // parses JSON response into native JavaScript objects
}
export const LogInventoryToServer = async (
  actionType: string,
  itemId: string,
  count: number
) => {
  const myPlayer = getPlayer()
  if (myPlayer) {
    const userId = myPlayer.userId
    await postData(`/api/rest/item/action/${userId}`, {
      actionType,
      itemId,
      count
    })
  }
}
export async function postData(url: string, data = {}) {}
