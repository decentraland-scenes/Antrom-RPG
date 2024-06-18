import { movePlayerTo } from "~system/RestrictedActions"
import { MonsterOligar } from "./monster"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { Transform } from "@dcl/sdk/ecs"

const DEFAULT_ATTACK = 0
const DEFAULT_XP = 1500
const DEFAULT_LEVEL = 0 //player.levels.getLevel(LEVEL_TYPES.PLAYER)
const DEFAULT_HP = 0

// const MODEL_NAMES = [
//     "models/SkeletonSword.glb",
//     "models/SkeletonSword.glb",
//     "models/SkeletonwBow.glb",
//     "models/Executioner.glb",
//     "models/ExecutionerAxe.glb",
//     "models/DarkKnight.glb",
//     "models/Chicken.glb",
//     "models/Ghost.glb",
//     "models/KnightSword.glb",
//     "models/RockMonster.glb",
//     "models/Sceleton.glb",
//     "models/TreeMonster.glb",
//     "models/Turkey.glb",
//     "models/zombie.glb",
//     "models/Undeadking.glb",
// ]
const MODEL_NAMES = [
    "models/ExecutionerAxe.glb",
    "models/ExecutionerAxe.glb",
    "models/ExecutionerAxe.glb",
    "models/ExecutionerAxe.glb",
    "models/ExecutionerAxe.glb",
    "models/ExecutionerAxe.glb",
]

function getRandomIntRange(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default class Bosses extends MonsterOligar {
    shapeFile = "models/Oligar.glb"
    hoverText = `Attack LVL 99999 Oligar!`
    minLuck = 50
    static currentModelIndex: number = 0
    static currentStage: number = 1
    static canCreate(): boolean {
        return Bosses.currentModelIndex < MODEL_NAMES.length
    }
    static currentInstance: Bosses 

    constructor() {
        if (!Bosses.canCreate()) {
            throw new Error(
                `No more models available for Oligar! ${Bosses.currentModelIndex}`
            )
        }
        const stage = Bosses.currentStage
        super(
            Math.round(DEFAULT_ATTACK + stage * 1.75),
            Math.round(DEFAULT_XP + stage * 4),
            Math.round(DEFAULT_LEVEL + stage * 0.25),
            Math.round(DEFAULT_HP + stage * 60)
        )
        this.shapeFile = MODEL_NAMES[Bosses.currentModelIndex]
        Bosses.currentModelIndex++
        this.initMonster()
        this.topOffSet = 2.55
        this.dropRate = 0
        // ui.displayAnnouncement(
        //     `total: ${Bosses.currentModelIndex} max: ${MODEL_NAMES.length}`
        // )
        Bosses.currentInstance = this
        this.loadTransformation()
        //Billboard.create(this.entity, {})
    }

    onDropXp() {
        movePlayerTo({ newRelativePosition: Vector3.create(77.12, 6.61, 27.78)})
        //Oligar.currentStage++
        if (!Bosses.canCreate()) {
            //ui.displayAnnouncement("You WIN")
            ////player.inventory.incrementItem(ITEM_TYPES.OLIGAR_HEAD, 1)

            Bosses.currentStage = 1
            // engine.removeEntity(Bosses.currentInstance)
            // Bosses.currentInstance = null // Reset the reference

            return
        }
    }

    onDropLoot(): void {}

   

    create(): void {
        const mons = new Bosses()
        //engine.addEntity(mons)
    }

    loadTransformation(): void {
        let initialPosition =  Vector3.create(getRandomIntRange(1,28), 0.88, 14)
        let initialRotation = Quaternion.fromEulerDegrees(0, 80, 0)
        Transform.createOrReplace(this.entity,{position: initialPosition, rotation: initialRotation })
    }
}


