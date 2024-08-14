import { Transform, engine, type TransformType } from '@dcl/sdk/ecs'
import { AnimatedEntity } from './animatedEntity'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { Player } from '../player/player'

export class Pet extends AnimatedEntity {
  moveSpeed: number = 1
  constructor(model: string, transform: TransformType, moveSpeed: number = 1) {
    super(model, transform)
    console.log('Pet Created')
    engine.addSystem(this.followPlayerSystem.bind(this))
    this.moveSpeed = moveSpeed
  }

  followPlayerSystem = (dt: number): void => {
    const playerPosition = Transform.get(engine.PlayerEntity).position
    const transform = Transform.getMutableOrNull(this.entity)
    if (transform === null) {
      return
    }

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
    const petMutableTransform = Transform.getMutable(this.entity)
    petMutableTransform.rotation = newRotation

    // Move towards player
    const distance = Vector3.distanceSquared(transform.position, playerPosition)
    if (distance >= 8) {
      // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
      this.idle()
      const forwardVector = Vector3.rotate(
        Vector3.Forward(),
        transform.rotation
      )
      const increment = Vector3.scale(forwardVector, dt * this.moveSpeed)
      const newPosition = Vector3.add(petMutableTransform.position, increment)
      petMutableTransform.position = newPosition
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
    engine.removeSystem(this.followPlayerSystem.bind(this))
  }
}
