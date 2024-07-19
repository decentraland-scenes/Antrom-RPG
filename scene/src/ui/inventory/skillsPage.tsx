import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type SkillDefinition } from '../../player/skills'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import { skillsPageSprites } from './inventoryData'
import { Color4 } from '@dcl/sdk/math'
import { SKILL_DATA } from '../bottom-bar/skillsData'
import { SkillButton } from './skillButton'

type SkillsPageProps = {
  selectedSkill: SkillDefinition | undefined
  selectedSkillType: string
  equipButtonSprite: Sprite
  unequipButtonSprite: Sprite
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
  selectedSkillType,
  equipButtonSprite,
  unequipButtonSprite
}: SkillsPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

  const arrayOfSkills: SkillDefinition[] = Object.values(SKILL_DATA);

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
          />
        </UiEntity>

        

      </UiEntity>
      {/* General Skills */}
      <UiEntity
          uiTransform={{
            width: '66.25%',
            height:'50%',
            flexDirection: 'column',
          alignItems: 'center',
            flexWrap: 'wrap',
          justifyContent: 'space-between',
          positionType: 'absolute',
            position:{top:'17%', right:'2.3%'}
          }}
          // uiBackground={{color:Color4.create(0,1,0,0.1)}}
      >       
        {arrayOfSkills.map((skill, index) => (
          <UiEntity key={index} uiTransform={{
            width: '11%',
            height: '29.5%',
            margin:{bottom:'2%', right:'1.65%'}
          }}>
            <SkillButton skill={skill} selectedSkill={selectedSkill} />
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
        </UiEntity>
    </UiEntity>
  )
}

export default SkillsPage
