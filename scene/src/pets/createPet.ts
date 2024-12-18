import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Pet } from './pet'
import { getRandomInt } from '../utils/getRandomInt'
import { engine, Transform } from '@dcl/sdk/ecs'

export function createPet(
  model: string,
  moveSpeed: number = 1,
  rotationSpeed: number = 1,
  addBuff?: () => void,
  removeBuff?: () => void,
  proximityEffect?: () => void
): Pet {
  addBuff?.()
  // Pet
  const pet = new Pet(
    model,
    {
      position: Vector3.add(
        Transform.get(engine.PlayerEntity).position,
        Vector3.create(getRandomInt(5) + 22, 1.8, getRandomInt(14) + 5)
      ),
      rotation: Quaternion.create(1, 1, 1, 1),
      scale: Vector3.create(1, 1, 1)
    },
    moveSpeed
  )

  pet.onRemove = () => {
    removeBuff?.()
    pet.handleOnRemove()
  }
  return pet
}
