import ReactEcs, { Label, UiEntity } from '@dcl/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import Canvas from '../canvas/Canvas'

export class ConfirmAndSendLoot {
  uiController: UIController
  isVisible: boolean = true
  lootRarity: string = ''
  name: string = ''
  urn: string = ''
  lootImage: string = ''
  chicken: number = 0
  wood: number = 0
  iron: number = 0
  bone: number = 0
  amount: number = 0

  lootUI: string = `assets/images/wearables/${this.lootImage}.png`
  lootUIText: string = `You received a \n${this.lootRarity}\nitem from loot!\n\n${this.name}`
  lootUITextQuestion: string = `Would you like to open it?`
  lootExitButton: string = 'assets/images/loot/exit.png'
  lootDeclineButton: string = 'assets/images/loot/decline.png'
  lootAcceptButton: string = 'assets/images/loot/accept.png'
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  setLootParameters(
    lootRarity: string,
    name: string,
    urn: string,
    lootImage: string,
    chicken: number,
    wood: number,
    iron: number,
    bone: number,
    amount: number
  ): void {
    this.lootRarity = lootRarity
    this.name = name
    this.urn = urn
    this.lootImage = lootImage
    this.chicken = chicken
    this.wood = wood
    this.iron = iron
    this.bone = bone
    this.amount = amount
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
            position: { top: '20%', right: '0%' },
            display: this.isVisible ? 'flex' : 'none'
          }}
        >
          <UiEntity
            uiTransform={{
              width: (canvasInfo.height * 0.8) / 1.49,
              height: canvasInfo.height * 0.6,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/loot/lootFrame.png' }
            }}
          >
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { top: '15%', left: '0%' },
                width: '100%',
                height: '11.3%'
              }}
              value={this.lootUIText}
              textAlign="bottom-center"
              fontSize={canvasInfo.height * 0.02}
            />
            {/* Loot UI */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { top: '30%', left: '29%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.2
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: this.lootUI }
              }}
            />
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '23%', left: '0%' },
                width: '100%',
                height: '11.3%'
              }}
              value={this.lootUITextQuestion}
              textAlign="bottom-center"
              fontSize={canvasInfo.height * 0.02}
            />
            {/* Accept Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '10%', left: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: this.lootAcceptButton }
              }}
              onMouseDown={() => {}}
            />
            {/* Decline Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { bottom: '10%', right: '8%' },
                width: (canvasInfo.height * 0.6) / 2.75,
                height: canvasInfo.height * 0.052
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: this.lootDeclineButton }
              }}
              onMouseDown={() => {}}
            />
            {/* Exit Button */}
            <UiEntity
              uiTransform={{
                positionType: 'absolute',
                position: { top: '4%', right: '6%' },
                width: (canvasInfo.height * 0.6) / 20,
                height: canvasInfo.height * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: this.lootExitButton }
              }}
              onMouseDown={() => {}}
            />
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
