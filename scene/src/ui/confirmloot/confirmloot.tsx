import ReactEcs, { Label, UiEntity } from '@dcl/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/Canvas'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'

export type ConfirmLootType = {
  item: string
  amount: number
  currency: 'dungeonToken' | 'mana'
  onConfirmCallback?: () => void
}
export class ConfirmLoot {
  uiController: UIController
  public isVisible: boolean = false
  public payClaim_visible: boolean = true
  public payClaimUnavail_visible: boolean = false
  public declineLoot_visible: boolean = true
  public declineLootUnavail_visible: boolean = false
  private lootItem = ''
  private payAmount = 0
  private callback(): any {}
  private currencyType: 'dungeonToken' | 'mana' = 'dungeonToken'
  public confirmLootText_value: string = `Are you sure you want to claim the\n${this.lootItem} for ${this.payAmount} ${this.currencyType}?`
  public confirmLootText_visible = true
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  mainUi(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.width,
            height: canvasInfo.height,
            justifyContent: 'center',
            positionType: 'absolute',
            position: { top: '33%', right: '0%' },
            display: this.isVisible ? 'flex' : 'none'
          }}
        >
          <UiEntity
            uiTransform={{
              width: (canvasInfo.height * 0.8) / 1.49,
              height: canvasInfo.height * 0.3,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/confirmLoot/confirmLoot.png' }
            }}
          >
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { top: '49%', left: '0%' },
                width: '100%',
                height: '11.3%'
              }}
              value={this.confirmLootText_value}
              textAlign="bottom-center"
              fontSize={20}
            />
            {/* Play & Claim Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '16%', left: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052,
                display: this.payClaim_visible ? 'flex' : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/confirmLoot/payClaim.png' }
              }}
              onMouseDown={() => {
                this.confirmLoot({
                  item: this.lootItem,
                  amount: this.payAmount,
                  currency: this.currencyType
                })
              }}
            />
            {/* Play & Claim Unavail Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '16%', left: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052,
                display: this.payClaimUnavail_visible ? 'flex' : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: 'assets/images/confirmLoot/payClaimUnavail.png'
                }
              }}
              onMouseDown={() => {}}
            />
            {/* Decline Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '16%', right: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052,
                display: this.declineLoot_visible ? 'flex' : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/confirmLoot/declineLoot.png' }
              }}
              onMouseDown={() => {
                this.isVisible = false
              }}
            />
            {/* Decline Button Unavail */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '16%', right: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052,
                display: this.declineLootUnavail_visible ? 'flex' : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: 'assets/images/confirmLoot/declineLootUnavail.png'
                }
              }}
              onMouseDown={() => {}}
            />
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  visible(): boolean {
    return this.isVisible
  }

  openConfirmLoot(confirmLoot: ConfirmLootType): void {
    this.lootItem = confirmLoot.item
    this.payAmount = confirmLoot.amount
    this.currencyType = confirmLoot.currency
    this.isVisible = true
    this.confirmLootText_value = `Are you sure you want to claim the\n${this.lootItem} for ${this.payAmount} ${this.currencyType}?`
    this.confirmLootText_visible = true

    this.payClaim_visible = true
    this.declineLoot_visible = true
  }

  confirmLoot(confirmLoot: ConfirmLootType): void {
    const player = Player.getInstance()
    // Hide UI elements
    this.hideConfirmLootUI()

    if (confirmLoot.currency === 'dungeonToken') {
      this.useItemsForTokens(player, confirmLoot.amount)
    }

    if (confirmLoot.currency === 'mana') {
      // Take MANA
    }

    if (confirmLoot !== null) {
      console.log('YEEEES', this.uiController.confirmAndSendLoot.urn)
      void this.uiController.gameController.sendWearable.send(
        this.uiController.confirmAndSendLoot.urn,
        {
          chicken: 0,
          wood: 0,
          iron: 0,
          bone: 0
        }
      )
    }
  }

  hideConfirmLootUI(): void {
    this.isVisible = false
    this.payClaim_visible = false
    this.payClaimUnavail_visible = false
    this.declineLoot_visible = false
    this.declineLootUnavail_visible = false
    this.confirmLootText_visible = false
  }

  useItemsForTokens(player: Player, totalTokensNeeded: number): void {
    const iceShardCount = player.inventory.getItemCount(ITEM_TYPES.ICESHARD)
    const iceHeartCount = player.inventory.getItemCount(ITEM_TYPES.ICEHEART)

    let tokensFormed = 0
    let shardsUsed = 0
    let heartsUsed = 0

    while (
      tokensFormed < totalTokensNeeded &&
      (shardsUsed < iceShardCount || heartsUsed < iceHeartCount)
    ) {
      if (shardsUsed < iceShardCount) {
        shardsUsed++
        tokensFormed++
      } else if (heartsUsed < iceHeartCount) {
        heartsUsed++
        tokensFormed++
      }
    }

    if (tokensFormed === totalTokensNeeded) {
      if (shardsUsed > 0)
        player.inventory.reduceItem(ITEM_TYPES.ICESHARD, shardsUsed)
      if (heartsUsed > 0)
        player.inventory.reduceItem(ITEM_TYPES.ICEHEART, heartsUsed)
      console.log(
        `Used ${shardsUsed} Ice Shards and ${heartsUsed} Ice Hearts to form ${tokensFormed} tokens.`
      )
    } else {
      console.log('Not enough items to form the required number of tokens.')
    }
  }
}
