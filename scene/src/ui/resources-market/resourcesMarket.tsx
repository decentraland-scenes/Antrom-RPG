import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { Input, UiEntity } from '@dcl/sdk/react-ecs'
import { Tab, getUvs } from '../utils/utils'
import { ItemButton } from './itemButton'
import {
  ASPECT_RATIO,
  HEIGTH_FACTOR,
  SIZE_ITEM_FACTOR,
  WIDTH_FACTOR,
  resourcesMarketSprites,
  type ResourcesMarketProps
} from './resourcesData'
import { TradeButton } from './tradeButton'

function ResourcesMarket({
  isVisible,
  balance,
  tradeClicked,
  isSelling,
  itemsArray,
  totalPrice,
  buttonMaxSprite,
  selectedQuantity,
  selectedItem,
  changeVisibility,
  selectItem,
  updatePrice,
  mouseDownMax,
  mouseUpMax,
  setSelling,
  tradeDown,
  tradeUp,
  isUnavailable
}: ResourcesMarketProps): ReactEcs.JSX.Element {
  const uiCanvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  if (uiCanvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: uiCanvasInfo.width,
        height: uiCanvasInfo.height,
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerFilter: 'block'
      }}
    >
      <UiEntity
        uiTransform={{
          width: uiCanvasInfo.width * WIDTH_FACTOR,
          height: uiCanvasInfo.width * HEIGTH_FACTOR,
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(resourcesMarketSprites.background),
          texture: { src: resourcesMarketSprites.background.atlasSrc }
        }}
      >
        <UiEntity
          uiTransform={{
            width: uiCanvasInfo.width * WIDTH_FACTOR * 0.42,
            height: '66.5%',
            flexDirection: 'column',
            alignItems: 'center',
            margin: { top: '13%', left: '12.1%' }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '90%',
              height: '8.5%',
              flexDirection: 'row',
              margin: { bottom: '4%', left: '-8%' }
            }}
            uiBackground={{}}
          >
            <Tab
              condition={isSelling}
              trueSprite={resourcesMarketSprites.purchase_button}
              falseSprite={resourcesMarketSprites.purchase_button_clicked}
              callback={setSelling}
              callbackValue={false}
            />
            <Tab
              condition={isSelling}
              trueSprite={resourcesMarketSprites.sell_button_clicked}
              falseSprite={resourcesMarketSprites.sell_button}
              callback={setSelling}
              callbackValue={true}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '80%',
              height: '5%',
              flexDirection: 'row',
              margin: { right: '10%' }
            }}
            uiText={{
              value: balance.toString(),
              textAlign: 'middle-right'
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: { top: '1%' }
            }}
          >
            {itemsArray.map((resource, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: uiCanvasInfo.width * WIDTH_FACTOR * SIZE_ITEM_FACTOR,
                  height: uiCanvasInfo.width * WIDTH_FACTOR * SIZE_ITEM_FACTOR,
                  margin: { right: '8.75%', bottom: '4%', top: '1.5%' }
                }}
              >
                <ItemButton
                  inventoryItem={resource}
                  selectedItem={selectedItem}
                  isSelling={isSelling}
                  selectItem={selectItem}
                />
              </UiEntity>
            ))}
          </UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: uiCanvasInfo.width * WIDTH_FACTOR * 0.35,
            height: '60%',
            flexDirection: 'column',
            alignItems: 'center',
            margin: { top: '17.5%', left: '2%' },
            display: selectedItem !== undefined ? 'flex' : 'none'
          }}
        >
          <UiEntity
            uiTransform={{
              width: '80%',
              height: '10%',
              flexDirection: 'row'
            }}
            uiText={{
              value: selectedItem?.item.name ?? '',
              textAlign: 'middle-center',
              fontSize: 16
            }}
          />
          <UiEntity
            uiTransform={{
              width: uiCanvasInfo.width * WIDTH_FACTOR * 0.35,
              height: '50%',
              flexDirection: 'row',
              alignItems: 'flex-start',
              margin: { top: '25%' },
              display: selectedItem?.amount !== 0 ? 'flex' : 'none'
            }}
          >
            <UiEntity
              uiTransform={{
                width: uiCanvasInfo.width * WIDTH_FACTOR * 0.35 * 0.2,
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                margin: { left: '4%', right: '9%' },
                display: selectedItem !== undefined ? 'flex' : 'none'
              }}
            >
              <Input
                onChange={(value) => {
                  console.log('input')
                  updatePrice(value)
                }}
                value={selectedQuantity.toString()}
                uiTransform={{
                  width: '100%',
                  height: '20%',
                  margin: { top: '90%', bottom: '20%' }
                }}
              />
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '100%',
                  height: '20%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs:
                    selectedItem !== undefined ? getUvs(buttonMaxSprite) : [],
                  texture: {
                    src:
                      selectedItem !== undefined
                        ? buttonMaxSprite?.atlasSrc
                        : ''
                  }
                }}
                onMouseDown={mouseDownMax}
                onMouseUp={() => {
                  if (selectedItem !== undefined) {
                    mouseUpMax(selectedItem)
                  }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: uiCanvasInfo.width * WIDTH_FACTOR * 0.35 * 0.33,
                height: uiCanvasInfo.width * WIDTH_FACTOR * 0.35 * 0.33,
                margin: { top: '2%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs:
                  selectedItem?.item !== undefined
                    ? getUvs(selectedItem.item.sprite)
                    : [],
                texture: {
                  src:
                    selectedItem?.item.sprite !== undefined
                      ? selectedItem.item.sprite.atlasSrc
                      : ''
                }
              }}
            />
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: '30%',
                height: '10%',
                display: 'flex',
                margin: { top: '17.5%', right: '10%' }
              }}
              uiText={{
                value: totalPrice.toString(),
                textAlign: 'middle-right'
              }}
            />
          </UiEntity>
          <TradeButton
            isSelling={isSelling}
            selectedItem={selectedItem}
            tradeClicked={tradeClicked}
            tradeDown={tradeDown}
            tradeUp={tradeUp}
            isUnavailable={isUnavailable}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { top: '52%', right: '8%' },
            width: uiCanvasInfo.width * WIDTH_FACTOR * 0.04,
            height: uiCanvasInfo.width * WIDTH_FACTOR * 0.04 * ASPECT_RATIO,
            display: selectedItem?.item.withMana === true ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(resourcesMarketSprites.mana_coin),
            texture: {
              src: resourcesMarketSprites.mana_coin.atlasSrc
            }
          }}
        />
        <UiEntity
          uiTransform={{
            position: { right: '3%', top: '23%' },
            positionType: 'absolute',
            width: uiCanvasInfo.width * WIDTH_FACTOR * 0.04,
            height: uiCanvasInfo.width * WIDTH_FACTOR * 0.04
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(resourcesMarketSprites.exit_icon),
            texture: {
              src: resourcesMarketSprites.exit_icon.atlasSrc
            }
          }}
          onMouseDown={changeVisibility}
        />
      </UiEntity>
    </UiEntity>
  )
}

export default ResourcesMarket
