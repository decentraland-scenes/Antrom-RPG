import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import {
  type CharacterFactionsType,
  type CharacterStatsType
} from './creationPlayerData'

type creationPlayerOptionProps = {
  option: CharacterStatsType | CharacterFactionsType
  selectedOption: CharacterStatsType | CharacterFactionsType | undefined
  selectOption: (arg: CharacterStatsType | CharacterFactionsType) => void
}

export function CreationPlayerOption({
  option,
  selectedOption,
  selectOption
}: creationPlayerOptionProps): ReactEcs.JSX.Element {
  let backgroundSprite: Sprite
  if (selectedOption !== undefined && option.id === selectedOption.id) {
    backgroundSprite = option.selectedSprite
  } else {
    backgroundSprite = option.unselectedSprite
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
      onMouseDown={() => {
        selectOption(option)
      }}
    ></UiEntity>
  )
}
