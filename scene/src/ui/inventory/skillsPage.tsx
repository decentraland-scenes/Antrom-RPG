import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs } from '../../utils/ui-utils'
import { skillsPageSprites } from './inventoryData'
import { Color4 } from '@dcl/sdk/math'

type SkillsPageProps = {
  selectedSkill: SkillDefinition | undefined
  selectedSkillType: string | undefined
  //   playerSkills: SkillDefinition[]
  //   classSkills: SkillDefinition[]
  //     equipoSkill: () => void
  //   unequipSkill: () => void
  //   scrollRightPlayerSkills: () => void
  //     scrollLeftPlayerSkills: () => void
  //     scrollRightClassSkills: () => void
  //   scrollLeftClassSkills: () => void
  //   leftSpritePlayer: Sprite
  //     rightSpritePlayer: Sprite
  //     leftSpriteClass: Sprite
  //     rightSpriteClass: Sprite
}

function SkillsPage({
  selectedSkill,
  selectedSkillType
}: SkillsPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(skillsPageSprites.skillsPageFrame),
        texture: { src: skillsPageSprites.skillsPageFrame.atlasSrc }
      }}
    >
      {/* Selected Skill Sprite */}
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * 0.06,
          height: canvasInfo.width * 0.06,
          positionType: 'absolute',
          position: {
            top: canvasInfo.width * 0.045,
            left: canvasInfo.width * 0.03
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(selectedSkill?.sprite),
          texture: {
            src:
              selectedSkill !== undefined ? selectedSkill.sprite.atlasSrc : ''
          }
        }}
      />
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * 0.12,
          height: canvasInfo.width * 0.06,
          positionType: 'absolute',
          position: {
            top: canvasInfo.width * 0.045,
            left: canvasInfo.width * 0.1
          },
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        {/* Selected Skill Name */}
        <UiEntity
          uiText={{
            value: selectedSkill !== undefined ? selectedSkill.name : '',
            fontSize: canvasInfo.width * 0.015,
            textAlign: 'top-left'
          }}
        />
        {/* Selected Skill Type */}
        <UiEntity
          uiText={{
            value:
              selectedSkillType !== undefined
                ? selectedSkillType.valueOf()
                : 'asd',
            fontSize: canvasInfo.width * 0.01,
            textAlign: 'bottom-left'
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

export default SkillsPage
