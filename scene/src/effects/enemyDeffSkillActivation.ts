import { Animator, AudioSource, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { entityController } from '../realms/entityController'

export const applyDefSkillEffectToEnemyLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/ShieldSkill.glb' })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'action',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'action')

  AudioSource.playSound(area, 'assets/sounds/attack.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}
