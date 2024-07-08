import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import { Color4 } from '@dcl/sdk/math';

type bottomBarSkillSlotProps = {
  skill: { cooldown: number; name: string; sprite: Sprite } | undefined
  label: string,
  isCooling: boolean,
  onClick: (arg: number) => void
}

export function BottomBarSkillSlot({
  skill,
  label,
  isCooling,
  onClick
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
        onClick(2)
        console.log('Need to implement cooldown and execute the skill code')
      }}
    >
       <UiEntity
        uiTransform={{
          display: isCooling ? 'flex' : 'none',
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiBackground={{
          color: Color4.create(0,0,0,0.8)
        }}
        
      />
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
