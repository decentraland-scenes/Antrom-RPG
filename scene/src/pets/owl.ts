import { PetTypes } from '../player/petManager'
import { Player } from '../player/player'
import { createPet } from './createPet'
import { type Pet } from './pet'

export function createOwl(): Pet {
  // Configuration
  const MOVE_SPEED = 4
  const ROT_SPEED = 1
  const LUCK_BUFF = 7

  const owl = createPet(
    'assets/models/owl.glb',
    MOVE_SPEED,
    ROT_SPEED,
    () => {
      Player.getInstance().updateLuckBuff(LUCK_BUFF)
    },
    () => {
      Player.getInstance().updateLuckBuff(-LUCK_BUFF)
    }
  )

  Player.getInstance().petManager.addPetInstance(PetTypes.OWL, owl)

  return owl
}
