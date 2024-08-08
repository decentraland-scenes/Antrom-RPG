import {
  GltfContainer,
  Transform,
  type TransformType,
  type Entity,
  Animator
} from '@dcl/sdk/ecs'
import { entityController } from '../realms/entityController'

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
    Animator.playSingleAnimation(this.entity, 'attack')
  }

  fly(): void {
    Animator.playSingleAnimation(this.entity, 'fly')
  }

  idle(): void {
    Animator.playSingleAnimation(this.entity, 'idle')
  }

  // Play walking animation
  walk(): void {
    Animator.playSingleAnimation(this.entity, 'walk')
  }

  run(): void {
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
