import {  Animator, GltfContainer, Transform, MeshRenderer, engine, VisibilityComponent } from "@dcl/sdk/ecs";
import { Character } from "./character";
import { Vector3 } from "@dcl/sdk/math";
import * as utils from '@dcl-sdk/utils'
import { MonsterAttackRanged } from "./monsterAttackRanged";


export class MonsterOligar extends Character{
    static globalHasSkill: boolean = true
    monsterShape?: string
    chickenShape?: { src: '' }
    shapeFile?: string
    shape: string = ''
    audioFile?: string
    // sound?: AudioSource
    // dyingSound?: AudioSource
     animator: string = 'attack'
    // idleClip: AnimationState
    // attackClip: AnimationState
    // walkClip: AnimationState
    // impactClip: AnimationState
    // dieClip: AnimationState
    engageDistance: number
    fightBackAnnouncement?: string
    isDeadAnimation: boolean
    isDead: boolean
    hoverText?: string
    // attackSound?: AudioSource
    // healthbar needs to be ui
   // healthBar: Entity
    // playerAttackUI: ui.CornerLabel
    label?: any
    topOffSet?: number
    initialPosition?: Vector3
    // attackSystem: ISystem
    attackSystemRanged?: MonsterAttackRanged
    isPrey: boolean = false
    dropRate: number = -1
    static setGlobalHasSkill(value: boolean):void {
        // Modify some static property or perform some global logic here.
       // MonsterOligar.globalHasSkill = value
    }

    constructor(
        attack: number,
        xp: number,
        level: number,
        health: number = 1,
        baseDefense = 0.01,
        engageDistance: number = 9,
        topOffset: number = 2.5
    ){
        super(attack, xp, level, health, baseDefense)
        this.isDead = false
        this.isDeadAnimation = false
        this.engageDistance = engageDistance
        // this.loadTransformation()

        // set-up animations for monsters
        // this.walkClip = new AnimationState("walk")
        // this.animator.addClip(this.walkClip)
        // this.impactClip = new AnimationState("impact", { looping: false })
        // this.animator.addClip(this.impactClip)
        // this.attackClip = new AnimationState("attack", {
        //     looping: false,
        //     layer: 2,
        // })
        // this.attackClip.onChange((e) => {
        //     //if(e.){}
        //     //log("logging e", e)
        // })
        // this.animator.addClip(this.attackClip)
        // this.dieClip = new AnimationState("die", { looping: false })
        // this.animator.addClip(this.dieClip)

        // monster sounds
        // this.dyingSound = enemyDyingAudioSource
        // this.addComponentOrReplace(this.dyingSound)
        //

        // this.attackSound = enemyAttackAudioSource
        // this.addComponentOrReplace(this.attackSound)
        //
        // let monDef = enemyDefAudioSource
        // this.addComponentOrReplace(monDef)
        //
        // let monHey = enemyHeyAudioSource
        // this.addComponentOrReplace(monHey)
        MonsterOligar.setGlobalHasSkill(true)
    }

    initMonster(): void {
        console.log("init")
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!this.shape && this.shapeFile) {
            // ????this.shape = new GLTFShape(this.shapeFile)
            // consult Agu
            this.shape = this.shapeFile
            console.log(this.shape,"HR")
            GltfContainer.createOrReplace(this.entity, { src: this.shape })
        }
        // if (this.audioFile) {
            // const clip = new AudioClip(this.audioFile)
            // this.sound = new AudioSource(clip)
            // this.addComponentOrReplace(this.sound)
        
        // }
        GltfContainer.createOrReplace(this.entity, { src: this.shape })
        Animator.createOrReplace(this.entity, {
            states: [{
                clip: this.animator,
                playing: true,
                loop: true,
            }]
        })
        
        // this.addComponent(this.animator)

        // implement the rest of animations on individual monster class
        // this.idleClip = new AnimationState("idle", {
        //     looping: true,
        //     layer: 0,
        // })
        // this.animator.addClip(this.idleClip)

        // Default Animation
        // this.idleClip.play()

        this.setupRangedAttackTriggerBox()
        //  this.setupEngageTriggerBox()
        //  this.setupAttackTriggerBox()

        // this.attackSystem = new MonsterAttack(this, Camera.instance, {
        //     moveSpeed: 2,
        //     engageDistance: this.engageDistance,
        // })

        // this.attackSystemRanged = new MonsterAttackRanged(
        //     this,
        //     Camera.instance,
        //     {
        //         moveSpeed: 2,
        //         engageDistance: this.engageDistance,
        //     }
        // )

        // this.setupAttackHandler()
    }

    create(): void {
        // function needs to be implemented per individual monster
        throw new Error("create is required to be implemented for this monster")
    }

    loadTransformation(): void {
        // function needs to be implemented per individual monster
        throw new Error(
            "loadTransformation is required to be implemented for this monster"
        )
    }

    setupRangedAttackTriggerBox(): void {
        // Transform.getMutable(this.triggerRangeAttack).scale = Vector3.create(4,4,4)
        
        MeshRenderer.setBox(this.entity)
        // VisibilityComponent.create(this.entity, { visible: false })
        utils.triggers.addTrigger(
            this.entity,
            1,
            1,
            [{ type: 'box', scale: Vector3.create(15, 2, 15) }],
            () => {
              console.log("trigger Ranged attack")
              if (this.isDeadAnimation) return
              // const CameraPos = Transform.get(engine.CameraEntity).position
              this.attackSystemRanged = new MonsterAttackRanged(this,{
                moveSpeed: 2,
                engageDistance: this.engageDistance,
            })
            },
            () => {
                console.log("im out")
                // eslint-disable-next-line no-useless-return
                if (this.isDeadAnimation) return
                 // engine.removeSystem( this.attackSystemRanged )
                 // this.playIdle()
            }
          )
    }

    setupEngageTriggerBox(): void {
        // Transform.getMutable(this.triggerRangeAttack).scale = Vector3.create(4,4,4)
        const entity = engine.addEntity()
        Transform.create(entity, {parent:this.entity})
        MeshRenderer.setBox(entity)
        VisibilityComponent.create(entity, { visible: false })
        utils.triggers.addTrigger(
            entity,
            1,
            1,
            [{ type: 'box', scale: Vector3.create(8, 2, 8) }],
            () => {
              console.log("trigger Attack")
            },
            () => {
                console.log("im out")
            }
          )
    }

    setupAttackTriggerBox(): void {
        // Transform.getMutable(this.triggerRangeAttack).scale = Vector3.create(4,4,4)
        const entity = engine.addEntity()
        Transform.create(entity, {parent:this.entity})
        MeshRenderer.setBox(entity)
        VisibilityComponent.create(entity, { visible: false })
        utils.triggers.addTrigger(
            entity,
            1,
            1,
            [{ type: 'box', scale: Vector3.create(4, 2, 4) }],
            () => {
              console.log("<<< Attack >>>")
            },
            () => {
                console.log("im out")
            }
          )
    }

}