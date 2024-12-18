import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../../utils/ui-utils'
import type { MagicalItemsMarketProp } from './magicalMarketData'
import {
  HEIGTH_FACTOR,
  MAGICAL_ITEMS_TO_SHOW,
  WIDTH_FACTOR,
  magicalItemsMarketSprites
} from './magicalMarketData'
import { MagicalMarketItemButton } from './magicalMarketItemButton'

function MagicalItemsMarket({
  isVisible,
  selectedMagicalItem,
  backgroundSprite,
  leftButton,
  rightButton,
  buttonSprite,
  scrollPosition,
  magicalItemsToShow,
  changeVisibility,
  scrollLeft,
  scrollRight,
  upScrollButtons,
  tradeDown,
  tradeUp,
  selectMagicalItem
}: MagicalItemsMarketProp): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR,
          height: canvasInfo.width * HEIGTH_FACTOR,
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(backgroundSprite),
          texture: { src: backgroundSprite.atlasSrc }
        }}
      >
        <UiEntity
          uiTransform={{
            width: '55%',
            height: 'auto',
            flexDirection: 'row',
            position: { top: '16%', left: '12.25%' },
            flexWrap: 'wrap'
          }}
        >
          {magicalItemsToShow
            .slice(
              scrollPosition * (MAGICAL_ITEMS_TO_SHOW - 1),
              MAGICAL_ITEMS_TO_SHOW
            )
            .map((magicalItem, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: canvasInfo.width * WIDTH_FACTOR * 0.12,
                  height: canvasInfo.width * WIDTH_FACTOR * 0.12,
                  margin: { right: '10.2%', bottom: '4.5%' }
                }}
              >
                <MagicalMarketItemButton
                  magicalItem={magicalItem}
                  selectedMagicalItem={selectedMagicalItem}
                  selectMagicalItem={selectMagicalItem}
                />
              </UiEntity>
            ))}
        </UiEntity>
        <UiEntity
          uiTransform={{
            position: { right: '2%', top: '10%' },
            positionType: 'absolute',
            width: canvasInfo.width * WIDTH_FACTOR * 0.04,
            height: canvasInfo.width * WIDTH_FACTOR * 0.04
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(magicalItemsMarketSprites.exit_icon),
            texture: {
              src: magicalItemsMarketSprites.exit_icon.atlasSrc
            }
          }}
          onMouseDown={changeVisibility}
        />
        <UiEntity
          uiTransform={{
            position: { left: '6%', top: '47%' },
            positionType: 'absolute',
            width: canvasInfo.width * WIDTH_FACTOR * 0.04,
            height: canvasInfo.width * WIDTH_FACTOR * 0.04
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(leftButton),
            texture: {
              src: leftButton.atlasSrc
            }
          }}
          onMouseDown={scrollLeft}
          onMouseUp={upScrollButtons}
        />
        <UiEntity
          uiTransform={{
            position: { left: '59.5%', top: '47%' },
            positionType: 'absolute',
            width: canvasInfo.width * WIDTH_FACTOR * 0.04,
            height: canvasInfo.width * WIDTH_FACTOR * 0.04
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(rightButton),
            texture: {
              src: rightButton.atlasSrc
            }
          }}
          onMouseDown={scrollRight}
          onMouseUp={upScrollButtons}
        />
        <UiEntity
          uiTransform={{
            width: '30.75%',
            height: '100%',
            positionType: 'absolute',
            flexDirection: 'column',
            alignItems: 'center',
            position: { right: 0, top: 0 }
          }}
        >
          <UiEntity
            uiTransform={{
              display:
                selectedMagicalItem !== null &&
                selectedMagicalItem !== undefined
                  ? 'flex'
                  : 'none',
              width: '100%',
              height: '20%',
              margin: { top: '12%', bottom: '12%' }
            }}
            uiText={{
              value:
                selectedMagicalItem !== null &&
                selectedMagicalItem !== undefined
                  ? selectedMagicalItem.name
                  : '',
              fontSize: 15,
              textAlign: 'middle-center'
            }}
          />
          <UiEntity
            uiTransform={{
              display:
                selectedMagicalItem !== null &&
                selectedMagicalItem !== undefined
                  ? 'flex'
                  : 'none',
              width: canvasInfo.width * WIDTH_FACTOR * 0.12,
              height: canvasInfo.width * WIDTH_FACTOR * 0.12
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(
                selectedMagicalItem !== null &&
                  selectedMagicalItem !== undefined
                  ? selectedMagicalItem.sprite
                  : undefined
              ),
              texture: {
                src:
                  selectedMagicalItem !== null &&
                  selectedMagicalItem !== undefined
                    ? selectedMagicalItem.sprite.atlasSrc
                    : ''
              }
            }}
          />
          <UiEntity
            uiTransform={{
              display:
                selectedMagicalItem !== null &&
                selectedMagicalItem !== undefined
                  ? 'flex'
                  : 'none',
              margin: { top: '25%' },
              width: canvasInfo.width * WIDTH_FACTOR * 0.2,
              height: canvasInfo.width * WIDTH_FACTOR * 0.2 * 0.2
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(buttonSprite),
              texture: {
                src:
                  buttonSprite !== null && buttonSprite !== undefined
                    ? buttonSprite.atlasSrc
                    : ''
              }
            }}
            onMouseDown={tradeDown}
            onMouseUp={tradeUp}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default MagicalItemsMarket
