/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  AudioSource,
  GltfContainer,
  InputAction,
  MeshRenderer,
  Transform,
  VisibilityComponent,
  engine,
  pointerEventsSystem,
  type Entity
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { applyDefSkillEffectToEnemyLocation } from '../effects/enemyDeffSkillActivation'
import { Player } from '../player/player'
import { getRandomInt } from '../utils/getRandomInt'
import { refreshtimer, setRefreshTimer } from '../utils/refresherTimer'
import { MonsterAttack } from './monsterAttack'
import { MonsterAttackRanged } from './monsterAttackRanged'
import { GenericMonster } from './monsterGeneric'
import { monsterModifiers } from './skillEffects'
import { entityController } from '../realms/entityController'
import { triggerSceneEmote } from '~system/RestrictedActions'
//
import { setupWebSocket } from '../wssServer/websocketService'
import { GameController } from '../controllers/game.controller'
import { currentlyAttackingMontserList } from './splashAttack'
import { getUserData } from '~system/UserIdentity'
import { getPlayer } from '@dcl/sdk/src/players'
import { displayAnnouncement } from '@dcl/ui-scene-utils'

const ws = setupWebSocket()

export class MonsterMobAuto extends GenericMonster {
  static globalHasSkill: boolean = true
  monsterShape?: string
  chickenShape?: { src: '' }
  shapeFile?: string
  shape: string = ''
  audioFile?: string
  idleClip: string = 'idle'
  attackClip: string = 'attack'
  walkClip: string = 'walk'
  impactClip: string = 'impact'
  dieClip: string = 'die'
  engageDistance: number
  fightBackAnnouncement?: string
  isDeadAnimation: boolean
  isDead: boolean
  // attackSound?: AudioSource
  // playerAttackUI: ui.CornerLabel
  rangeAttackTrigger!: Entity
  engageAttackTrigger!: Entity
  initialPosition?: Vector3
  attackSystemRanged!: MonsterAttackRanged
  attackSystem!: MonsterAttack
  isPrey: boolean = false
  dropRate: number = -1
  static setGlobalHasSkill(value: boolean): void {
    // Modify some static property or perform some global logic here.
    MonsterMobAuto.globalHasSkill = value
  }

  constructor(
    attack: number,
    xp: number,
    level: number,
    health: number = 1,
    baseDefense = 0.01,
    engageDistance: number = 9,
    topOffset: number = 2.5
  ) {
    super(attack, xp, level, health, baseDefense, topOffset)
    this.isDead = false
    this.isDeadAnimation = false
    this.engageDistance = engageDistance
    MonsterMobAuto.setGlobalHasSkill(true)

    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data)
      console.log('Server Data Recieved')
      switch (data.type) {
        case 'playerCreateRoom':
          {
            console.log('playerCreateRoom')
            async function createRoom() {
              // const playerRealm = await getCurrentRealm()
              console.log('player joined function entered')
              //UI.userText.visible = true
              //UI.userText.value = `${data.playerName} joined ${data.roomId}`
              // setTimeout(2000, () => {
              //     UI.userText.visible = false
              // })

              //engine.addEntity(this)
            }
            createRoom()
            // const playerTag = PlayerBoard.usersInRooms.filter((element) =>
            //     element.value.includes(data.playerName)
            // );

            // playerTag.forEach(tag => {
            //     let index = PlayerBoard.usersInRooms.findIndex(
            //         (element) => element.value === tag.value
            //     );
            //     if (index !== -1) {
            //         PlayerBoard.usersInRooms[index].visible = false;
            //         PlayerBoard.usersInRooms.splice(index, 1);
            //         console.log(`Removed UI element for player: ${data.playerName}`);
            //     } else {
            //       console.log(`Player UI element not found: ${data.playerName}`);
            //     }
            // });
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: 'getPlayersForRoom',
                  userId: data.userId,
                  realm: data.realm,
                  playerName: data.playerName,
                  playerHp: data.playerHp,
                  playerEther: data.playerEther
                })
              )
              console.log(
                `getPlayersForRoom: ${data.playerName}, HP: ${data.playerHp}, Realm: ${data.realm}, Room: ${data.roomId}, UserID: ${data.userId}`
              )
            }

            //this.initGetPlayersForRoom()
            // player.createPlayerLabel()
          }
          break
        case 'playerJoinedRoom':
          {
            console.log('playerJoinedRoom')
            async function joinRoom() {
              // const playerRealm = await getCurrentRealm()
              console.log('player joined function entered')
              // UI.userText.visible = true
              // UI.userText.value = `${data.playerName} joined ${data.roomId}`
              // setTimeout(2000, () => {
              //   UI.userText.visible = false
              // })

              //engine.addEntity(this)
            }
            joinRoom()

            // const playerTag = PlayerBoard.usersInRooms.filter((element) =>
            //   element.value.includes(data.playerName)
            // )

            // playerTag.forEach((tag) => {
            //   let index = PlayerBoard.usersInRooms.findIndex(
            //     (element) => element.value === tag.value
            //   )
            //   if (index !== -1) {
            //     PlayerBoard.usersInRooms[index].visible = false
            //     PlayerBoard.usersInRooms.splice(index, 1)
            //     console.log(`Removed UI element for player: ${data.playerName}`)
            //   } else {
            //     console.log(`Player UI element not found: ${data.playerName}`)
            //   }
            // })
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: 'getPlayersForRoom',
                  userId: data.userId,
                  realm: data.realm,
                  playerName: data.playerName,
                  playerHp: data.playerHp,
                  playerEther: data.playerEther
                })
              )

              console.log(
                `getPlayersForRoom: ${data.playerName}, HP: ${data.playerHp}, Realm: ${data.realm}, Room: ${data.roomId}, UserID: ${data.userId}`
              )
            }
          }
          break

        case 'playerLeftToClient':
          {
            console.log('playerLeftToClient')
            async function playerLeft() {
              console.log('inside player left client side')
              // UI.userText.visible = true
              // UI.userText.value = `${data.playerName} left ${data.roomId}`
              // setTimeout(2000, () => {
              //   UI.userText.visible = false
              // })
              console.log(`user Id data: ${data.userId}`)

              // const playerTag = PlayerBoard.usersInRooms.filter((element) =>
              //   element.value.includes(data.playerName)
              // )

              // playerTag.forEach((tag) => {
              //   let index = PlayerBoard.usersInRooms.findIndex(
              //     (element) => element.value === tag.value
              //   )
              //   if (index !== -1) {
              //     PlayerBoard.usersInRooms[index].visible = false
              //     PlayerBoard.usersInRooms.splice(index, 1)
              //     console.log(
              //       `Removed UI element for player: ${data.playerName}`
              //     )
              //   } else {
              //     console.log(`Player UI element not found: ${data.playerName}`)
              //   }
              // })
            }
            playerLeft()
          }
          break
        case 'returnPlayersInRoom':
          console.log('enter returnPlayersInRoom')
          if (data.players) {
            //PlayerBoard.usersInRoom(data.players)
            console.log('list of players', data.players)
          } else {
            console.log('No players data received')
          }
          break

        case 'returnRoomsInRealm':
          console.log('enter returnRoomsInRealm')
          if (data.rooms) {
            //PlayerBoard.roomsInRealm(data.rooms)
            console.log('List of Rooms', data.rooms)
          } else {
            console.log('No rooms data received')
          }
          break

        case 'returnRoomName':
          {
            if (data.roomId) {
              //PlayerBoard.returnRoomId(data.roomId)
              console.log(`Entered returnRoomName: ${data.roomId}`)
            } else {
              console.log(`Room ${data.roomId} does not exist`)
            }
          }
          break

        case 'roomFullOnJoin':
          {
            console.log('room full on join')
            //PlayerBoard.roomFullOnJoin(data.message)
          }
          break
        case 'changePlayerStatReceive':
          {
            console.log(`In player change PLayer Stats`)
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: 'getPlayersForRoom',
                  userId: data.userId,
                  realm: data.realm,
                  playerName: data.playerName,
                  playerHp: data.playerHp,
                  playerEther: data.playerEther
                })
              )
              console.log(`ran playerETHER ${data.playerEther}`)
            } else {
              console.log(`ws connection failed`)
            }
          }
          break

        case 'engageEnemyRecieve':
          {
            //this.AttackOnCameraEnter()
            async function EnteredMonsterBox() {
              console.log('inside enteredMonsterBox')
              // UI.userText.visible = true
              // UI.userText.value = `${data.userId} engaged Enemy`
              // setTimeout(2000, () => {
              //   UI.userText.visible = false
              // })
            }
            EnteredMonsterBox()
          }
          break
        case 'refillHealth': {
          const amount = data.amount
          const isCritical = data.isCritical

          Player.getInstance().refillHealthBar(amount, true)

          //applyWhiteSwirlToLocation(Camera.instance.feetPosition)

          displayAnnouncement(`HP increased by ${amount}`, 4, 2000)

          break
        }

        case 'decreaseHealth': {
          const amount = data.amount
          const isCritical = data.isCritical

          const playerInstance = Player.getInstance()
          playerInstance.reduceHealth(
            amount //playerInstance.maxHealth * 0.05
          )
          //checkHealth()

          //applyWhiteSwirlToLocation(Camera.instance.feetPosition)

          // this.gameController.uiController.displayAnnouncement(
          //   `HP decreased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )

          break
        }

        case 'shadowchainPlayerSkill': {
          const amount = data.amount
          const isCritical = data.isCritical

          //  Decrease the attack value of your opponent by 20% for 5R.
          const ATTACK_DEBUFF_PERCENT = amount / 100
          console.log(`Enemy attack: SKILL DAMAGE ${amount}`)
          monsterModifiers.updateAtkDebuff(-ATTACK_DEBUFF_PERCENT)

          // const DEF_DEBUFF_PERCENT = amount
          // monsterModifiers.updateDefBuff(-DEF_DEBUFF_PERCENT)

          //applyGeneralSkillEffectToLocation(Camera.instance.feetPosition, 2000)

          //Monster.setGlobalHasSkill(false)

          utils.timers.setTimeout(() => {
            monsterModifiers.updateAtkDebuff(ATTACK_DEBUFF_PERCENT)
            //monsterModifiers.updateDefBuff(DEF_DEBUFF_PERCENT)
            //Monster.setGlobalHasSkill(true)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `monster skills blocked and attack and def dropped`,
          //   Color4.Yellow(),
          //   2000
          // )

          break
        }

        case 'blockSkills': {
          const amount = data.amount
          const isCritical = data.isCritical

          //applyGeneralSkillEffectToLocation(Camera.instance.feetPosition, 2000)

          Player.setGlobalHasSkill(false)

          utils.timers.setTimeout(() => {
            Player.setGlobalHasSkill(true)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `Player skills blocked!`,
          //   Color4.Yellow(),
          //   2000
          // )

          break
        }

        case 'increaseAttack': {
          const amount = data.amount
          const isCritical = data.isCritical
          const ATTACK_BUFF = amount
          Player.getInstance().updateAtkBuff(ATTACK_BUFF)
          //applyRedSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateAtkBuff(-amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `Attack increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'decreaseAttack': {
          const amount = data.amount
          const isCritical = data.isCritical
          const ATTACK_BUFF = amount
          Player.getInstance().updateAtkBuff(-ATTACK_BUFF)
          //applyRedSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateAtkBuff(amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `Attack decreased by -${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'increaseMagic': {
          const amount = data.amount
          const isCritical = data.isCritical
          const MAGIC_BUFF = amount
          Player.getInstance().updateMagic(MAGIC_BUFF)
          //applyPurpleSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateMagic(-amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `MAGIC increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'increaseCritDamage': {
          const amount = data.amount
          const isCritical = data.isCritical
          const CRIT_DAMAGE_BUFF = amount
          //Player.getInstance().updateCritDamage(CRIT_DAMAGE_BUFF)
          //applyYellowSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            // Player.getInstance().updateCritDamage(-amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `Crit Damage increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )

          break
        }

        case 'increaseCritRate': {
          const amount = data.amount
          const isCritical = data.isCritical
          const CRIT_RATE_BUFF = amount
          Player.getInstance().updateCritRate(CRIT_RATE_BUFF)
          // applyCritRateEffectToLocation(Camera.instance.feetPosition)
          //applyYellowSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateCritRate(-amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `Crit rate increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'increaseLuck': {
          const amount = data.amount
          const isCritical = data.isCritical
          const LUCK_BUFF_PERCENT = amount

          Player.getInstance().updateLuckBuff(LUCK_BUFF_PERCENT)
          //applyRainbowSwirlToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateLuckBuff(-LUCK_BUFF_PERCENT)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `LUCK increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'increaseDef': {
          const amount = data.amount
          const isCritical = data.isCritical
          const DEF_BUFF = amount
          Player.getInstance().updateDefBuff(DEF_BUFF)
          //applyDefSkillEffectToLocation(Camera.instance.feetPosition)

          utils.timers.setTimeout(() => {
            Player.getInstance().updateDefBuff(-amount)
          }, isCritical * 1000)

          // this.gameController.uiController.displayAnnouncement(
          //   `DEF increased by ${amount}`,
          //   Color4.Yellow(),
          //   2000
          // )
          break
        }

        case 'leaveEnemyRecieve':
          //this.StopAttackOnCameraLeave()
          break
        case 'receiveGlobalSkillPlayerAttack':
          {
            switch (true) {
              case data.random < 300: {
                // 30% chance
                //bossDefense()
                //ui.displayAnnouncement("Oligar Used Divine Shield!")
                // applyDefSkillEffectToEnemyLocation(
                //   this.getComponent(Transform).position,
                //   4000
                // )
                //this.playerAttack = this.playerAttack / 2

                break
              }
              default: {
              }
            }
          }
          break
        case 'receiveMonsterAttackGlobalSkill': {
          switch (true) {
            case data.random < 60: {
              // 6% Chance

              //bossFireball()

              // const ATTACK_BONUS = 75
              //ui.displayAnnouncement("Oligar Used Fireball!")
              // applyEnemyAOESkillEffectToLocation(
              //     this.getComponent(Transform).position,
              //     6000
              // )
              // applyEnemySkillFireBallEffectToLocation(
              //   Camera.instance.feetPosition,
              //   6000
              // )
              // this.enemyAttack += ATTACK_BONUS
              // setTimeout(6 * 1000, () => {
              //    this.enemyAttack -= ATTACK_BONUS
              // })

              break
            }

            case data.random < 80: {
              // 8% Chance
              // playerIsPoisoned()

              // const damageOverTime = 50 // Adjust damage per tick as needed
              // const tickInterval = 2000 // Adjust interval between ticks as needed
              // //ui.displayAnnouncement("POISON TAKES EFFECT!")
              // console.log('before')
              // //@ts-ignore
              // const timer = setInterval(() => {
              //   this.attackPlayer(damageOverTime)
              //   //ui.displayAnnouncement("POISON HIT HERO!", 1)
              // }, tickInterval)

              // setTimeout(10 * 1000, () => {
              //   //ui.displayAnnouncement("POISON DONE HERO!", 1)
              //   //@ts-ignore
              //   clearInterval(timer) // Stop the DOT when the poison duration is over
              // }) // 15 seconds

              // if (player.health <= 0) {
              //   //@ts-ignore
              //   clearInterval(timer) // Stop the DOT if the monster is defeated
              // }

              break
            }

            case data.random < 150: {
              // 15% chance
              // bossHeal()

              // //refill wss call
              // this.refillHealthBar(0.025)
              // //ui.displayAnnouncement("Oligar Healed Itself By 25%!")
              // applyEnemyHealedEffectToLocation(
              //   this.getComponent(Transform).position
              // )

              break
            }
            default: {
            }
          }
        }
        case 'recievePlayerAttack':
          {
            this.performAttack(data.playerAttack, data.isCriticalAttack)
            monsterModifiers.activeSkills.forEach((skill) => {
              skill(data.isCriticalAttack, true, data.reduceHealthBy, this)
            })

            console.log('player attack: ', data.playerAttack)
          }
          break

        case 'receivePlayerHitMonster':
          this.handleAttack()
          break
      }
    }
  }

  initMonster(): void {
    console.log('init')
    if (!this.shape && this.shapeFile) {
      this.shape = this.shapeFile
      GltfContainer.createOrReplace(this.entity, { src: this.shape })
    }
    AudioSource.create(this.entity, {
      audioClipUrl: 'assets/sounds/attack.mp3',
      loop: false
    })
    if (this.audioFile) {
      // const clip = new AudioClip(this.audioFile)
      // this.sound = new AudioSource(clip)
      // this.addComponentOrReplace(this.sound)
    }
    GltfContainer.createOrReplace(this.entity, { src: this.shape })
    Animator.createOrReplace(this.entity, {
      states: [
        {
          clip: this.idleClip,
          playing: true,
          loop: true
        },
        {
          clip: this.attackClip,
          playing: false,
          loop: false
        },
        {
          clip: this.walkClip,
          playing: false,
          loop: true
        },
        {
          clip: this.impactClip,
          playing: false,
          loop: false
        },
        {
          clip: this.dieClip,
          playing: false,
          loop: false
        }
      ]
    })

    this.setupEngageTriggerBox()
    this.setupAttackTriggerBox()
    this.setupRangedAttackTriggerBox()

    this.attackSystem = new MonsterAttack(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance
    })

    this.attackSystemRanged = new MonsterAttackRanged(this, {
      moveSpeed: 2,
      engageDistance: this.engageDistance
    })

    this.setupAttackHandler()
  }

  refillHealthBar(percentage = 1): void {
    this.health += this.maxHealth * percentage
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
    this.updateHealthBar()
  }

  takeDamage(damage: number): void {
    this.health -= damage
    if (this.health < 0) {
      this.health = 0
    }
  }

  create(): void {
    // function needs to be implemented per individual monster
    throw new Error('create is required to be implemented for this monster')
  }

  onDropXp(): void {
    // function needs to be implemented per individual monster
    throw new Error('onDropXp is required to be implemented for this monster')
  }

  loadTransformation(): void {
    // function needs to be implemented per individual monster
    throw new Error(
      'loadTransformation is required to be implemented for this monster'
    )
  }

  setupRangedAttackTriggerBox(): void {
    this.rangeAttackTrigger = entityController.addEntity()
    Transform.create(this.rangeAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.rangeAttackTrigger)
    VisibilityComponent.create(this.rangeAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.rangeAttackTrigger,
      utils.NO_LAYERS,
      utils.LAYER_1,
      [{ type: 'box', scale: Vector3.create(15, 2, 15) }],
      () => {
        console.log('trigger Ranged attack')
        if (this.isDeadAnimation) return
        engine.addSystem(
          this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
        )
      },
      () => {
        console.log('im out')
        if (this.isDeadAnimation) return
        engine.removeSystem(
          this.attackSystemRanged.attackSystem.bind(this.attackSystemRanged)
        )
        Animator.stopAllAnimations(this.entity)
        Animator.playSingleAnimation(this.entity, this.idleClip)
      }
    )
  }

  setupEngageTriggerBox(): void {
    this.engageAttackTrigger = entityController.addEntity()
    Transform.create(this.engageAttackTrigger, { parent: this.entity })
    MeshRenderer.setBox(this.engageAttackTrigger)
    VisibilityComponent.create(this.engageAttackTrigger, { visible: false })
    utils.triggers.addTrigger(
      this.engageAttackTrigger,
      1,
      1,
      [{ type: 'box', scale: Vector3.create(8, 2, 8) }],
      () => {
        console.log('trigger Attack')
      },
      () => {
        console.log('im out')
      }
    )
  }

  setDistance(distance: number): void {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Click',
          maxDistance: distance
        }
      },
      function () {
        console.log('clicked entity')
      }
    )
  }

  dyingAnimation(): void {
    this.isDeadAnimation = true
    if (this.dieClip) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }
    this.create()
  }

  callDyingAnimation(): void {
    if (!this.isDeadAnimation) this.dyingAnimation()
  }

  killChar(): void {
    // TODO (first check if used )

    // lootEventManager.fireEvent(
    //     new LootDropEvent(
    //         this.getComponent(Transform).position,
    //         () => this.onDropLoot(),
    //         this.dropRate
    //     )
    // )
    utils.timers.setTimeout(() => {
      // TODO entity removing triggers error
      entityController.removeEntity(this.entity)
      entityController.removeEntity(this.rangeAttackTrigger)
      entityController.removeEntity(this.engageAttackTrigger)
      super.cleanup()
      this.isDead = true
    }, 5 * 1000)
  }

  isDeadOnce(): void {
    if (!this.isDead) this.killChar()
  }

  onDead(): void {
    this.onDropXp()
    this.callDyingAnimation()
    engine.removeSystem(this.attackSystemRanged.attackSystem)

    super.cleanup()
    if (this.rangeAttackTrigger != null) {
      entityController.removeEntity(this.rangeAttackTrigger)
      entityController.removeEntity(this.engageAttackTrigger)
    }
    utils.timers.setTimeout(() => {
      this.isDeadOnce()
    }, 1000)
  }

  performAttack(damage: number, isCriticalAttack: boolean): void {
    console.log('damaging monster: ' + damage)
    this.reduceHealth(damage)
    this.updateHealthBar()

    const mainHUD = Player.getInstance().gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastPlayerAttack = damage
      mainHUD.lastEnemyAttack = 'MISSED'
    }

    if (isCriticalAttack) {
      // UI from ui.ts
      // showCriticalIcon()
    }

    Animator.playSingleAnimation(this.entity, this.impactClip)
    if (this.health <= 0) {
      this.onDead()
    }
  }

  handleAttack(): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    if (this.health <= 0) {
      this.onDead()
      return
    }

    if (this.dieClip) {
      Animator.playSingleAnimation(this.entity, this.dieClip)
    }

    // const random = Math.random() * 1000
    if (refreshtimer > 0) {
      return
    }
    setRefreshTimer(1)

    //triggerSceneEmote({ src: 'assets/models/Axe_Combo.glb' })
    triggerSceneEmote({ src: 'assets/models/Bow_Updated.glb' })

    const monsterDiceResult = this.rollDice()
    const playerDiceResult = player.rollDice()
    const random = Math.random() * 1000
    const roundedPlayerDice = Math.floor(playerDiceResult)
    const roundedMonsterDice = Math.floor(monsterDiceResult)
    const mainHUD = player?.gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastPlayerRoll = roundedPlayerDice
      mainHUD.lastEnemyRoll = roundedMonsterDice
    }
    if (roundedMonsterDice <= roundedPlayerDice) {
      // Player attacks
      let defPercent = this.getDefensePercent()

      if (monsterModifiers.getDefBuff() !== 0) {
        defPercent = defPercent * monsterModifiers.getDefBuff()
        console.log('def %', defPercent)
      }

      const isCriticalAttack = getRandomInt(100) <= player.getCritRate()

      const reduceHealthBy = player.getPlayerAttack(isCriticalAttack) // remove monsters defence roll (bugged, monster has very high def) * (1 - defPercent)
      let playerAttack = Math.round(reduceHealthBy)
      switch (true) {
        case random < 1100: {
          // 30% chance
          // TODO UI
          // bossDefense()

          applyDefSkillEffectToEnemyLocation(
            Transform.getMutable(this.entity).position,
            4000
          )
          // reduce incoming attack by 50%
          playerAttack = playerAttack / 2

          break
        }
      }
      //this.performAttack(playerAttack, isCriticalAttack)
      const playerData = getPlayer()
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'sendPlayerAttack',
            playerAttack: playerAttack,
            userId: playerData?.userId,
            isCriticalAttack: isCriticalAttack,
            reduceHealthBy: reduceHealthBy
          })
        )
      }

      // MainHUD.getInstance().updateStats(
      //     `${roundedPlayerDice}`,
      //     `${roundedMonsterDice}`,
      //     `${playerAttack}`,
      //     `MISSED`
      // )

      monsterModifiers.activeSkills.forEach((skill) => {
        skill(isCriticalAttack, true, reduceHealthBy, this)
      })
    } else {
      // Monster attacks
      const defPercent = player.getDefensePercent()
      let enemyAttack = this.attack * (1 - defPercent)

      if (monsterModifiers.getAtkBuff() !== 0) {
        console.log('monster before modified: ' + enemyAttack)
        enemyAttack = enemyAttack * monsterModifiers.getAtkBuff()
        console.log(
          'monster after modified: ' +
            monsterModifiers.getAtkBuff() +
            ' ' +
            enemyAttack
        )
      }
      // createMissedLabel()

      const roundedAttack = Math.floor(enemyAttack)
      this.attackPlayer(roundedAttack)

      // MainHUD.getInstance().updateStats(
      //     `${roundedPlayerDice}`,
      //     `${roundedMonsterDice}`,
      //     `MISSED`,
      //     `${roundedAttack}`
      // )

      monsterModifiers.activeSkills.forEach((skill) => {
        skill(false, false, enemyAttack, this)
      })
    }
  }

  setupAttackHandler(): void {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'Attack Enemy!',
          maxDistance: 7
        }
      },
      async () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          const playerData = await getPlayer()
          ws.send(
            JSON.stringify({
              type: 'sendPlayerHitMonster',
              userId: playerData?.userId
            })
          )
          //log("Player Hit Monster WSS")
        } else {
          this.handleAttack()
        }
      }
    )
  }

  run(): void {
    Animator.playSingleAnimation(this.entity, this.walkClip)
  }

  playIdle(): void {
    Animator.playSingleAnimation(this.entity, this.idleClip)
  }

  playAttack(): void {
    Animator.playSingleAnimation(this.entity, this.attackClip)
  }

  attackPlayer(enemyAttack: number): void {
    const player = Player.getInstanceOrNull()
    if (player === null) return

    player.reduceHealth(enemyAttack)
    const mainHUD = player.gameController.uiController.mainHud
    if (mainHUD !== null) {
      mainHUD.lastEnemyAttack = enemyAttack
      mainHUD.lastPlayerAttack = 'MISSED'
    }

    this.playAttack()

    player.impactAnimation?.()
    // applyEnemyAttackedEffectToLocation(Camera.instance.feetPosition)

    AudioSource.playSound(this.entity, 'assets/sounds/attack.mp3')
    utils.timers.setTimeout(() => {
      // TODO from counters
      // checkHealth()
    }, 1000)
  }
}

export default MonsterMobAuto
