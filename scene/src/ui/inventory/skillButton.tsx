import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs } from '../../utils/ui-utils'
import { resourcesMarketSprites } from '../resources-market/resourcesData'

type SkillButtonType = {
  skill: SkillDefinition
  selectedSkill: SkillDefinition | undefined
  isAvailable: boolean
  selectSkill: (arg: SkillDefinition) => void
}

export function SkillButton({
  skill,
  selectedSkill,
  isAvailable,
  selectSkill
}: SkillButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: skill !== undefined ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems:'center'
      }}
      onMouseDown={() => {
        selectSkill(skill)
      }}
      // uiBackground={{color:Color4.Blue()}}
    >
      
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { left: '5%', top: '5%' },
          width: '90%',
          height: '90%',
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(skill.sprite),
          texture: {
            src: skill.sprite !== undefined ? skill.sprite.atlasSrc : ''
          }
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { left: '5%', top: '5%' },
          width: '90%',
          height: '90%',
          display: !isAvailable ? 'flex' : 'none'
        }}
        uiBackground={{
          color: Color4.create(1, 1, 1, 0.5)
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { left: '0%', top: '0%' },
          width: '100%',
          height: '100%',
          display: selectedSkill?.name === skill.name ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(resourcesMarketSprites.selected_frame),
          texture: {
            src: resourcesMarketSprites.selected_frame.atlasSrc
          }
        }}
      />
    </UiEntity>
  )
}
