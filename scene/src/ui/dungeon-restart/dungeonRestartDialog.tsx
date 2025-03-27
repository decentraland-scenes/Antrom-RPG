import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { Button, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

type DungeonRestartDialogProps = {
  isVisible: boolean
  difficulty: string
  tokenCount: number
  onRestart: () => void
  onCancel: () => void
}

export function DungeonRestartDialog({
  isVisible,
  difficulty,
  tokenCount,
  onRestart,
  onCancel
}: DungeonRestartDialogProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        display: isVisible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * 0.4,
          height: canvasInfo.height * 0.3,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
        uiBackground={{
          color: Color4.fromHexString('#000000CC')
        }}
      >
        <Label
          value={`You have ${tokenCount} dungeon tokens remaining.\nWould you like to restart the ${difficulty} dungeon?`}
          fontSize={24}
          color={Color4.White()}
          textAlign="middle-center"
        />
        <UiEntity
          uiTransform={{
            width: '80%',
            height: '20%',
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <Button
            value="Yes"
            variant="primary"
            uiTransform={{
              width: '45%',
              height: '100%'
            }}
            onMouseDown={onRestart}
          />
          <Button
            value="No"
            variant="secondary"
            uiTransform={{
              width: '45%',
              height: '100%'
            }}
            onMouseDown={onCancel}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
} 