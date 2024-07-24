import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import {
  WEARABLES_MAPPING,
  type WearableType,
  type WearableString
} from './inventoryData'
import { Color4 } from '@dcl/sdk/math'

type WearableTooltipProp = {
  wearable: WearableType
  visibility: boolean
  processStat: (key: string) => string
}

export function WearableTooltip({
  wearable,
  visibility,
  processStat
}: WearableTooltipProp): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  const wearableName: WearableString = wearable.name as WearableString
  const TITLE_FONT_SIZE: number = canvasInfo.height * 0.02
  const STAT_FONT_SIZE: number = canvasInfo.height * 0.015

  if (!visibility) {
    return null
  }

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        padding: TITLE_FONT_SIZE * 0.8
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
          src: 'assets/images/stat.png'
        }
      }}
    >
      <Label
        uiTransform={{height:TITLE_FONT_SIZE * 1.1}}
        value={WEARABLES_MAPPING[wearableName].label}
        fontSize={TITLE_FONT_SIZE}
        color={Color4.Green()}
      />
      <UiEntity uiTransform={{width:'80%', height:'60%', flexDirection:'column', justifyContent:'center', margin:{top:TITLE_FONT_SIZE * 0.3}}}>
      {Object.entries(WEARABLES_MAPPING[wearableName].stats).map(
        ([key, value]) => (
          <Label
          uiTransform={{height:STAT_FONT_SIZE * 1.2}}
            fontSize={STAT_FONT_SIZE}
            value={
              (value > 0 ? '+' : '-') +
              value.toString() +
              ' ' +
              processStat(key)
            }
          ></Label>
        )
        )}
        </UiEntity>
    </UiEntity>
  )
}
