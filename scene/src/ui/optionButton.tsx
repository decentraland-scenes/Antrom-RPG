import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Option } from '../multiplayer/multiplayerData'

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
          src: imgSources[0]
        }
      }}
      onMouseDown={() => {
        selectOption({ id, array })
      }}
    >  
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: '0%' },
          width: '100%',
          height: '100%',
          display: selected ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: imgSources[1] }
        }}
      />
    </UiEntity>
  )
}
