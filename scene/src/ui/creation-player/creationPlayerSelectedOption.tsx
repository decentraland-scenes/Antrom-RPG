import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Sprite, getUvs } from '../utils/utils'
import {
  type CharacterStatsType,
  type CharacterFactionsType,
  WIDTH_FACTOR
} from './creationPlayerData'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

type creationPlayerSelectedOptionProps = {
  selectedOption: CharacterStatsType | CharacterFactionsType | undefined
  isSkill?: boolean
}

export function CreationPlayerSelectedOption({
  selectedOption,
  isSkill
}: creationPlayerSelectedOptionProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  let selectedOptionSprite: Sprite | undefined

  if (selectedOption !== undefined && selectedOption.type === 'class') {
    if (isSkill !== null && isSkill === true) {
      selectedOptionSprite = selectedOption.skillSprite
    } else {
      selectedOptionSprite = selectedOption.selectedSprite
    }
  } else {
    selectedOptionSprite = selectedOption?.selectedSprite
  }

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: canvasInfo.width * WIDTH_FACTOR * 0.085,
        margin: { bottom: '4%' }
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(selectedOptionSprite),
        texture: {
          src:
            selectedOptionSprite !== undefined
              ? selectedOptionSprite.atlasSrc
              : ''
        }
      }}
    />
  )
}
