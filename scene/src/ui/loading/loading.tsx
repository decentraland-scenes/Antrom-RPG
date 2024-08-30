import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/Canvas'
import { setupWebSocket } from '../../wssServer/websocketService'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { getPlayer } from '@dcl/sdk/src/players'
import { getRealm } from '~system/Runtime'

const ws = setupWebSocket()

export class LoadingUI {
  private isLoading: boolean
  private isVisible: boolean
  public timer: number = 2

  private readonly uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isLoading = false
    this.isVisible = false
  }

  startLoading(): void {
    this.isLoading = true
    this.isVisible = true
  }

  finishLoading(): void {
    this.isLoading = false
  }

  visible(): boolean {
    return this.isVisible
  }

  mainUi(): ReactEcs.JSX.Element {
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: 'assets/images/nightmare.png' }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '800',
              height: '550',
              display: 'flex'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/Hide_seek.png' }
            }}
          />
          <UiEntity
            uiTransform={{
              width: '500',
              height: '250',
              display: this.isLoading ? 'flex' : 'none'
            }}
            uiBackground={{
              texture: {
                wrapMode: 'repeat',
                src: 'assets/images/zombieLoading.png'
              }
            }}
          />
          <UiEntity
            uiTransform={{
              width: '250',
              height: '250',
              display: this.isLoading ? 'none' : 'flex',
              alignItems: 'flex-end'
            }}
            uiBackground={{ texture: { src: 'assets/images/classic.png' } }}
            onMouseDown={async () => {
              this.isVisible = false
              console.log('clicked')

              const playerData = await getPlayer()
              const { realmInfo } = await getRealm({})
              const player = Player.getInstance()
              let playerEther = player.inventory.getItemCount(ITEM_TYPES.GEM4)
              let playerHp = player.health
              let playerLevel = Player.getInstance().levels.getLevel(
                LEVEL_TYPES.PLAYER

              )

              let currentClass: any

              const playerClasses = {
                  cleric: "CLERIC",
                  mage: "MAGE",
                  thief: "THIEF",
                  ranger: "RANGER",
                  berserker: "BERSERKER",
                  default: "CLASS",
              }

              if (player.class === 0) {
                currentClass = playerClasses.cleric
            } else if (player.class === 1) {
                currentClass = playerClasses.mage
            } else if (player.class === 2) {
                currentClass = playerClasses.thief
            } else if (player.class === 3) {
                currentClass = playerClasses.ranger
            } else if (player.class === 4) {
                currentClass = playerClasses.berserker
            } else {
                //log("Player class not Found using default")
                currentClass = playerClasses.default
            }
    

  
              ws.send(
                  JSON.stringify({
                      type: "initRoom",
                      userId: playerData?.userId,
                      playerName: playerData?.name,
                      realm: realmInfo?.realmName,
                      playerClass: currentClass,
                      playerLevel: playerLevel,
                      playerHp: playerHp,
                      playerEther: playerEther,
                  })
              )
            }}
          />
        </UiEntity>
      </Canvas>
    )
  }
}
