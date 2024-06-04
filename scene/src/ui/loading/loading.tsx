import { engine } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export function setupLoadingUi(): void {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
let isLoading: boolean = true
let isVisible: boolean = true

const uiComponent = (): ReactEcs.JSX.Element => (
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
        texture: { wrapMode: 'repeat', src: 'assets/images/zombieLoading.png' }
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
        isVisible = false
      }}
    />
  </UiEntity>
)

let timer: number = 2
export function loadingSystem(dt: number): void {
  if (timer - dt <= 0 && isLoading) {
    isLoading = false
    timer = 2
    engine.removeSystem(loadingSystem)
  } else {
    timer = timer - dt
  }
}
