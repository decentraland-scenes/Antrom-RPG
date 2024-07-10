import {
  PointerEventType,
  UiCanvasInformation,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import {
  type Sprite,
  type slotsInputs,
  getUvs,
  InputKeys
} from '../../utils/ui-utils'



export default class BottomBarSkillSlot {
  public skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  public hotKey: slotsInputs | undefined
  public cooldownTime: number = 0
  // public progressOne: number = 0
  public isCooling: boolean = false

  constructor(skill:{ cooldown: number; name: string; sprite: Sprite }) {
    this.skill = skill
    const uiComponent = (): Array<ReactEcs.JSX.Element | null> => [
      this.bottomBarSlotUI()
    ]
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }

  onClick(): void {
    if (!this.isCooling && this.skill !== undefined) {
      this.cooldownTime = this.skill.cooldown
      this.isCooling = true
      engine.addSystem(
        this.cooldownSystemSlotOne.bind(this),
        1,
        this.skill.name
      )
    }
  }

  cooldownSystemSlotOne(dt: number): void {
    if (this.skill !== undefined) {
      if (
        this.cooldownTime - dt >= 0 &&
        this.isCooling
      ) {
        this.cooldownTime = this.cooldownTime - dt
      } else {
        this.isCooling = false
        engine.removeSystem(this.skill.name)
      }
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
              display: this.isCooling ? 'flex' : 'none',
              width: '100%',
              height: `${(this.cooldownTime / this.skill.cooldown) * 100}%`,
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiBackground={{
              color: Color4.create(0, 0, 0, 0.8)
            }}
          />
          <UiEntity
            uiTransform={{
              display: this.isCooling ? 'flex' : 'none',
              width: '100%',
              height: '100%',
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiText={{
              value: this.cooldownTime.toFixed(0).toString(),
              fontSize: canvasInfo.height * 0.02,
              textAlign: 'middle-center'
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
              color: this.isCooling ? Color4.Red() : Color4.White()
            }}
          />
        </UiEntity>
      )
    } else return null
  }
}

export let gameUi: BottomBarSkillSlot
export function main(skill:{ cooldown: number; name: string; sprite: Sprite }): void {
  // all the initializing logic
  gameUi = new BottomBarSkillSlot(skill)
}
