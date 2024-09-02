import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import {
  CLASS_SKILLS_TO_SHOW,
  GENERAL_SKILLS_TO_SHOW
} from '../bottom-bar/skillsData'
import { skillsPageSprites } from './inventoryData'
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
  // getKey: (skill:SkillDefinition) => string
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
  // getKey
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
      {/* Selected Skill Name & Type */}
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
          justifyContent: 'flex-start'
        }}
      >
        {/* Selected Skill Type */}
        <UiEntity
          uiTransform={{ width: '100%', height: canvasInfo.width * 0.012 }}
          uiText={{
            value: selectedSkillType,
            fontSize: canvasInfo.width * 0.012,
            textAlign: 'top-left'
          }}
        />
        {/* Selected Skill Name */}
        <UiEntity
          uiTransform={{ width: '100%', height: canvasInfo.width * 0.015 }}
          uiText={{
            value: selectedSkill !== undefined ? selectedSkill.name : '',
            fontSize: canvasInfo.width * 0.015,
            textAlign: 'top-left'
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * 0.2,
          height: canvasInfo.width * 0.23,
          positionType: 'absolute',
          position: {
            top: canvasInfo.width * 0.13,
            left: canvasInfo.width * 0.02
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
            height: '50%',
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
              fontSize: canvasInfo.width * 0.012,
              textAlign: 'top-left'
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%'
            }}
            uiText={{
              value:
                selectedSkill?.minLevel !== undefined
                  ? 'Required Level: ' + selectedSkill.minLevel.toString()
                  : '',
              fontSize: canvasInfo.width * 0.012,
              textAlign: 'top-left'
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '10%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Equip Skill Button */}
          {showEquip && <UiEntity
            uiTransform={{ width: '70%', height: '100%' }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(equipButtonSprite),
              texture: {
                src: equipButtonSprite.atlasSrc
              }
            }}
            onMouseDown={equipSkill}
          />}
          {/* Unequip Skill Button */}
          {showUnequip && <UiEntity
            uiTransform={{ width: '70%', height: '100%' }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(unequipButtonSprite),
              texture: {
                src: unequipButtonSprite.atlasSrc
              }
            }}
            onMouseDown={disableSkill}
          />}
        </UiEntity>
      </UiEntity>
      {/* General Skills */}
      <UiEntity
        uiTransform={{
          width: '67%',
          height: '50%',
          flexDirection: 'row',
          alignContent: 'flex-start',
          flexWrap: 'wrap',
          positionType: 'absolute',
          position: { top: '17.25%', left: '31.5%' }
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.03,
            height: canvasInfo.width * 0.03,
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
            width: canvasInfo.width * 0.03,
            height: canvasInfo.width * 0.03,
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
                width: '11%',
                height: '29.5%',
                margin: { bottom: '1.2%', right: '1.45%' }
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
                key={'A'}
              />
            </UiEntity>
          ))}
      </UiEntity>
      {/* Class Skills */}
      <UiEntity
        uiTransform={{
          width: '67%',
          height: '50%',
          flexDirection: 'row',
          alignContent: 'flex-start',
          flexWrap: 'wrap',
          positionType: 'absolute',
          position: { top: '79.5%', left: '31.5%' }
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.03,
            height: canvasInfo.width * 0.03,
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
            width: canvasInfo.width * 0.03,
            height: canvasInfo.width * 0.03,
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
                width: '11%',
                height: '29.5%',
                margin: { bottom: '1.2%', right: '1.45%' }
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
                key={'A'}
              />
            </UiEntity>
          ))}
      </UiEntity>
    </UiEntity>
  )
}

export default SkillsPage
