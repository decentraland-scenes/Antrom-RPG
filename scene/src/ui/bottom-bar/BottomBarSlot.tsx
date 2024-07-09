import { PointerEventType, UiCanvasInformation, engine, inputSystem } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { type Sprite, type slotsInputs, getUvs, InputKeys } from '../../utils/ui-utils'


export class UI {
  public skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  public hotKey: slotsInputs | undefined
  public progress: number = 0
  public cooldownTimeOne: number = 0
  public progressOne: number = 0
  public oneIsCooling: boolean = false
 

  constructor() {
    const uiComponent = (): Array<ReactEcs.JSX.Element | null> => [this.bottomBarSlotUI()]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  onClick(): void {
    if (!this.oneIsCooling && this.skill !== undefined) {
      this.cooldownTimeOne = this.skill.cooldown
      this.oneIsCooling = true
      engine.addSystem(
        this.cooldownSystemSlotOne.bind(this),
        1,
        'slotOneSystem'
      )
    }
  }

  cooldownSystemSlotOne(dt: number): void {
    if (this.cooldownTimeOne - dt >= 0 && this.oneIsCooling && this.skill !== undefined) {
      this.cooldownTimeOne = this.cooldownTimeOne - dt
    } else {
      this.oneIsCooling = false
      this.progressOne = 0
      engine.removeSystem('slotOneSystem')
    }
  }

  bottomBarSlotUI(): ReactEcs.JSX.Element | null {

    if (this.skill === undefined) {
      return null
    }

    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)  
    if (canvasInfo === null) return null
    engine.addSystem(() => {
      if (this.skill !== undefined && this.hotKey !== undefined) {
        if (inputSystem.isTriggered(this.hotKey, PointerEventType.PET_DOWN)) {
          this.onClick()
        }
      }
      })
    
    
    if (this.skill !== undefined && this.hotKey !== undefined) {
      return (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            display: 'flex'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(this.skill.sprite),
            texture: { src: this.skill.sprite.atlasSrc }
          }}
          onMouseDown={() => {
            
            this.onClick()
            console.log('Need to implement cooldown and execute the skill code')
          }}
        >
          <UiEntity
            uiTransform={{
              // display: isCooling ? 'flex' : 'none',
              width: '100%',
              height: `${this.progress}%`,
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiBackground={{
              color: Color4.create(0, 0, 0, 0.8)
            }}
          />
          <UiEntity
            uiTransform={{
              display: (this.cooldownTimeOne / this.skill.cooldown) * 100 > 0 ? 'flex' : 'none',
              width: '100%',
              height: '100%',
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiText={{
              value: (this.cooldownTimeOne).toFixed(0).toString(),
              fontSize: canvasInfo.height * 0.02
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              positionType: 'absolute'
            }}
            uiText={{
              value: InputKeys[this.hotKey],
              fontSize: canvasInfo.height * 0.02,
              textAlign: 'top-left',
              color: (this.cooldownTimeOne / this.skill.cooldown) * 100 > 0 ? Color4.Red() : Color4.White()
            }}
          />
        </UiEntity>
      )
  
    } else return null

    }
  }


export let gameUi: UI
export function main(): void {
  // all the initializing logic
  gameUi = new UI()
}
