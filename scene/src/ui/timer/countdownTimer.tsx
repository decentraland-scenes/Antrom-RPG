import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

export type CountdownTimerProps = {
  minutes: string
  seconds: string
  isVisible: boolean
  shouldFlash: boolean
}

function CountdownTimer({ minutes, seconds, isVisible, shouldFlash }: CountdownTimerProps): ReactEcs.JSX.Element | null {
  if (!isVisible) return null

  // Calculate flash color - red when flashing, normal colors otherwise
  const backgroundColor = shouldFlash ? Color4.create(0.8, 0, 0, 0.8) : Color4.create(0, 0, 0, 0.7)
  const textColor = shouldFlash ? Color4.White() : Color4.Yellow()
  const timeColor = shouldFlash ? Color4.White() : Color4.White()

  return (
    <UiEntity
      uiTransform={{
        position: { top: '8%', left: '75%' }, // Position to the right of fountain HP bar
        positionType: 'absolute',
        width: 150,
        height: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{
        color: backgroundColor
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          padding: { top: 10, bottom: 10, left: 15, right: 15 }
        }}
      >
        <UiEntity
          uiText={{
            value: 'GAME TIME',
            fontSize: 16,
            color: textColor,
            textAlign: 'middle-center'
          }}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: { top: 5 }
          }}
        >
          <UiEntity
            uiText={{
              value: minutes,
              fontSize: 24,
              color: timeColor,
              textAlign: 'middle-center'
            }}
          />
          <UiEntity
            uiText={{
              value: ':',
              fontSize: 24,
              color: timeColor,
              textAlign: 'middle-center'
            }}
          />
          <UiEntity
            uiText={{
              value: seconds,
              fontSize: 24,
              color: timeColor,
              textAlign: 'middle-center'
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default CountdownTimer 