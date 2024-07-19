import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import { skillsPageSprites } from './inventoryData'
import { Color4 } from '@dcl/sdk/math'
import { CLASS_SKILLS_TO_SHOW, GENERAL_SKILLS_TO_SHOW } from '../bottom-bar/skillsData'
import { SkillButton } from './skillButton'

type SkillsPageProps = {
  selectedSkill: SkillDefinition | undefined
  selectedSkillType: string
  equipButtonSprite: Sprite
  unequipButtonSprite: Sprite
    generalSkills: SkillDefinition[]
    classSkills: SkillDefinition[]
  selectSkill: (arg:SkillDefinition) => void
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
  classSkillsIndex: number,
  playerLevel: number
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
  classSkillsLeftSprite,
  classSkillsRightSprite,
  scrollLeftClassSkills,
  scrollRightClassSkills,
  generalSkillsLeftSprite,
  generalSkillsRightSprite,
  scrollLeftGeneralSkills,
  scrollRightGeneralSkills,
  equipSkill,
  disableSkill
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
          justifyContent: 'center'
        }}
      >
        {/* Selected Skill Name */}
        <UiEntity
          uiTransform={{ width: '100%' }}
          uiText={{
            value: selectedSkill !== undefined ? selectedSkill.name : '',
            fontSize: canvasInfo.width * 0.015,
            textAlign: 'top-left'
          }}
        />
        {/* Selected Skill Type */}
        <UiEntity
          uiTransform={{ width: '100%' }}
          uiText={{
            value: selectedSkillType,
            fontSize: canvasInfo.width * 0.012,
            textAlign: 'bottom-left'
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <UiEntity
            uiTransform={{ width: '100%' }}
            uiText={{
              value:
                selectedSkill?.description !== undefined
                  ? selectedSkill.description
                  : '',
              fontSize: canvasInfo.width * 0.012,
              textAlign: 'middle-left'
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              margin: { top: canvasInfo.width * 0.03 }
            }}
            uiText={{
              value:
                selectedSkill?.minLevel !== undefined
                  ? 'Required Level: ' + selectedSkill.minLevel.toString()
                  : '',
              fontSize: canvasInfo.width * 0.012,
              textAlign: 'middle-left'
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            height:'30%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Equip Skill Button */}
          <UiEntity
            uiTransform={{ width: '70%', height: '45%' }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(equipButtonSprite),
              texture: {
                src: equipButtonSprite.atlasSrc
              }
            }}
            onMouseDown={equipSkill}

          />
          {/* Unequip Skill Button */}
          <UiEntity
            uiTransform={{ width: '70%', height: '45%' }}
                      uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(unequipButtonSprite),
              texture: {
                src: unequipButtonSprite.atlasSrc
              }
                      }}
            onMouseDown={disableSkill}
          />
        </UiEntity>

        

      </UiEntity>
      {/* General Skills */}
      <UiEntity
          uiTransform={{
            width: '75%',
            height:'50%',
          flexDirection: 'row',
            alignContent:'flex-start',
            flexWrap: 'wrap',
          positionType: 'absolute',
            position:{top:'17.25%', left:'31.5%'}
          }}
      >        
      <UiEntity
            uiTransform={{
              width: canvasInfo.width * 0.03,
            height: canvasInfo.width * 0.03,
            positionType: 'absolute',
            position: {left:0, top:"-20%"}
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
            positionType:'absolute',
            position: {right:"12.5%", top:"-20%"}
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(generalSkillsRightSprite),

              texture: { src: generalSkillsRightSprite.atlasSrc }
            }}
            onMouseDown={scrollRightGeneralSkills}
          />
        
        {generalSkills.slice(
              generalSkillsIndex * (GENERAL_SKILLS_TO_SHOW - 1),
              generalSkillsIndex * (GENERAL_SKILLS_TO_SHOW - 1) + GENERAL_SKILLS_TO_SHOW
            ).map((skill, index) => (
          <UiEntity key={index} uiTransform={{
            width: '9.5%',
            height: '29.5%',
            margin:{bottom:'1.2%', right:'1.65%'}
          }}>
                <SkillButton
                  skill={skill}
                  selectedSkill={selectedSkill}
                  isAvailable={skill.minLevel === undefined || (skill.minLevel!==undefined && playerLevel >= skill.minLevel)}
                  selectSkill={()=>{selectSkill(skill)}} />
          </UiEntity>
        ))}
          
        </UiEntity>
       {/* Class Skills */}
       <UiEntity
          uiTransform={{
            width: '66.25%',
            height:'15%',
            flexDirection: 'column',
            alignItems: 'center',
          justifyContent: 'space-between',
          positionType: 'absolute',
            position:{top:'79.5%', right:'2.45%'}
          }}
          uiBackground={{color:Color4.create(0,1,0,0.1)}}
      >  
        {classSkills.slice(
              classSkillsIndex * (CLASS_SKILLS_TO_SHOW - 1),
              classSkillsIndex * (CLASS_SKILLS_TO_SHOW - 1) + GENERAL_SKILLS_TO_SHOW
            ).map((skill, index) => (
          <UiEntity key={index} uiTransform={{
            width: '9.5%',
            height: '29.5%',
            margin:{bottom:'1.2%', right:'1.65%'}
          }}>
                <SkillButton
                  skill={skill}
                  selectedSkill={selectedSkill}
                  isAvailable={true}
                  selectSkill={()=>{selectSkill(skill)}} />
          </UiEntity>
            ))}
        
        <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03,
                height: canvasInfo.width * 0.03
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
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(classSkillsRightSprite),

                texture: { src: classSkillsRightSprite.atlasSrc }
              }}
              onMouseDown={scrollRightClassSkills}
            />
        </UiEntity>
    </UiEntity>
  )
}

export default SkillsPage
