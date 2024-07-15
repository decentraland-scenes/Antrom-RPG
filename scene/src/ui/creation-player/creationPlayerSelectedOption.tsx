import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import {
  HEIGTH_FACTOR,
  WIDTH_FACTOR,
  type CharacterAlliancesType,
  type CharacterStatsType
} from './creationPlayerData'

type creationPlayerSelectedOptionProps = {
  selectedOption: CharacterStatsType | CharacterAlliancesType | undefined
  isSkill?: boolean
}

export function CreationPlayerSelectedOption({
  selectedOption,
  isSkill
}: creationPlayerSelectedOptionProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  let selectedOptionSprite: Sprite | undefined
  let selectedOptionLabel: string = ''

  if (selectedOption !== undefined && selectedOption.type === 'class') {
    if (
      isSkill !== null &&
      isSkill === true &&
      selectedOption.skill !== undefined
    ) {
      selectedOptionSprite = selectedOption.skillSprite
      selectedOptionLabel = selectedOption.skill
    } else {
      selectedOptionSprite = selectedOption.selectedSprite
      selectedOptionLabel = selectedOption.name
    }
  } else if (selectedOption !== undefined) {
    selectedOptionSprite = selectedOption.selectedSprite
    selectedOptionLabel = selectedOption.name
  }

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width * WIDTH_FACTOR * 0.22,
        height: canvasInfo.width * WIDTH_FACTOR * 0.22 * 0.4,
        alignItems: 'flex-end'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * 0.22 * 0.4,
          height: canvasInfo.width * WIDTH_FACTOR * 0.22 * 0.4
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
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * 0.22 * 0.6,
          height: '15%',
          margin: { bottom: '10%' }
        }}
        uiText={{
          value: selectedOptionLabel,
          fontSize: canvasInfo.width * HEIGTH_FACTOR * 0.025,
          textAlign: 'bottom-center'
        }}
      />
    </UiEntity>
  )
}
