import ReactEcs, { UiEntity, ReactEcsRenderer } from '@dcl/sdk/react-ecs'

function exampleBannerUi(): ReactEcs.JSX.Element {
  return <UiEntity></UiEntity>
}

class GameController {
  start(): void {}
}

export function main(): void {
  // all the initializing logic
  const game = new GameController()
  game.start()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  
  
  ReactEcsRenderer.setUiRenderer(exampleBannerUi)
}
