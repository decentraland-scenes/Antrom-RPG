import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../../utils/ui-utils'
import { type WearableType } from './inventoryData'

type wearableItemProp = {
  wearable: WearableType
  selectedWearable: WearableType
  selectWearable: (arg: WearableType) => void
}

export function WearableItem({
  wearable,
  selectedWearable,
  selectWearable
}: wearableItemProp): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: wearable !== undefined ? 'flex' : 'none'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(wearable.sprite),
        texture: {
          src: wearable.sprite !== undefined ? wearable.sprite.atlasSrc : ''
        }
      }}
      onMouseDown={() => {
        selectWearable(wearable)
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '300%',
          height: '150%',
          position: { right: '100%', top: '50%' },
          display: selectedWearable?.name === wearable.name ? 'flex' : 'none'
        }}
        uiBackground={{
          texture: {
            src: 'images/stat.png'
          }
        }}
      />
    </UiEntity>
  )
}
