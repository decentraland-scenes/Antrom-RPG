export enum PetTypes {
    PLACEHOLDER = 'placeholder',
    OWL = 'owl',
    PHOENIX = 'phoenix',
    DRAGON = 'dragon',
    SOLIDER = 'soldier'
}
// TODO AnimatedEntity and Pet classes

export class PetManager {
    pets: string[]
   // petInstances: { [key: string]: Pet }

    constructor(pets: string[] = []) {
        this.pets = pets;
    //    this.petInstances = {};
    }

    addPet(name: PetTypes): void {
        if (!this.hasPet(name)) {
            this.pets.push(name);
            // TODO api
            // executeTask(() => AddPetToPlayer(name))
        }
    }

    addPetInstance(name: string, pet: any): void {
       // this.petInstances[name] = pet;
    }

    getPetInstance(name: string):void {
       // return this.petInstances?.[name];
    }

    setPets(pets: string[] = []) {
        this.pets = pets;
    }

    removeInstance(name: string):void {
        const instance = this.getPetInstance(name);
        // if (instance) {
        //     instance.remove()
        //     delete this.petInstances[name];
        // }
    }

    removePet(name: string):void {
        this.pets = this.pets.filter((pet) => pet !== name)
    }

    hasPet(petName: PetTypes):boolean {
        return this.pets.indexOf(petName) !== -1;
    }

}
