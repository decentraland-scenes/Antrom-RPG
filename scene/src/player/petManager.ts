import { AddPetToPlayer } from '../api/api'
import { type Pet } from '../pets/pet'

export enum PetTypes {
  PLACEHOLDER = 'placeholder',
  OWL = 'Owl',
  PHOENIX = 'Phoenix',
  DRAGON = 'Dragon',
  SOLIDER = 'Soldier'
}

export class PetManager {
  pets: string[]
  petInstances: Record<string, Pet>

  constructor(pets: string[] = []) {
    this.pets = pets
    this.petInstances = {}
  }

  async addPet(name: PetTypes): Promise<void> {
    if (!this.hasPet(name)) {
      this.pets.push(name)
      await AddPetToPlayer(name)
    }
  }

  addPetInstance(name: string, pet: any): void {
    this.petInstances[name] = pet
  }

  getPetInstance(name: string): Pet {
    return this.petInstances?.[name]
  }

  setPets(pets: string[] = []): void {
    this.pets = pets
  }

  removeInstance(name: string): void {
    const instance = this.getPetInstance(name)
    if (instance != null) {
      instance.remove()
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.petInstances[name]
    }
  }

  removePet(name: string): void {
    this.pets = this.pets.filter((pet) => pet !== name)
  }

  hasPet(petName: PetTypes): boolean {
    return this.pets.includes(petName)
  }
}
