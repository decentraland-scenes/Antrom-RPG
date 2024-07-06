import * as utils from '@dcl-sdk/utils'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import { setPlayerPosition } from '../../utils/engine'
import Canvas from '../canvas/Canvas'

export class LoadingUI {
  public isLoading: boolean
  public isVisible: boolean
  public timer: number = 2
  private readonly uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isLoading = true
    this.isVisible = true

    utils.timers.setTimeout(() => {
      this.isLoading = false
    }, 2000)
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
            onMouseDown={() => {
              this.uiController.playDungeonUI.setVisibility(true)
              this.isVisible = false
              setPlayerPosition(-22.21, 5.43, -26.53)
            }}
          />
        </UiEntity>
      </Canvas>
    )
  }
}
