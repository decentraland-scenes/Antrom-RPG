import { createDragon } from '../pets/dragon'
import { createOwl } from '../pets/owl'
import { createPhoenix } from '../pets/phoenix'

export function equipCompanion(companionName: string): void {
  if (
    companionName !== null &&
    companionName !== undefined &&
    companionName.trim() !== ''
  ) {
    switch (companionName) {
      case 'Owl':
        createOwl()
        break
      case 'Phoenix':
        createPhoenix()
        break
      case 'Dragon':
        createDragon()
    }
  }
}
