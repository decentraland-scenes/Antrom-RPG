import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import Canvas from '../canvas/Canvas'

export interface SimpleNotification {
  id: string
  text: string
  timestamp: number
  duration: number
}

export interface SimpleNotificationWindowProps {
  notifications: SimpleNotification[]
  maxNotifications?: number
  onRemoveNotification?: (id: string) => void
}

function SimpleNotificationWindow({
  notifications,
  maxNotifications = 3,
  onRemoveNotification
}: SimpleNotificationWindowProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (!canvasInfo) return null

  // Sort notifications by timestamp (newest first) and limit to max
  const sortedNotifications = notifications
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxNotifications)

  if (sortedNotifications.length === 0) return null

  return (
    <Canvas
      uiTransform={{
        positionType: 'absolute',
        position: { top: 20, right: 20 },
        width: 300,
        height: 'auto'
      }}
    >
      {/* Notification Container */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}
      >
        {sortedNotifications.map((notification) => (
          <SimpleNotificationItem
            notification={notification}
            onRemove={onRemoveNotification}
          />
        ))}
      </UiEntity>
    </Canvas>
  )
}

interface SimpleNotificationItemProps {
  notification: SimpleNotification
  onRemove?: (id: string) => void
}

function SimpleNotificationItem({ notification, onRemove }: SimpleNotificationItemProps): ReactEcs.JSX.Element {
  // Calculate opacity based on time remaining
  const timeElapsed = Date.now() - notification.timestamp
  const timeRemaining = notification.duration - timeElapsed
  const opacity = Math.max(0.3, Math.min(1, timeRemaining / 1000)) // Fade out in last second

  return (
    <UiEntity
      uiTransform={{
        width: 280,
        height: 'auto',
        margin: { bottom: 8 },
        padding: { top: 8, bottom: 8, left: 12, right: 12 }
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, opacity * 0.8)
      }}
      onMouseDown={() => onRemove?.(notification.id)}
    >
      <Label
        value={notification.text}
        fontSize={16}
        color={Color4.White()}
        textAlign="middle-left"
        textWrap="wrap"
        font="sans-serif"
        uiTransform={{
          width: '100%',
          height: 'auto'
        }}
      />
    </UiEntity>
  )
}

export default SimpleNotificationWindow 