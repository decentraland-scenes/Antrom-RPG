import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Item } from '../resources-market/resourcesData'
import { getUvs } from '../../utils/ui-utils'
import { magicalItemsMarketSprites } from './magicalMarketData'

type magicalItemButtonType = {
  magicalItem: Item
  selectedMagicalItem: Item | undefined
  selectMagicalItem: (arg: Item) => void
}

export function MagicalMarketItemButton({
  magicalItem,
  selectedMagicalItem,
  selectMagicalItem
}: magicalItemButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(magicalItem.sprite),
        texture: { src: magicalItem.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        selectMagicalItem(magicalItem)
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '115%',
          height: '115%',
          position: { left: '-7.5%', top: '-7.5%' },
          display: selectedMagicalItem?.id === magicalItem.id ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(magicalItemsMarketSprites.selected_frame),
          texture: {
            src: magicalItemsMarketSprites.selected_frame.atlasSrc
          }
        }}
      />
    </UiEntity>
  )
}
