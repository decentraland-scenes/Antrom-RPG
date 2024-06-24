import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../utils/utils'
import {
  type ChacarterFactionsType,
  type CharacterStatsType
} from './creationPlayerData'

type creationPlayerOptionProps = {
  option: CharacterStatsType | ChacarterFactionsType
  selectedRace: CharacterStatsType | undefined
  selectedClass: CharacterStatsType | undefined
  selectedFaction: ChacarterFactionsType | undefined
  selectRace: (arg: CharacterStatsType) => void
  selectClass: (arg: CharacterStatsType) => void
  selectFaction: (arg: ChacarterFactionsType) => void
}

export function CreationPlayerOption({
  option,
  selectedRace,
  selectedClass,
  selectedFaction,
  selectRace,
  selectClass,
  selectFaction
}: creationPlayerOptionProps): ReactEcs.JSX.Element {
  let backgroundSprite: Sprite
  switch (option.type) {
    case 'race':
      if (selectedRace !== undefined && option.id === selectedRace.id) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
    case 'class':
      if (selectedClass !== undefined && option.id === selectedClass.id) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
    case 'faction':
      if (selectedFaction !== undefined && option.id === selectedFaction.id) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
  }
  function handleClick(): void {
    switch (option.type) {
      case 'race':
        selectRace(option)
        break
      case 'class':
        // selectClass(option.id)
        selectClass(option)
        break
      case 'faction':
        selectFaction(option)
        break
    }
  }

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(backgroundSprite),
        texture: { src: backgroundSprite.atlasSrc }
      }}
      onMouseDown={handleClick}
    ></UiEntity>
  )
}
