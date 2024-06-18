import { engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  UiEntity
} from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from '~system/RestrictedActions'
import { Vector3 } from '@dcl/sdk/math'

export class LoadingUI {
  public isLoading: boolean
  public isVisible: boolean
  public timer: number = 2
  private readonly uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isLoading = true
    this.isVisible = true
    this.loadingSystem(2000)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  mainUi() {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          display: this.isVisible ? 'flex' : 'none',
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
            void movePlayerTo({
              newRelativePosition: Vector3.create(0, 0, 0)
            })
          }}
        />
      </UiEntity>
    )
  }

  loadingSystem(dt: number):void {
    utils.timers.setTimeout(() => {
      if (this.timer - dt <= 0 && this.isLoading) {
        this.isLoading = false
        this.timer = 2
        engine.removeSystem(this.loadingSystem)
      } else {
        this.timer = this.timer - dt
      }
    }, dt)
  }
}
