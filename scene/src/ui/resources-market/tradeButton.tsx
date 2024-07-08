import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type Sprite, getUvs } from '../../utils/ui-utils'
import { type InventoryItem, resourcesMarketSprites } from './resourcesData'

type tradeButtonType = {
  isSelling: boolean
  selectedItem: InventoryItem | undefined
  tradeClicked: boolean
  tradeDown: () => void
  tradeUp: () => void
  isUnavailable: () => boolean
}

export function TradeButton({
  isSelling,
  selectedItem,
  tradeClicked,
  tradeDown,
  tradeUp,
  isUnavailable
}: tradeButtonType): ReactEcs.JSX.Element {
  let normalSprite: Sprite
  let clickedSprite: Sprite
  let unavailableSprite: Sprite

  if (isSelling) {
    normalSprite = resourcesMarketSprites.sell_button
    clickedSprite = resourcesMarketSprites.sell_button_clicked
    unavailableSprite = resourcesMarketSprites.sell_button_unavailable
  } else {
    if (selectedItem?.item.withMana === true) {
      normalSprite = resourcesMarketSprites.purchase_with_mana_button
      clickedSprite = resourcesMarketSprites.purchase_with_mana_button_clicked
      unavailableSprite = resourcesMarketSprites.purchase_button_unavailable
    } else {
      normalSprite = resourcesMarketSprites.purchase_button
      clickedSprite = resourcesMarketSprites.purchase_button_clicked
      unavailableSprite = resourcesMarketSprites.purchase_button_unavailable
    }
  }
  return (
    <UiEntity
      uiTransform={{
        positionType: 'relative',
        width: '50%',
        height: '10%'
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'relative',
          width: '100%',
          height: '100%',
          display: isUnavailable() ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(unavailableSprite),
          texture: {
            src: unavailableSprite.atlasSrc
          }
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'relative',
          width: '100%',
          height: '100%',
          display: !isUnavailable() ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(tradeClicked ? clickedSprite : normalSprite),
          texture: {
            src: clickedSprite.atlasSrc
          }
        }}
        onMouseDown={tradeDown}
        onMouseUp={tradeUp}
      />
    </UiEntity>
  )
}
