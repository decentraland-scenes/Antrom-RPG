import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { canvasInfo, getUvs } from '../utils/utils'
import type { WearableButtonProp, WearablesMarketProps } from './wearablesData'
import {
  HEIGTH_FACTOR,
  WEARABLES_TO_SHOW,
  WIDTH_FACTOR,
  wearablesMarketSprites
} from './wearablesData'

function WearablesMarket({
  isVisible,
  selectedWearable,
  backgroundSprite,
  leftButton,
  rightButton,
  buttonSprite,
  scrollPosition,
  wearablesToShow,
  changeVisibility,
  scrollLeft,
  scrollRight,
  upScrollButtons,
  tradeDown,
  tradeUp,
  selectWearable
}: WearablesMarketProps): ReactEcs.JSX.Element {
  function WearableButton({
    wearable
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
          selectWearable({wearable})
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
        {' '}
        <UiEntity
          uiTransform={{
            width: '55%',
            height: 'auto',
            flexDirection: 'row',
            position: { top: '14.5%', left: '11%' },
            flexWrap: 'wrap'
          }}
        >
          {wearablesToShow
            .slice(scrollPosition * (WEARABLES_TO_SHOW - 1), WEARABLES_TO_SHOW)
            .map((wearable, index) => (
              <UiEntity
                key={index}
                uiTransform={{
                  width: canvasInfo.width * WIDTH_FACTOR * 0.12,
                  height: canvasInfo.width * WIDTH_FACTOR * 0.12,
                  margin: { right: '10.2%', bottom: '4.5%' }
                }}
              >
                <WearableButton wearable={wearable} />
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
            uvs: getUvs(wearablesMarketSprites.exit_icon),
            texture: {
              src: wearablesMarketSprites.exit_icon.atlasSrc
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
            width: '32%',
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
                selectedWearable !== null && selectedWearable !== undefined
                  ? 'flex'
                  : 'none',
              width: '100%',
              height: '20%',
              margin: { top: '12%', bottom: '12%' }
            }}
            uiText={{
              value:
                selectedWearable !== null && selectedWearable !== undefined
                  ? selectedWearable.name
                  : '',
              fontSize: 15,
              textAlign: 'middle-center'
            }}
          />
          <UiEntity
            uiTransform={{
              display:
                selectedWearable !== null && selectedWearable !== undefined
                  ? 'flex'
                  : 'none',
              width: canvasInfo.width * WIDTH_FACTOR * 0.12,
              height: canvasInfo.width * WIDTH_FACTOR * 0.12
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(
                selectedWearable !== null && selectedWearable !== undefined
                  ? selectedWearable.sprite
                  : undefined
              ),
              texture: {
                src:
                  selectedWearable !== null && selectedWearable !== undefined
                    ? selectedWearable.sprite.atlasSrc
                    : ''
              }
            }}
          />
          <UiEntity
            uiTransform={{
              display:
                selectedWearable !== null && selectedWearable !== undefined
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

export default WearablesMarket
