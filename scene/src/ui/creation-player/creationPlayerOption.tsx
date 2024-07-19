import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import {
  type CharacterAlliancesType,
  type CharacterClassStatsType,
  type CharacterRaceStatsType
} from './creationPlayerData'

type creationPlayerOptionProps = {
  option:
    | CharacterClassStatsType
    | CharacterRaceStatsType
    | CharacterAlliancesType
  selectedOption:
    | CharacterClassStatsType
    | CharacterRaceStatsType
    | CharacterAlliancesType
    | undefined
  selectOption: (
    arg:
      | CharacterClassStatsType
      | CharacterRaceStatsType
      | CharacterAlliancesType
  ) => void
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
