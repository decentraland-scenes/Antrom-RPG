import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { PlayButtonManager } from '../play-button/PlayButtonManager'

type LoadingProps = {
  isLoading: boolean
  isVisible: boolean
  changeVisibility: () => void
}

function Loading({
  isLoading,
  isVisible,
  changeVisibility
}: LoadingProps): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        display: isVisible ? 'flex' : 'none',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: { src: 'assets/images/nightmare.png' }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '800',
          height: '550',
          display: 'flex'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/Hide_seek.png' }
        }}
      />
      <UiEntity
        uiTransform={{
          width: '500',
          height: '250',
          display: isLoading ? 'flex' : 'none'
        }}
        uiBackground={{
          texture: {
            wrapMode: 'repeat',
            src: 'assets/images/zombieLoading.png'
          }
        }}
      />
      <UiEntity
        uiTransform={{
          width: '250',
          height: '250',
          display: isLoading ? 'none' : 'flex',
          alignItems: 'flex-end'
        }}
        uiBackground={{ texture: { src: 'assets/images/classic.png' } }}
        onMouseDown={() => {
          changeVisibility()
          // Start the game when PLAY is clicked
          PlayButtonManager.getInstance().startGame()
        }}
      />
    </UiEntity>
  )
}

export default Loading
