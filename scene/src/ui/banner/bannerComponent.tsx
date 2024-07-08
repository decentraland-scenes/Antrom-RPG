import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import type { BannerPosition, BannerType } from './bannerConstants'
import { BANNER } from './bannerConstants'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

type BannerProps = {
  type: BannerType
  position?: BannerPosition
}

function Banner({ type, position }: BannerProps): ReactEcs.JSX.Element | null {
  const WIDTH_FACTOR = 0.33
  let ASPECT_RATIO = 0.216

  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  if (canvasInfo === null) return null

  if (type === 'level-up') {
    ASPECT_RATIO = 1
  }

  let TOP_POSITION = canvasInfo.height * 0.02
  if (position === 'center-mid') {
    TOP_POSITION =
      (canvasInfo.height - canvasInfo.width * WIDTH_FACTOR * ASPECT_RATIO) / 2
  }

  return (
    <UiEntity
      uiTransform={{
        position: {
          left: (canvasInfo.width - canvasInfo.width * WIDTH_FACTOR) / 2,
          top: TOP_POSITION
        },
        positionType: 'absolute',
        width: canvasInfo.width * WIDTH_FACTOR,
        height: canvasInfo.width * WIDTH_FACTOR * ASPECT_RATIO
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
          src: BANNER[type]
        }
      }}
    />
  )
}

export default Banner
