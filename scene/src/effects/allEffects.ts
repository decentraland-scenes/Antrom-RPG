import {
  Animator,
  AudioSource,
  Entity,
  GltfContainer,
  Transform,
  Tween,
  EasingFunction
} from '@dcl/sdk/ecs'
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
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/redCircle.glb' })
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
  AudioSource.playSound(area, 'assets/sounds/attack.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyFullWhiteSkillEffectToLocation = (
  position: Vector3,
  duration: number
): void => {
  console.log('effeeeeect')
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/White_Circle.glb' })
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
  console.log('effeeeeect')
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
        clip: 'PlaneAction.003',
        playing: true,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'PlaneAction.003')
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
export const applyRedSwirlToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/redCircle.glb' })
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
  AudioSource.playSound(area, 'assets/sounds/attack.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyWhiteSwirlToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/whiteSwirl.glb' })
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

export const applyPurpleSwirlToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/purpleSwirl.glb' })
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

export const applySphereEnergyToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/Summon_ball.glb' })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'SphereAction.001',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'SphereAction.001')
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export const applyFlameAuraToLocation = (
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
    src: 'assets/models/Skill_FX/flameAuraSwirl.glb'
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

export const applyRainbowSwirlToLocation = (
  position: Vector3,
  duration: number
): void => {
  const area = entityController.addEntity()
  Transform.create(area, {
    position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1)
  })
  GltfContainer.create(area, { src: 'assets/models/Skill_FX/Summon_ball.glb' })
  Animator.createOrReplace(area, {
    states: [
      {
        clip: 'idle',
        playing: true,
        loop: true
      },
      {
        clip: 'SphereAction.001',
        playing: false,
        loop: true
      }
    ]
  })
  Animator.playSingleAnimation(area, 'SphereAction.001')
  AudioSource.playSound(area, 'assets/sounds/Heal.mp3')
  utils.timers.setTimeout(() => {
    entityController.removeEntity(area)
  }, duration)
}

export function applyBlizzardEffectToLocation(
  position: Vector3,
  duration: number = 6000
): void {
  // Create main blizzard area entity
  const blizzardArea = entityController.addEntity()
  Transform.create(blizzardArea, {
    position: position,
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(0.1, 0.1, 0.1) // Start small
  })

  // 1. Main swirling snow effect
  const snowSwirl = entityController.addEntity()
  Transform.create(snowSwirl, {
    position: Vector3.add(position, Vector3.create(0, 0.5, 0)),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(0.1, 0.1, 0.1) // Start small
  })
  GltfContainer.create(snowSwirl, {
    src: 'assets/models/Skill_FX/whiteswirl.glb'
  })

  // 2. Ice crystal effect
  const iceCrystals = entityController.addEntity()
  Transform.create(iceCrystals, {
    position: Vector3.add(position, Vector3.create(0, 0.5, 0)),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(0.1, 0.1, 0.1) // Start small
  })
  GltfContainer.create(iceCrystals, {
    src: 'assets/models/Skill_FX/ice_crystal.glb'
  })

  // 3. Frost ground effect
  const frostGround = entityController.addEntity()
  Transform.create(frostGround, {
    position: Vector3.add(position, Vector3.create(0, 0, 0)),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(0.1, 0.1, 0.1) // Start small
  })
  GltfContainer.create(frostGround, {
    src: 'assets/models/Skill_FX/redCircle.glb'
  })

  // 4. Glowing blue spheres
  const numSpheres = 8
  const spheres: Entity[] = []
  for (let i = 0; i < numSpheres; i++) {
    const sphere = entityController.addEntity()
    const angle = (i / numSpheres) * Math.PI * 2
    const radius = 1.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = 0.5 + Math.random() * 1.5

    Transform.create(sphere, {
      position: Vector3.add(position, Vector3.create(x, y, z)),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(0.1, 0.1, 0.1) // Start small
    })
    GltfContainer.create(sphere, {
      src: 'assets/models/Skill_FX/Blue_circle.glb'
    })
    spheres.push(sphere)
  }

  // Add wind sound effect
  AudioSource.create(blizzardArea, {
    audioClipUrl: 'assets/sounds/attack.mp3',
    loop: true,
    playing: true,
    volume: 0.3
  })

  // Tween animations
  // 1. Scale up the blizzard area
  Tween.createOrReplace(blizzardArea, {
    mode: Tween.Mode.Scale({
      start: Vector3.create(0.1, 0.1, 0.1),
      end: Vector3.create(2.1, 2.1, 2.1)
    }),
    duration: 0.5,
    easingFunction: EasingFunction.EF_EASEINSINE
  })

  // 2. Continuous rotation and movement for snow swirl
  const createContinuousSnowMotion = () => {
    // Rotate
    Tween.createOrReplace(snowSwirl, {
      mode: Tween.Mode.Rotate({
        start: Quaternion.create(0, 0, 0, 1),
        end: Quaternion.create(0, 1, 0, 0) // Rotate 180 degrees around Y axis
      }),
      duration: 3,
      easingFunction: EasingFunction.EF_EASEINSINE
    })

    // Move up and down
    Tween.createOrReplace(snowSwirl, {
      mode: Tween.Mode.Move({
        start: Vector3.add(position, Vector3.create(0, 0.5, 0)),
        end: Vector3.add(position, Vector3.create(0, 2, 0))
      }),
      duration: 2,
      easingFunction: EasingFunction.EF_EASEINSINE
    })

    // Scale pulse
    Tween.createOrReplace(snowSwirl, {
      mode: Tween.Mode.Scale({
        start: Vector3.create(2, 2, 2),
        end: Vector3.create(2.5, 2.5, 2.5)
      }),
      duration: 1,
      easingFunction: EasingFunction.EF_EASEINSINE
    })
  }

  // Start continuous motion
  createContinuousSnowMotion()
  // Repeat the motion
  utils.timers.setInterval(createContinuousSnowMotion, 3000)

  // 3. Continuous pulse for ice crystals
  const createIceCrystalPulse = () => {
    Tween.createOrReplace(iceCrystals, {
      mode: Tween.Mode.Scale({
        start: Vector3.create(2, 2, 2),
        end: Vector3.create(2.3, 2.3, 2.3)
      }),
      duration: 1,
      easingFunction: EasingFunction.EF_EASEINSINE
    })
  }
  createIceCrystalPulse()
  utils.timers.setInterval(createIceCrystalPulse, 2000)

  // 4. Scale up the frost ground
  Tween.createOrReplace(frostGround, {
    mode: Tween.Mode.Scale({
      start: Vector3.create(0.1, 0.1, 0.1),
      end: Vector3.create(2.1, 2.1, 2.1)
    }),
    duration: 0.5,
    easingFunction: EasingFunction.EF_EASEINSINE
  })

  // 5. Continuous floating motion for spheres
  const createSphereMotion = (sphere: Entity) => {
    const spherePos = Transform.get(sphere).position
    const randomOffset = Math.random() * 0.5 - 0.25 // Random offset between -0.25 and 0.25

    // Move up and down with random offset
    Tween.createOrReplace(sphere, {
      mode: Tween.Mode.Move({
        start: Vector3.create(
          spherePos.x,
          position.y + 0.5 + randomOffset,
          spherePos.z
        ),
        end: Vector3.create(
          spherePos.x,
          position.y + 1.5 + randomOffset,
          spherePos.z
        )
      }),
      duration: 2,
      easingFunction: EasingFunction.EF_EASEINSINE
    })

    // Scale pulse
    Tween.createOrReplace(sphere, {
      mode: Tween.Mode.Scale({
        start: Vector3.create(0.5, 0.5, 0.5),
        end: Vector3.create(0.6, 0.6, 0.6)
      }),
      duration: 1,
      easingFunction: EasingFunction.EF_EASEINSINE
    })
  }

  // Start continuous motion for each sphere
  spheres.forEach((sphere) => {
    createSphereMotion(sphere)
    utils.timers.setInterval(() => createSphereMotion(sphere), 2000)
  })

  // Fade out and cleanup after duration
  utils.timers.setTimeout(() => {
    try {
      // Fade out all entities
      const fadeOutDuration = 0.5
      const entities = [
        blizzardArea,
        snowSwirl,
        iceCrystals,
        frostGround,
        ...spheres
      ]

      entities.forEach((entity) => {
        Tween.createOrReplace(entity, {
          mode: Tween.Mode.Scale({
            start: Vector3.create(2, 2, 2),
            end: Vector3.create(0, 0, 0)
          }),
          duration: fadeOutDuration,
          easingFunction: EasingFunction.EF_EASEINSINE
        })
      })

      // Remove entities after fade out
      utils.timers.setTimeout(() => {
        entities.forEach((entity) => {
          entityController.removeEntity(entity)
        })
      }, fadeOutDuration * 1000)
    } catch (error) {
      console.log('Error during blizzard effect cleanup:', error)
    }
  }, duration - 500) // Start fade out 500ms before cleanup
}
