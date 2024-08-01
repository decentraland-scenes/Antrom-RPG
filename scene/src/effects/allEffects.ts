import { Animator, AudioSource, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { entityController } from '../realms/entityController'

export const applyFullOrangeSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Orange_circle.glb'
  })
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

export const applyFullBlueSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/Blue_circle.glb' })
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

export const applyFullRedSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/test.glb' })
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

export const applyFullWhiteSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/white_circle.glb' })
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

export const applyFullYellowSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Yellow_Circle.glb'
  })
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

export const applyFullGreenSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/CharacterSelect.glb'
  })
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

export const applyRedSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/EnemySelect.glb'
  })
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

export const applyEnemyAOESkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Explosion.glb'
  })
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

export const applyDefSkillEffectToLocation = (
  position: Vector3,
  duration?: number
): void => {
  // Add entity to engine
  const area = entityController.addEntity()

  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.One()
  })

  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/ShieldSkill.glb'
  })

  AudioSource.create(area, {
    audioClipUrl: 'assets/sounds/attack.mp3',
    loop: false,
    playing: true,
    volume: 0.5
  })

  // Add animator component to the entity
  Animator.create(area, {
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

  if (duration !== undefined) {
    utils.timers.setTimeout(() => {
      entityController.removeEntity(area)
    }, duration)
  }
}

export const applyEnemyAttackedMageEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/EnemySelect.glb'
  })
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

export const applyEnemyHealedEffectToLocation = (position: Vector3): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/heal.glb'
  })
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
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, 10000)
}

export const applyMageAttackEffectToLocation = (position: Vector3): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/whiteswirl.glb'
  })
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
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, 10000)
}

export const applyEnemySkillFireBallEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Fire_VFX.glb'
  })
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
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyGeneralSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Circular.glb'
  })
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

export const applyHealToLocation = (
  position: Vector3,
  duration: number = 10000
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/heal.glb'
  })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'heal',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'heal')
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyPlayerSkillBladesEffectToLocation = (
  position: Vector3,
  duration: number = 10000
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Sword_VFX.glb'
  })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'VFX',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'VFX')
  AudioSource.playSound(area, 'assets/sounds/attack.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyPlayerSkillFireBallEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Fire_VFX.glb'
  })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'VFX',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'VFX')
  AudioSource.playSound(area, 'assets/sounds/attack.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyrelicEnergyToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/Summon_a.glb'
  })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'Plane L1 FXAction',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'Plane L1 FXAction')
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyAttackedEnemyEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, {
    src: 'assets/models/Skill_FX/CharacterSelect.glb'
  })
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

export const applyCritToLocation = (position: Vector3): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/Summon_b.glb' })
  const clip = 'Plane L1 FX.001Action.001'
  Animator.createOrReplace(area, {
    states: [
      {
        clip,
        playing: true,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, clip)

  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, 2000)
}

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
