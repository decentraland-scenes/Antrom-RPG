import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../utils/utils'
import {
  type ChacarterFactionsType,
  type CharacterStatsType
} from './creationPlayerData'

type creationPlayerOptionProps = {
  option: CharacterStatsType | ChacarterFactionsType
  type: 'race' | 'class' | 'faction'
  selectedRace: string
  selectedClass: string
  selectedFaction: string
  selectRace: (arg: string) => void
  selectClass: (arg: string) => void
  selectFaction: (arg: string) => void
}

export function CreationPlayerOption({
  option,
  type,
  selectedRace,
  selectedClass,
  selectedFaction,
  selectRace,
  selectClass,
  selectFaction
}: creationPlayerOptionProps): ReactEcs.JSX.Element {
  let backgroundSprite: Sprite
  switch (type) {
    case 'race':
      if (option.id === selectedRace) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
    case 'class':
      if (option.id === selectedClass) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
    case 'faction':
      if (option.id === selectedFaction) {
        backgroundSprite = option.selectedSprite
      } else {
        backgroundSprite = option.unselectedSprite
      }
      break
  }
  function handleClick(): void {
    switch (type) {
      case 'race':
        selectRace(option.id)
        break
      case 'class':
        // selectClass(option.id)
        console.log(option.id, selectedClass)
        break
      case 'faction':
        selectFaction(option.id)
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
