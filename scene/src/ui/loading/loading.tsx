import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/Canvas'

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
            onMouseDown={() => {
              this.isVisible = false
              console.log('clicked')
            }}
          />
        </UiEntity>
      </Canvas>
    )
  }
}
