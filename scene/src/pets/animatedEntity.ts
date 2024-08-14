import {
  Animator,
  GltfContainer,
  type PBAnimator,
  Transform,
  type Entity,
  type TransformType,
  type DeepReadonly
} from '@dcl/sdk/ecs'
import { entityController } from '../realms/entityController'

function needSetPlaying(
  animator: DeepReadonly<PBAnimator>,
  clip: string
): boolean {
  for (const state of animator.states) {
    if (state.playing !== (state.clip === clip)) {
      return true
    }
  }
  return false
}

export class AnimatedEntity {
  removed: boolean = false
  entity: Entity
  onRemove?: () => void
  constructor(model: string, transform: TransformType) {
    this.entity = entityController.addEntity()
    GltfContainer.create(this.entity, { src: model })
    Transform.create(this.entity, {
      position: transform.position,
      rotation: transform.rotation,
      scale: transform.scale
    })
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: 'attack',
          playing: true,
          loop: true
        },
        {
          clip: 'walk',
          playing: false,
          loop: true
        },
        {
          clip: 'idle',
          playing: false,
          loop: true
        },
        {
          clip: 'fly',
          playing: false,
          loop: false
        },
        {
          clip: 'run',
          playing: false,
          loop: false
        }
      ]
    })
  }

  attack(): void {
    if (!needSetPlaying(Animator.get(this.entity), 'attack')) return
    Animator.playSingleAnimation(this.entity, 'attack')
  }

  fly(): void {
    if (!needSetPlaying(Animator.get(this.entity), 'fly')) return
    Animator.playSingleAnimation(this.entity, 'fly')
  }

  idle(): void {
    if (!needSetPlaying(Animator.get(this.entity), 'idle')) return
    Animator.playSingleAnimation(this.entity, 'idle')
  }

  // Play walking animation
  walk(): void {
    if (!needSetPlaying(Animator.get(this.entity), 'walk')) return
    Animator.playSingleAnimation(this.entity, 'walk')
  }

  run(): void {
    if (!needSetPlaying(Animator.get(this.entity), 'run')) return
    Animator.playSingleAnimation(this.entity, 'run')
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations(): void {
    Animator.stopAllAnimations(this.entity)
  }

  remove(): void {
    if (!this.removed) {
      entityController.removeEntity(this.entity)
      this.removed = true
      if (this.onRemove != null) {
        this.onRemove()
      }
    }
  }
}
