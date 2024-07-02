import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../utils/utils'

type bottomBarSkillSlotProps = {
  skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  label: string
}

export function BottomBarSkillSlot({
  skill,
  label
}: bottomBarSkillSlotProps): ReactEcs.JSX.Element | null {
  if (skill === undefined) {
    return null
  }

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
        console.log('Need to implement cooldown and execute the skill code')
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiText={{
          value: label,
          fontSize: 12,
          textAlign: 'top-left'
        }}
      />
    </UiEntity>
  )
}
