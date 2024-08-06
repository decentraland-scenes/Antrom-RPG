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
  petInstances: Record<string, Pet | null>

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

  addPetInstance(name: string, pet: Pet): void {
    this.petInstances[name] = pet
  }

  getPetInstance(name: string): Pet | null {
    return this.petInstances?.[name] ?? null
  }

  setPets(pets: string[] = []): void {
    this.pets = pets
  }

  removeInstance(name: string): void {
    const instance = this.getPetInstance(name)
    if (instance != null) {
      instance.remove()
      this.petInstances[name] = null
    }
  }

  removePet(name: string): void {
    this.pets = this.pets.filter((pet) => pet !== name)
  }

  hasPet(petName: PetTypes): boolean {
    return this.pets.includes(petName)
  }
}
