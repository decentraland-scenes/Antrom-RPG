import { type Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import Canvas from '../canvas/Canvas'

type AnnouncementProps = {
  color: Color4
  text: string
}

function Announcement({
  text,
  color
}: AnnouncementProps): ReactEcs.JSX.Element {
  return (
    <Canvas
      uiTransform={{
        justifyContent: 'center'
      }}
    >
      <Label
        uiTransform={{
          width: '50%'
        }}
        textAlign="middle-center"
        textWrap="wrap"
        fontSize={40}
        font="sans-serif"
        value={text}
        color={color}
      />
    </Canvas>
  )
}

export default Announcement
