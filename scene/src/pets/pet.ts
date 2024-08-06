import { Transform, engine, type TransformType } from '@dcl/sdk/ecs'
import { AnimatedEntity } from './animatedEntity'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'

export class Pet extends AnimatedEntity {
  moveSpeed: number = 1
  constructor(model: string, transform: TransformType) {
    super(model, transform)
    console.log('Pet Created')
    engine.addSystem(this.followPlayerSystem)
    this.onRemove = this.handleOnRemove
  }

  followPlayerSystem = (dt: number): void => {
    const playerPosition = Transform.get(engine.PlayerEntity).position
    const transform = Transform.getMutable(this.entity)
    // Face player
    const lookAtTarget = Vector3.create(
      playerPosition.x,
      playerPosition.y + 1,
      playerPosition.z
    )
    const direction = Vector3.subtract(lookAtTarget, transform.position)
    const newRotation = Quaternion.slerp(
      transform.rotation,
      Quaternion.lookRotation(direction),
      dt
    )
    Transform.getMutable(this.entity).rotation = newRotation

    // Move towards player
    const distance = Vector3.distanceSquared(transform.position, playerPosition)
    if (distance >= 8) {
      // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
      this.idle()
      const forwardVector = Vector3.rotate(
        Vector3.Forward(),
        transform.rotation
      )
      const increment = Vector3.scale(forwardVector, dt * 0.25)
      const newPosition = Vector3.add(playerPosition, increment)
      Transform.getMutable(this.entity).position = newPosition
    } else {
      // console.log(distance, ' is the distance to the player')
      utils.timers.setTimeout(() => {
        if (Player.getInstance().health <= 0) {
          this.remove()
        }
      }, 3000)
    }
  }

  handleOnRemove = (): void => {
    console.log('Pet Removed')
    engine.removeSystem(this.followPlayerSystem)
  }
}
