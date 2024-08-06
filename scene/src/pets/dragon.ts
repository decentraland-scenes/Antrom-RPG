import { LEVEL_TYPES } from '../player/LevelManager'
import { PetTypes } from '../player/petManager'
import { Player } from '../player/player'
import { createPet } from './createPet'
import { type Pet } from './pet'

export function createDragon(): Pet {
  const player = Player.getInstance()
  // Configuration
  const MOVE_SPEED = 5
  const ROT_SPEED = 1
  const ATTACK_BUFF = player.levels.getLevel(LEVEL_TYPES.PLAYER) * 7

  const pet = createPet(
    'assets/models/Dragon.glb',
    MOVE_SPEED,
    ROT_SPEED,
    () => {
      Player.getInstance().updateAtkBuff(ATTACK_BUFF)
    },
    () => {
      Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
    }
  )

  Player.getInstance().petManager.addPetInstance(PetTypes.DRAGON, pet)

  return pet
}
