import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../utils/utils'
import {
  CHARACTER_CLASSES,
  type CharacterStatsType,
  HEIGTH_FACTOR,
  WIDTH_FACTOR,
  creationPlayerSprites,
  type ChacarterFactionsType
} from './creationPlayerData'
import { CreationPlayerOption } from './creationPlayerOption'

type CreationPlayerProps = {
  isVisible: boolean
  selectRace: (arg: CharacterStatsType) => void
  selectClass: (arg: CharacterStatsType) => void
  selectFaction: (arg: ChacarterFactionsType) => void
  selectedClass: CharacterStatsType | undefined
  selectedRace: CharacterStatsType | undefined
  selectedFaction: ChacarterFactionsType | undefined
}

function CreationPlayer({
  isVisible,
  selectRace,
  selectClass,
  selectFaction,
  selectedClass,
  selectedRace,
  selectedFaction
}: CreationPlayerProps): ReactEcs.JSX.Element {
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
              selectedRace={selectedRace}
              selectedClass={selectedClass}
              selectedFaction={selectedFaction}
              selectRace={selectRace}
              selectClass={selectClass}
              selectFaction={selectFaction}
            />
          </UiEntity>
        ))}
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.075,
            height: canvasInfo.width * WIDTH_FACTOR * 0.075,
            margin: { right: '1%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(
              selectedClass !== undefined
                ? selectedClass.selectedSprite
                : undefined
            ),
            texture: {
              src:
                selectedClass !== undefined
                  ? selectedClass.selectedSprite.atlasSrc
                  : ''
            }
          }}
        ></UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default CreationPlayer
