import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../utils/utils'
import {
  CHARACTER_CLASSES,
  type CharacterStatsType,
  HEIGTH_FACTOR,
  WIDTH_FACTOR,
  creationPlayerSprites,
  type CharacterFactionsType,
  CHARACTER_RACES,
  CHARACTER_FACTIONS
} from './creationPlayerData'
import { CreationPlayerOption } from './creationPlayerOption'
import { Color4 } from '@dcl/sdk/math'
import { CreationPlayerSelectedOption } from './creationPlayerSelectedOption'

type CreationPlayerProps = {
  isVisible: boolean
  selectOption: (arg: CharacterStatsType | CharacterFactionsType) => void
  selectedClass: CharacterStatsType | undefined
  selectedRace: CharacterStatsType | undefined
  selectedFaction: CharacterFactionsType | undefined
}

function CreationPlayer({
  isVisible,
  selectOption,
  selectedClass,
  selectedRace,
  selectedFaction
}: CreationPlayerProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR,
          height: canvasInfo.width * HEIGTH_FACTOR,
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(creationPlayerSprites.background),
          texture: { src: creationPlayerSprites.background.atlasSrc }
        }}
      >
        {/* Create your character: Faction, Race, Class */}
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.525,
            height: '100%',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              margin: { top: '27.5%' }
            }}
          >
            {CHARACTER_FACTIONS.map((characterFaction, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  height: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  margin: { right: '1%' }
                }}
              >
                <CreationPlayerOption
                  option={characterFaction}
                  selectedOption={selectedFaction}
                  selectOption={selectOption}
                />
              </UiEntity>
            ))}
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              margin: { top: '15%' }
            }}
          >
            {CHARACTER_RACES.map((characterRace, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  height: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  margin: { right: '1%' }
                }}
              >
                <CreationPlayerOption
                  option={characterRace}
                  selectedOption={selectedRace}
                  selectOption={selectOption}
                />
              </UiEntity>
            ))}
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              margin: { top: '14%' }
            }}
          >
            {CHARACTER_CLASSES.map((characterClass, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  height: canvasInfo.width * WIDTH_FACTOR * 0.075,
                  margin: { right: '1%' }
                }}
              >
                <CreationPlayerOption
                  option={characterClass}
                  selectedOption={selectedClass}
                  selectOption={selectOption}
                />
              </UiEntity>
            ))}
          </UiEntity>
        </UiEntity>

        {/* Details panel */}
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.2,
            height: '100%',
            padding: { top: '7%' }
          }}
          uiBackground={{ color: Color4.create(1, 0, 0, 0.1) }}
        >
          {selectedFaction !== undefined &&
          (selectedClass === undefined || selectedRace === undefined) ? (
            <UiEntity
              uiTransform={{
                width: '100%',
                height: canvasInfo.width * WIDTH_FACTOR * 0.2 * 2.22
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(selectedFaction.infoSprite),
                texture: { src: selectedFaction.infoSprite.atlasSrc }
              }}
            />
          ) : <UiEntity uiTransform={{
                width: '100%',
                height: canvasInfo.width * WIDTH_FACTOR * 0.2 * 2.22,
                display: selectedClass!==undefined && selectedRace !==undefined? 'flex':'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(creationPlayerSprites.stats),
                texture: { src: creationPlayerSprites.stats.atlasSrc }
              }}>
            </UiEntity>}
        </UiEntity>

        {/* Your character panel */}
        <UiEntity
          uiTransform={{
            position: { right: '15.25%', top: '10.5%' },
            positionType: 'absolute',
            width: canvasInfo.width * WIDTH_FACTOR * 0.085,
            height: canvasInfo.width * WIDTH_FACTOR * 0.5,
            flexDirection: 'column'
          }}
        >
          <CreationPlayerSelectedOption selectedOption={selectedFaction} />
          <CreationPlayerSelectedOption selectedOption={selectedRace} />
          <CreationPlayerSelectedOption selectedOption={selectedClass} />
          <CreationPlayerSelectedOption
            selectedOption={selectedClass}
            isSkill
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default CreationPlayer
