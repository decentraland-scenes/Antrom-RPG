import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import type { TimerProps } from './timerData'

function Timer({ hours, minutes, seconds }: TimerProps): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        position: { top: '60%', left: '1.5%' },
        positionType: 'absolute',
        width: 100,
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'relative'
        }}
        uiText={{
          value: hours ?? '',
          fontSize: 20,
          color: Color4.Yellow()
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'relative'
        }}
        uiText={{
          value: hours !== null && hours !== undefined ? ':' : '',
          fontSize: 20,
          color: Color4.Yellow()
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'relative'
        }}
        uiText={{
          value: minutes,
          fontSize: 20,
          textAlign: 'middle-center',
          color: Color4.Yellow()
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'relative'
        }}
        uiText={{
          value: ':',
          fontSize: 20,
          textAlign: 'middle-center',
          color: Color4.Yellow()
        }}
      />
      <UiEntity
        uiTransform={{
          positionType: 'relative'
        }}
        uiText={{
          value: seconds,
          fontSize: 20,
          textAlign: 'middle-center',
          color: Color4.Yellow()
        }}
      />
    </UiEntity>
  )
}

export default Timer
