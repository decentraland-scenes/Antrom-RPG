import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Sprite, getUvs } from '../../utils/ui-utils'
import {
  CHARACTER_CLASSES,
  CHARACTER_FACTIONS,
  CHARACTER_RACES,
  HEIGTH_FACTOR,
  WIDTH_FACTOR,
  creationPlayerSprites,
  type CharacterFactionsType,
  type CharacterStatsType
} from './creationPlayerData'
import { CreationPlayerOption } from './creationPlayerOption'
import { CreationPlayerSelectedOption } from './creationPlayerSelectedOption'
import { CreationPlayerStat } from './creationPlayerStat'

type CreationPlayerProps = {
  isVisible: boolean
  selectOption: (arg: CharacterStatsType | CharacterFactionsType) => void
  selectedClass: CharacterStatsType | undefined
  selectedRace: CharacterStatsType | undefined
  selectedFaction: CharacterFactionsType | undefined
  clearOptionsClicked: boolean
  clearOptionsMouseDown: () => void
  clearOptionsMouseUp: () => void
  acceptClicked: boolean
  acceptMouseDown: () => void
  acceptMouseUp: () => void
}

function CreationPlayer({
  isVisible,
  selectOption,
  selectedClass,
  selectedRace,
  selectedFaction,
  clearOptionsClicked,
  clearOptionsMouseDown,
  clearOptionsMouseUp,
  acceptClicked,
  acceptMouseDown,
  acceptMouseUp
}: CreationPlayerProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  let acceptSprite: Sprite = creationPlayerSprites.acceptUnavailable

  if (
    selectedClass !== undefined &&
    selectedRace !== undefined &&
    selectedFaction !== undefined
  ) {
    if (acceptClicked) {
      acceptSprite = creationPlayerSprites.acceptClicked
    } else {
      acceptSprite = creationPlayerSprites.accept
    }
  }

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
            height: '100%'
          }}
        >
          {selectedFaction !== undefined &&
          (selectedClass === undefined || selectedRace === undefined) ? (
            <UiEntity
              uiTransform={{
                width: '100%',
                height: canvasInfo.width * WIDTH_FACTOR * 0.2 * 2.22,
                margin: { top: canvasInfo.width * HEIGTH_FACTOR * 0.12 }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(selectedFaction.infoSprite),
                texture: { src: selectedFaction.infoSprite.atlasSrc }
              }}
            />
          ) : (
            <UiEntity
              uiTransform={{
                width: '100%',
                height: canvasInfo.width * WIDTH_FACTOR * 0.2 * 2.22,
                flexDirection: 'column',
                margin: { top: canvasInfo.width * HEIGTH_FACTOR * 0.09 },

                display:
                  selectedClass !== undefined && selectedRace !== undefined
                    ? 'flex'
                    : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(creationPlayerSprites.stats),
                texture: { src: creationPlayerSprites.stats.atlasSrc }
              }}
            >
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: canvasInfo.width * HEIGTH_FACTOR * 0.075,
                  margin: { top: canvasInfo.width * HEIGTH_FACTOR * 0.02 }
                }}
                uiText={{
                  value: selectedRace !== undefined ? selectedRace.name : '',
                  fontSize: 15,
                  textAlign: 'middle-center'
                }}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'attack'}
                marginTop={0.04}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'defense'}
                marginTop={0.05}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'luck'}
                marginTop={0.05}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'hp'}
                marginTop={0.05}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'critRate'}
                marginTop={0.05}
              />
              <CreationPlayerStat
                selectedClass={selectedClass}
                selectedRace={selectedRace}
                stat={'critDamage'}
                marginTop={0.05}
              />
            </UiEntity>
          )}
        </UiEntity>

        {/* Your character panel */}
        <UiEntity
          uiTransform={{
            position: { right: '2%', top: '10.5%' },
            positionType: 'absolute',
            width: canvasInfo.width * WIDTH_FACTOR * 0.22,
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
          <UiEntity
            uiTransform={{
              width: '90%',
              height: canvasInfo.width * HEIGTH_FACTOR * 0.075,
              margin: { top: canvasInfo.width * HEIGTH_FACTOR * 0.04 }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(
                clearOptionsClicked
                  ? creationPlayerSprites.clearOptionsClicked
                  : creationPlayerSprites.clearOptions
              ),
              texture: { src: creationPlayerSprites.stats.atlasSrc }
            }}
            onMouseDown={clearOptionsMouseDown}
            onMouseUp={clearOptionsMouseUp}
          />
          <UiEntity
            uiTransform={{
              width: '90%',
              height: canvasInfo.width * HEIGTH_FACTOR * 0.075,
              margin: { top: canvasInfo.width * HEIGTH_FACTOR * 0.01 }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(acceptSprite),
              texture: { src: creationPlayerSprites.stats.atlasSrc }
            }}
            onMouseDown={acceptMouseDown}
            onMouseUp={acceptMouseUp}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default CreationPlayer
