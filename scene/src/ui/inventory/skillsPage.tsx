import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import { skillsPageSprites } from './inventoryData'
import {
  CLASS_SKILLS_TO_SHOW,
  GENERAL_SKILLS_TO_SHOW
} from '../bottom-bar/skillsData'
import { SkillButton } from './skillButton'

type SkillsPageProps = {
  selectedSkill: SkillDefinition | undefined
  selectedSkillType: string
  equipButtonSprite: Sprite
  unequipButtonSprite: Sprite
  generalSkills: SkillDefinition[]
  classSkills: SkillDefinition[]
  selectSkill: (arg: SkillDefinition) => void
  selectSkillType: (arg: 'general' | 'class') => void
  equipSkill: () => void
  disableSkill: () => void
  scrollRightGeneralSkills: () => void
  scrollLeftGeneralSkills: () => void
  scrollRightClassSkills: () => void
  scrollLeftClassSkills: () => void
  generalSkillsIndex: number
  generalSkillsLeftSprite: Sprite
  generalSkillsRightSprite: Sprite
  classSkillsLeftSprite: Sprite
  classSkillsRightSprite: Sprite
  classSkillsIndex: number
  playerLevel: number
  showEquip: boolean
  showUnequip: boolean
  getSkillKey: (skill: SkillDefinition) => string
}

function SkillsPage({
  generalSkills,
  classSkills,
  selectedSkill,
  selectedSkillType,
  equipButtonSprite,
  unequipButtonSprite,
  generalSkillsIndex,
  classSkillsIndex,
  playerLevel,
  selectSkill,
  selectSkillType,
  classSkillsLeftSprite,
  classSkillsRightSprite,
  scrollLeftClassSkills,
  scrollRightClassSkills,
  generalSkillsLeftSprite,
  generalSkillsRightSprite,
  scrollLeftGeneralSkills,
  scrollRightGeneralSkills,
  equipSkill,
  disableSkill,
  showEquip,
  showUnequip,
  getSkillKey
}: SkillsPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  let pageWidth = canvasInfo.width * 0.8 < 1132 ? canvasInfo.width * 0.8 : 1132
  let pageHeight = pageWidth * 0.5

  if (pageHeight > canvasInfo.height * 0.7) {
    pageHeight = canvasInfo.height * 0.7
    pageWidth = 2 * pageHeight
  }

  const SKILL_BUTTON_SIZE = pageHeight * 0.1675

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
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
          width: '27.5%',
          height: '80%',
          margin: { left: '1.5%' },
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.06,
            height: pageWidth * 0.06,
            positionType: 'absolute',
            position: {
              top: '3%',
              left: '10%'
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
        {/* Selected Skill Name  */}
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.16,
            height: pageWidth * 0.06,
            positionType: 'absolute',
            position: {
              top: '3%',
              left: pageWidth * 0.1
            },
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
          }}
        >
          {/* Selected Skill Type */}
          <UiEntity
            uiTransform={{ width: '100%', height: pageWidth * 0.012 }}
            uiText={{
              value: selectedSkillType,
              fontSize: pageWidth * 0.015,
              textAlign: 'top-left'
            }}
          />
          {/* Selected Skill Name */}
          <UiEntity
            uiTransform={{
              width: '100%',
              height: pageWidth * 0.015,
              margin: { top: '2%' }
            }}
            uiText={{
              value: selectedSkill !== undefined ? selectedSkill.name : '',
              fontSize: pageWidth * 0.018,
              textAlign: 'top-left'
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.2,
            height: '75%',
            positionType: 'absolute',
            position: {
              top: '25%'
            },
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          {/* Selected Skill Description */}
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '80%',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%'
              }}
              uiText={{
                value:
                  selectedSkill?.description !== undefined
                    ? selectedSkill.description
                    : '',
                fontSize: pageWidth * 0.012,
                textAlign: 'top-left'
              }}
            />
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '10%'
              }}
              uiText={{
                value:
                  selectedSkill?.minLevel !== undefined
                    ? 'Required Level: ' + selectedSkill.minLevel.toString()
                    : '',
                fontSize: pageWidth * 0.012,
                textAlign: 'top-left'
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '12%',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            {/* Equip Skill Button */}
            {showEquip && (
              <UiEntity
                uiTransform={{ width: '70%', height: '100%' }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(equipButtonSprite),
                  texture: {
                    src: equipButtonSprite.atlasSrc
                  }
                }}
                onMouseDown={equipSkill}
              />
            )}
            {/* Unequip Skill Button */}
            {showUnequip && (
              <UiEntity
                uiTransform={{ width: '70%', height: '100%' }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(unequipButtonSprite),
                  texture: {
                    src: unequipButtonSprite.atlasSrc
                  }
                }}
                onMouseDown={disableSkill}
              />
            )}
          </UiEntity>
        </UiEntity>
      </UiEntity>
      {/* General Skills */}
      <UiEntity
        uiTransform={{
          width: pageWidth * 0.68,
          height: pageHeight * 0.51,
          flexDirection: 'row',
          alignContent: 'flex-start',
          flexWrap: 'wrap',
          positionType: 'absolute',
          position: { top: pageHeight * 0.16, left: pageWidth * 0.31 }
        }}
      >
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.03,
            height: pageWidth * 0.03,
            positionType: 'absolute',
            position: { left: 0, top: '-20%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(generalSkillsLeftSprite),

            texture: { src: generalSkillsLeftSprite.atlasSrc }
          }}
          onMouseDown={scrollLeftGeneralSkills}
        />
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.03,
            height: pageWidth * 0.03,
            positionType: 'absolute',
            position: { right: '2.5%', top: '-20%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(generalSkillsRightSprite),

            texture: { src: generalSkillsRightSprite.atlasSrc }
          }}
          onMouseDown={scrollRightGeneralSkills}
        />

        {generalSkills
          .slice(
            generalSkillsIndex * GENERAL_SKILLS_TO_SHOW,
            generalSkillsIndex * (GENERAL_SKILLS_TO_SHOW - 1) +
              GENERAL_SKILLS_TO_SHOW
          )
          .map((skill, index) => (
            <UiEntity
              key={index}
              uiTransform={{
                width: SKILL_BUTTON_SIZE,
                height: SKILL_BUTTON_SIZE
              }}
            >
              <SkillButton
                skill={skill}
                selectedSkill={selectedSkill}
                isAvailable={
                  skill.minLevel === undefined ||
                  (skill.minLevel !== undefined &&
                    playerLevel >= skill.minLevel)
                }
                selectSkill={() => {
                  selectSkill(skill)
                  selectSkillType('general')
                }}
                getKey={getSkillKey}
              />
            </UiEntity>
          ))}
      </UiEntity>
      {/* Class Skills */}
      <UiEntity
        uiTransform={{
          width: pageWidth * 0.68,
          height: pageHeight * 0.51,
          flexDirection: 'row',
          alignContent: 'flex-start',
          flexWrap: 'wrap',
          positionType: 'absolute',
          position: { top: pageHeight * 0.79, left: pageWidth * 0.31 }
        }}
      >
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.03,
            height: pageWidth * 0.03,
            positionType: 'absolute',
            position: { left: 0, top: '-20%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(classSkillsLeftSprite),

            texture: { src: classSkillsLeftSprite.atlasSrc }
          }}
          onMouseDown={scrollLeftClassSkills}
        />
        <UiEntity
          uiTransform={{
            width: pageWidth * 0.03,
            height: pageWidth * 0.03,
            positionType: 'absolute',
            position: { right: '2.5%', top: '-20%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(classSkillsRightSprite),

            texture: { src: classSkillsRightSprite.atlasSrc }
          }}
          onMouseDown={scrollRightClassSkills}
        />

        {classSkills
          .slice(
            classSkillsIndex * (CLASS_SKILLS_TO_SHOW - 1),
            classSkillsIndex * (CLASS_SKILLS_TO_SHOW - 1) + CLASS_SKILLS_TO_SHOW
          )
          .map((skill, index) => (
            <UiEntity
              key={index}
              uiTransform={{
                width: SKILL_BUTTON_SIZE,
                height: SKILL_BUTTON_SIZE
              }}
            >
              <SkillButton
                skill={skill}
                selectedSkill={selectedSkill}
                isAvailable={
                  skill.minLevel === undefined ||
                  (skill.minLevel !== undefined &&
                    playerLevel >= skill.minLevel)
                }
                selectSkill={() => {
                  selectSkill(skill)
                  selectSkillType('class')
                }}
                getKey={getSkillKey}
              />
            </UiEntity>
          ))}
      </UiEntity>
    </UiEntity>
  )
}

export default SkillsPage
