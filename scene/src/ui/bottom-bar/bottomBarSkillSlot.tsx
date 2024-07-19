import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { InputKeys, getUvs } from '../../utils/ui-utils'
import { type SkillSlotProps } from './skillsData'

export function BottomBarSkillSlot({
  slot,
  hotKey
}: SkillSlotProps): ReactEcs.JSX.Element | null {
  if (slot === undefined) {
    return null
  }
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(slot.definition.sprite),
        texture: { src: slot.definition.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        slot.trigger()
      }}
    >
      {slot.state.isCooling && (
        <UiEntity
          uiTransform={{
            display: slot.state.isCooling ? 'flex' : 'none',
            width: '100%',
            height: `${
              (slot.state.cooldownRemainingTime / slot.definition.cooldown) *
              100
            }%`,
            positionType: 'absolute',
            position: { bottom: 0 }
          }}
          uiBackground={{
            color: Color4.create(0, 0, 0, 0.8)
          }}
        />
      )}
      {slot.state.isCooling && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            positionType: 'absolute',
            position: { bottom: 0 }
          }}
          uiText={{
            value: slot.state.cooldownRemainingTime.toFixed(1).toString(),
            fontSize: canvasInfo.height * 0.016,
            textAlign: 'middle-center'
          }}
        />
      )}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiText={{
          value: InputKeys[hotKey],
          fontSize: canvasInfo.height * 0.02,
          textAlign: 'top-left',
          color: slot.state.isCooling ? Color4.Red() : Color4.White()
        }}
      />
    </UiEntity>
  )
}
