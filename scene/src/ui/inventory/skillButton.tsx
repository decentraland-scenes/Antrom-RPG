// import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs } from '../../utils/ui-utils'
import { resourcesMarketSprites } from '../resources-market/resourcesData'

type SkillButtonType = {
    skill: SkillDefinition
    selectedSkill: SkillDefinition | undefined
    // isAvailable: boolean
    // selectSkill: (arg: SkillDefinition) => void
}

export function SkillButton({
  skill,
  selectedSkill,
//   isAvailable,
//   selectSkill
}: SkillButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display:
          (skill !== undefined) ? 'flex' : 'none'
      }}
          uiBackground={{
        //   color:isAvailable?Color4.create(0,0,0,0):Color4.create(0,0,0,0.5),
        textureMode: 'stretch',
        uvs: getUvs(skill.sprite),
        texture: { src: skill.sprite !== undefined ?  skill.sprite.atlasSrc : '' }
      }}
      onMouseDown={() => {
        // selectSkill(skill)
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '115%',
          height: '115%',
          position: { left: '-5%', top: '-5%' },
          display:
            selectedSkill?.name === skill.name ? 'flex' : 'none'
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
