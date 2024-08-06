import { PetTypes } from '../player/petManager'
import { Player } from '../player/player'
import { createPet } from './createPet'
import { type Pet } from './pet'

export function createPhoenix(): Pet {
  // Configuration
  const MOVE_SPEED = 3
  const ROT_SPEED = 1

  const phoenix = createPet(
    'assets/models/Phoenix.glb',
    MOVE_SPEED,
    ROT_SPEED,
    () => {
      Player.getInstance().refillHealthBar(0.1, true)
    },
    () => {}
  )

  Player.getInstance().petManager.addPetInstance(PetTypes.PHOENIX, phoenix)

  return phoenix
}
