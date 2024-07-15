import { engine, GltfContainerLoadingState, LoadingState } from '@dcl/sdk/ecs'
import { movePlayerTo } from '~system/RestrictedActions'

const nextTickFuture: Array<() => void> = []

export async function waitNextTick(): Promise<void> {
  await new Promise<void>((resolve) => {
    nextTickFuture.push(resolve)
  })
}

engine.addSystem(function () {
  while (nextTickFuture.length > 0) {
    nextTickFuture.shift()?.()
  }
})

export function setPlayerPosition(x: number, y: number, z: number): void {
  console.log('setPlayerPosition', x, y, z)
  movePlayerTo({ newRelativePosition: { x, y, z } })
    .then(() => {
      console.log('Player moved')
    })
    .catch((error) => {
      console.error('Error moving player', error)
    })

  // TODO: this should work
  // Transform.getOrCreateMutable(engine.PlayerEntity).position = Vector3.create(
  //   x,
  //   y,
  //   z
  // )
}


export function isThereAnyGltfLoading(): boolean {
  return Array.from(
    engine.getEntitiesWith(GltfContainerLoadingState)
  ).some(([_, value]) => value.currentState === LoadingState.LOADING)
}
