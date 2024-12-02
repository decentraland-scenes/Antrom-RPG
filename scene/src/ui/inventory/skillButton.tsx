import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs } from '../../utils/ui-utils'
import { resourcesMarketSprites } from '../resources-market/resourcesData'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

type SkillButtonType = {
  skill: SkillDefinition
  selectedSkill: SkillDefinition | undefined
  isAvailable: boolean
  selectSkill: (arg: SkillDefinition) => void
  getKey: (arg: SkillDefinition) => string
}

export function SkillButton({
  skill,
  selectedSkill,
  isAvailable,
  selectSkill,
  getKey
}: SkillButtonType): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  let pageWidth = canvasInfo.width * 0.8 < 1132 ? canvasInfo.width * 0.8 : 1132
  let pageHeight = pageWidth * 0.5

  if (pageHeight > canvasInfo.height * 0.7) {
    pageHeight = canvasInfo.height * 0.7
    pageWidth = 2 * pageHeight
  }

  const FONT_SIZE = pageHeight * 0.05

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: skill !== undefined ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center'
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
          height: '90%'
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
      {getKey(skill) !== '' && (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            width: '92%',
            height: '92%',
            position: { top: '4%', right: '4%' }
          }}
          uiBackground={{ color: Color4.create(0, 1, 0, 0.1) }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              width: '70%',
              height: '70%',
              position: { top: '10%', right: '15%' }
            }}
            uiText={{
              value: getKey(skill),
              textAlign: 'top-left',
              fontSize: FONT_SIZE
            }}
          />
        </UiEntity>
      )}
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
