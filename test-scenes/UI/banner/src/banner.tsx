import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { BANNER } from './bannerConstants'
import type { BannerPosition, BannerType  } from './bannerConstants'
import { engine } from '@dcl/sdk/ecs'
import { canvasInfo } from '.'

export function setupBanner(type: BannerType, position?: BannerPosition): void {
  ReactEcsRenderer.setUiRenderer(() => uiComponent(type, position))
}

let isVisible = true
const uiComponent = (type: BannerType, position?: BannerPosition): ReactEcs.JSX.Element => (
  <Banner type={type} position={position} />
)

function Banner(props: { type: BannerType; position?: BannerPosition }): ReactEcs.JSX.Element {
  const WIDTH_FACTOR = 0.33
  let ASPECT_RATIO = 0.216

  if (props.type === 'level-up') {
    ASPECT_RATIO = 1
  }

  let TOP_POSITION = canvasInfo.height * 0.02
  if (props.position === 'center-mid') {
    TOP_POSITION =
      (canvasInfo.height - canvasInfo.width * WIDTH_FACTOR * ASPECT_RATIO) / 2
  }

  return (
    <UiEntity
      uiTransform={{
        display: isVisible ? 'flex' : 'none',
        position: {
          left: (canvasInfo.width - canvasInfo.width * WIDTH_FACTOR) / 2,
          top: TOP_POSITION
        },
        width: canvasInfo.width * WIDTH_FACTOR,
        height: canvasInfo.width * WIDTH_FACTOR * ASPECT_RATIO
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
          src: BANNER[props.type]
        }
      }}
    />
  )
}

const TIME = 100
let timer: number = 0
export function bannerSystem(dt: number): void {
  if (TIME - timer < 0) {
    isVisible = false
    timer = 0
    engine.removeSystem(bannerSystem)
  } else {
    timer = timer + dt
  }
}
