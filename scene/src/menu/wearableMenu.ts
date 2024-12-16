import { getPlayer } from '@dcl/sdk/src/players'
import * as eth from 'eth-connect'
import { postDataNoBase } from '../api/core'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { Player } from '../player/player'
const LAMBDA_URL = 'https://81klj3f0g9.execute-api.us-east-1.amazonaws.com'

export const sendWearable = async (urn: any, resources: any): Promise<void> => {
  const userData = getPlayer()
  const userId = userData?.userId
  const data = eth.toHex(`urn=${urn}&uuid=${userId}`)
  console.log(data)
  // TODO const loading = new UI.LoadingIcon()
  const { chicken, bone, wood, iron } = resources
  try {
    const txn = (await postDataNoBase(`${LAMBDA_URL}/dispense`, {
      urn
    })) as any
    // Stop execution if there's been an error
    console.log(txn.text)

    // TODO  loading.hide()

    const json = await txn.text
    if (json === 'Limit Reached') {
      // const instructions = new UI.CustomPrompt(UI.PromptStyles.DARK, 500)
      // instructions.addText(
      //     "\n\nYou have reached the limit\n\nof 15 NFTs for this set",
      //     0,
      //     60,
      //     Color4.White(),
      //     30
      // )
      return // instructions.show()
    }
    if (json === 'No Remaining Items') {
      // const instructions = new UI.CustomPrompt(UI.PromptStyles.DARK, 500)
      // instructions.addText(
      //     "\n\nThere are no remaining items",
      //     0,
      //     60,
      //     Color4.White(),
      //     30
      // )
      return // instructions.show()
    }
    if (json === 'Error: please try again') return
    if (json === 'Gas price too high.') {
      // this.gameController.displayAnnouncement("Gas price too high.", 5)
      return
    }
    const player = Player.getInstance()
    player.inventory.reduceItem(ITEM_TYPES.BONE, bone)
    player.inventory.reduceItem(ITEM_TYPES.CHICKEN, chicken)
    player.inventory.reduceItem(ITEM_TYPES.TREE, wood)
    player.inventory.reduceItem(ITEM_TYPES.ROCK, iron)
    // TODO await player.writeDataToServer()
    // const instructions = new UI.CustomPrompt(UI.PromptStyles.DARK, 500)
    // instructions.addText(
    //     "You minted a wearable!\n\nCheck it out on-chain.",
    //     0,
    //     60,
    //     Color4.White(),
    //     30
    // )
    // instructions.addButton(
    //     "View txn",
    //     -110,
    //     -110,
    //     () => {
    //         openExternalURL(`https://polygonscan.com/tx/${json}`)
    //     },
    //     UI.ButtonStyles.ROUNDGOLD
    // )
    // instructions.addButton(
    //     "Cancel",
    //     110,
    //     -110,
    //     () => {
    //         instructions.hide()
    //     },
    //     UI.ButtonStyles.RED
    // )

    return json
  } catch (e) {
    console.log('Error minting wearable', e)
    // loading.hide()
  }
}
