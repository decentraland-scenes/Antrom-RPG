import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

type SkillTextProps = {
  text: string
  isVisible: boolean
}

export function SkillText({ text, isVisible }: SkillTextProps): ReactEcs.JSX.Element | null {
  if (!isVisible) return null

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: '20%', left: '50%' },
        width: 'auto',
        height: 'auto',
        minWidth: 200,
        maxWidth: 400,
        alignSelf: 'center',
        padding: 10,
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.7),
        textureMode: 'nine-slices',
        textureSlices: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
      }}
      uiText={{
        value: text,
        fontSize: 24,
        color: Color4.Yellow(),
        textAlign: 'middle-center',
        font: 'sans-serif',
      }}
    />
  )
} 