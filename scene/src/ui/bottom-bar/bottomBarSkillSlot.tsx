import {
  PointerEventType,
  UiCanvasInformation,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { InputKeys, getUvs } from '../../utils/ui-utils'
import type { skillSlotData, skillSlotProps } from './skillsData'

export function BottomBarSkillSlot({
  slotsData,
  onClick,
  index
}: skillSlotProps): ReactEcs.JSX.Element | null {
  if (slotsData === undefined) {
    return null
  }
  if (slotsData[index] === undefined) {
    return null
  }
  const slot: skillSlotData = slotsData[index]
  if (slot.skill === undefined) {
    return null
  }
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  engine.addSystem(() => {
    if (inputSystem.isTriggered(slot.hotKey, PointerEventType.PET_DOWN)) {
      onClick(index)
    }
  })

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(slot.skill.sprite),
        texture: { src: slot.skill.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        onClick(index)
        console.log('Need to implement cooldown and execute the skill code')
      }}
    >
      <UiEntity
        uiTransform={{
          display: slot.isCooling ? 'flex' : 'none',
          width: '100%',
          height: `${(slot.cooldownTime / slot.skill.cooldown) * 100}%`,
          positionType: 'absolute',
          position: { bottom: 0 }
        }}
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.8)
        }}
      />
      <UiEntity
        uiTransform={{
          display: slot.isCooling ? 'flex' : 'none',
          width: '100%',
          height: '100%',
          positionType: 'absolute',
          position: { bottom: 0 }
        }}
        uiText={{
          value: slot.cooldownTime.toFixed(0).toString(),
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
          value: InputKeys[slot.hotKey],
          fontSize: canvasInfo.height * 0.02,
          textAlign: 'top-left',
          color: slot.isCooling ? Color4.Red() : Color4.White()
        }}
      />
    </UiEntity>
  )
}
