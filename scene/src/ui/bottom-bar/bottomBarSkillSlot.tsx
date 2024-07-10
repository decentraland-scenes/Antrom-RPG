import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import {
  InputKeys,
  getUvs,
  type slotsInputs,
  type Sprite
} from '../../utils/ui-utils'
import { Color4 } from '@dcl/sdk/math'
import {
  PointerEventType,
  UiCanvasInformation,
  engine,
  inputSystem
} from '@dcl/sdk/ecs'

type bottomBarSkillSlotProps = {
  skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  hotKey: slotsInputs
  cooldownTime: number
  onClick: (arg: number) => void
  isCooling: boolean
}

export function BottomBarSkillSlot({
  skill,
  hotKey,
  cooldownTime,
  onClick,
  isCooling
}: bottomBarSkillSlotProps): ReactEcs.JSX.Element | null {
  if (skill === undefined) {
    return null
  }
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  engine.addSystem(() => {
    if (inputSystem.isTriggered(hotKey, PointerEventType.PET_DOWN)) {
      onClick(skill.cooldown)
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
        uvs: getUvs(skill.sprite),
        texture: { src: skill.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        onClick(skill.cooldown)
        console.log('Need to implement cooldown and execute the skill code')
      }}
    >
      {/* {isCooling ?? (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        > */}
          <UiEntity
            uiTransform={{
              display: isCooling ? 'flex' : 'none',
              width: '100%',
              height: `${(cooldownTime / skill.cooldown) * 100}%`,
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiBackground={{
              color: Color4.create(0, 0, 0, 0.8)
            }}
          />
          <UiEntity
            uiTransform={{
              display: isCooling ? 'flex' : 'none',
              width: '100%',
              height: '100%',
              positionType: 'absolute',
              position: { bottom: 0 }
            }}
            uiText={{
              value: cooldownTime.toFixed(0).toString(),
              fontSize: canvasInfo.height * 0.02,
              textAlign: 'middle-center'
            }}
          />
        {/* </UiEntity>
      )} */}

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
          color: isCooling ? Color4.Red() : Color4.White()
        }}
      />
    </UiEntity>
  )
}
