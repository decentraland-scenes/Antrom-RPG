// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs } from '../../utils/ui-utils'
import { skillsPageSprites } from './inventoryData'

type SkillsPageProps = {
  selectedSkill: SkillDefinition | undefined
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

function SkillsPage({ selectedSkill }: SkillsPageProps): ReactEcs.JSX.Element {
  // const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

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
    ></UiEntity>
  )
}

export default SkillsPage
