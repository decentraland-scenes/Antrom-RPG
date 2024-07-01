import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Option } from './dungeonsData'

type optionButtonType = {
  visible: boolean
  available: boolean
  selected: boolean
  imgSources: string[]
  id: string
  array: Option[]
  selectOption: (arg: { id: string; array: Option[] }) => void
}

export function OptionButton({
  visible,
  available,
  selected,
  imgSources,
  id,
  array,
  selectOption
}: optionButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{ width: '100%', height: '100%' }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
          src: available ? imgSources[0] : imgSources[1]
        }
      }}
      onMouseDown={() => {
        selectOption({ id, array })
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: '-25%', left: '-10%' },
          width: '25%',
          height: '100%',
          display: selected ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/chooseDungeon/selectionIcon.png' }
        }}
      />
    </UiEntity>
  )
}
