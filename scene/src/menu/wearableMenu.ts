import { getPlayer } from '@dcl/sdk/src/players'
import { postDataNoBase } from '../api/core'
import { ITEM_TYPES } from '../inventory/playerInventoryMap'
import { Player } from '../player/player'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import { openExternalUrl } from '~system/RestrictedActions'
import { type GameController } from '../controllers/game.controller'

export class SendWearable {
  private readonly LAMBDA_URL: string =
    'https://81klj3f0g9.execute-api.us-east-1.amazonaws.com'

  private readonly data: string = ''
  public instructions: ui.CustomPrompt
  public loading: ui.LoadingIcon
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.instructions = ui.createComponent(ui.CustomPrompt, {
      style: ui.PromptStyles.DARK,
      height: 500
    })
    this.loading = ui.createComponent(ui.LoadingIcon, {})
  }

  async send(urn: any, resources: any): Promise<void> {
    const userData = getPlayer()
    const userId = userData?.userId
    console.log('dataaaaaaaaaaaaaaaaa ', userId)
    // eth.toHex(`urn=${urn}&uuid=${userId}`)
    const { chicken, bone, wood, iron } = resources
    try {
      console.log('here')
      const txn = (await postDataNoBase(`${this.LAMBDA_URL}/dispense`, {
        urn
      })) as any
      // Stop execution if there's been an error

      this.loading.hide()

      const json = await txn.text
      console.log(json, '---------HERE')
      if (json === 'Limit Reached') {
        this.instructions.addText({
          value: '\n\nYou have reached the limit\n\nof 15 NFTs for this set',
          xPosition: -200,
          yPosition: 60,
          color: Color4.White(),
          size: 30
        })
        this.instructions.show()
        return
      }
      if (json === 'No Remaining Items') {
        this.instructions.addText({
          value: '\n\nThere are no remaining items',
          xPosition: -200,
          yPosition: 60,
          color: Color4.White(),
          size: 30
        })

        this.instructions.show()
        return
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
      console.log('THIIIIIIIS POINT!')
      this.instructions.addText({
        value: 'You minted a wearable!\n\nCheck it out on-chain.',
        xPosition: -200,
        yPosition: 60,
        color: Color4.White(),
        size: 30
      })
      this.instructions.addButton({
        style: ui.ButtonStyles.ROUNDGOLD,
        text: 'View txn',
        xPosition: -110,
        yPosition: -110,
        onMouseDown: () => {
          void openExternalUrl({ url: `https://polygonscan.com/tx/${json}` })
        }
      })
      this.instructions.addButton({
        style: ui.ButtonStyles.ROUNDGOLD,
        text: 'Cancel',
        xPosition: 110,
        yPosition: -110,
        onMouseDown: () => {
          this.instructions.hide()
        }
      })
      this.instructions.show()

      return json
    } catch (e) {
      console.log('Error minting wearable', e)
      this.loading.hide()
    }
  }
}
