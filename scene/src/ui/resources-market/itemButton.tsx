import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { resourcesMarketSprites, type InventoryItem } from './resourcesData'
import { getUvs } from '../utils/utils'

type ItemButtonType = {
  inventoryItem: InventoryItem
  selectedItem: InventoryItem | undefined
  isSelling: boolean
  selectItem: (arg: InventoryItem) => void
}

export function ItemButton({
  inventoryItem,
  selectedItem,
  isSelling,
  selectItem
}: ItemButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display:
          (inventoryItem.amount !== undefined && inventoryItem.amount > 0) ||
          !isSelling
            ? 'flex'
            : 'none'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(inventoryItem.item.sprite),
        texture: { src: inventoryItem.item.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        selectItem(inventoryItem)
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '115%',
          height: '115%',
          position: { left: '-5%', top: '-5%' },
          display:
            selectedItem?.item.id === inventoryItem.item.id ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(resourcesMarketSprites.selected_frame),
          texture: {
            src: resourcesMarketSprites.selected_frame.atlasSrc
          }
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          width: '100%',
          height: '100%',
          display: isSelling ? 'flex' : 'none'
        }}
        uiText={{
          value:
            inventoryItem.amount !== undefined
              ? inventoryItem.amount.toString()
              : '',
          textAlign: 'bottom-right',
          fontSize: 20
        }}
      />
    </UiEntity>
  )
}
