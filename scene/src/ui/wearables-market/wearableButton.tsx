import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../utils/utils'
import {
  type WearableButtonProp,
  wearablesMarketSprites
} from './wearablesData'

export function WearableButton({
  wearable,
  selectedWearable,
  selectWearable
}: WearableButtonProp): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(wearable.sprite),
        texture: { src: wearable.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        selectWearable(wearable)
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '115%',
          height: '115%',
          position: { left: '-7.5%', top: '-7.5%' },
          display: selectedWearable?.id === wearable.id ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(wearablesMarketSprites.selected_frame),
          texture: {
            src: wearablesMarketSprites.selected_frame.atlasSrc
          }
        }}
      />
    </UiEntity>
  )
}
