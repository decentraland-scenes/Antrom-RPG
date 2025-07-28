import { UiCanvasInformation, engine, Transform, GltfContainer } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import Canvas from '../canvas/Canvas'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { AudioSource } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { InputAction, PointerEventType, inputSystem } from '@dcl/sdk/ecs'

export type UnitType = 'lumberjack' | 'miner' | 'farmer' | 'fighter'

export interface UnitDefinition {
  type: UnitType
  name: string
  cost: number
  resourceType: string
  harvestAmount: number
  harvestInterval: number
  range: number
  description: string
  modelPath: string
}

export const UNIT_DEFINITIONS: Record<UnitType, UnitDefinition> = {
  lumberjack: {
    type: 'lumberjack',
    name: 'Lumberjack',
    cost: 50,
    resourceType: 'Wood',
    harvestAmount: 3,
    harvestInterval: 3000,
    range: 5,
    description: 'Harvests wood from trees automatically. Places near trees.',
    modelPath: 'assets/models/Lumberjack.glb'
  },
  miner: {
    type: 'miner',
    name: 'Miner',
    cost: 75,
    resourceType: 'Stone',
    harvestAmount: 2,
    harvestInterval: 4000,
    range: 4,
    description: 'Mines stone from rocks automatically. Coming soon!',
    modelPath: 'assets/models/miner.glb'
  },
  farmer: {
    type: 'farmer',
    name: 'Farmer',
    cost: 60,
    resourceType: 'Food',
    harvestAmount: 4,
    harvestInterval: 5000,
    range: 6,
    description: 'Grows food from crops automatically. Coming soon!',
    modelPath: 'assets/models/FarmerMale1.glb'
  },
  fighter: {
    type: 'fighter',
    name: 'Fighter',
    cost: 100,
    resourceType: 'Combat',
    harvestAmount: 0,
    harvestInterval: 2000,
    range: 7,
    description: 'Attacks nearby enemies automatically. Places near player.',
    modelPath: 'assets/models/KnightSword.glb'
  }
}

// Function to find nearest available tree (existing code)
function findNearestAvailableTree(playerPosition: Vector3): Vector3 | null {
  const player = Player.getInstanceOrNull()
  if (!player) return null

  // Get current realm and its tree positions
  const currentRealm = player.gameController.realmController.currentRealm
  if (!currentRealm) return null

  // Get tree positions based on current realm
  let treePositions: Vector3[] = []
  
  if (currentRealm.getId() === 'antrom') {
    // Antrom realm tree positions
    treePositions = [
      Vector3.create(68.22, 4.23, 37.68),
      Vector3.create(73.37, 4.23, 37.98),
      Vector3.create(80.37, 4.64, 36.38),
      Vector3.create(89.51, 4.77, 35.48),
      Vector3.create(90.65, 5.23, 30.45),
      Vector3.create(90.55, 4.62, 36.34),
      Vector3.create(90.49, 5.25, 30.19),
      Vector3.create(91.11, 5.73, 22.33),
      Vector3.create(89.4, 6.24, 18.29),
      Vector3.create(83.85, 6.3, 14.67),
      Vector3.create(78.96, 6.43, 10.42),
      Vector3.create(73.12, 6.14, 9.67),
      Vector3.create(71.09, 5.95, 14.23),
      Vector3.create(66.51, 5.83, 18.53),
      Vector3.create(65.46, 5.51, 22.22),
      Vector3.create(71.52, 5.42, 21.97),
      Vector3.create(79.16, 5.0, 34.28),
      Vector3.create(68.49, 3.64, 42.92),
      Vector3.create(64.66, 4.09, 41.6),
      Vector3.create(69.33, 4.19, 37.98),
      Vector3.create(32.38, 3.31, 30.82),
      Vector3.create(39.0, 3.73, 34.3),
      Vector3.create(44.22, 4.36, 36.58),
      Vector3.create(50.6, 4.22, 39.34),
      Vector3.create(58.23, 4.3, 41.14),
      Vector3.create(52.7, 4.54, 37.22),
      Vector3.create(47.38, 4.98, 34.14),
      Vector3.create(40.76, 4.4, 31.16),
      Vector3.create(32.67, 4.07, 27.09),
      Vector3.create(26.12, 4.33, 21.41),
      Vector3.create(91.26, 6.91, 12.97),
      Vector3.create(86.65, 6.9, 10.55),
      Vector3.create(81.3, 7.06, 5.46),
      Vector3.create(87.76, 7.7, 5.06),
      Vector3.create(88.3, 5.32, 32.47),
      Vector3.create(55.47, 5.75, 28.67)
    ]
  } else if (currentRealm.getId() === 'dungeon') {
    // Dungeon realm tree positions
    treePositions = [
      Vector3.create(8, 0, 8),
      Vector3.create(12, 0, 8),
      Vector3.create(16, 0, 8),
      Vector3.create(8, 0, 12),
      Vector3.create(12, 0, 12),
      Vector3.create(16, 0, 12),
      Vector3.create(8, 0, 16),
      Vector3.create(12, 0, 16),
      Vector3.create(16, 0, 16)
    ]
  }

  let nearestTree: Vector3 | null = null
  let nearestDistance = Infinity

  for (const treePos of treePositions) {
    // Check if tree is already occupied
    if (player.isTreeOccupied(treePos)) {
      continue
    }

    const distance = Vector3.distance(playerPosition, treePos)
    if (distance < nearestDistance && distance <= 15) { // Within 15 units
      nearestDistance = distance
      nearestTree = treePos
    }
  }

  return nearestTree
}

function findNearestEnemy(playerPosition: Vector3): Vector3 | null {
  const player = Player.getInstanceOrNull()
  if (!player) return null

  // Get current realm and its enemies
  const currentRealm = player.gameController.realmController.currentRealm
  if (!currentRealm) return null

  let nearestEnemy: Vector3 | null = null
  let nearestDistance = Infinity

  if (currentRealm.getId() === 'antrom') {
    // Check executioners in Antrom realm
    const executioners = (currentRealm as any).executioners || []
    for (const executioner of executioners) {
      if (executioner && !executioner.isDead && executioner.health > 0) {
        const enemyPos = Transform.get(executioner.entity).position
        const distance = Vector3.distance(playerPosition, enemyPos)
        if (distance < nearestDistance && distance <= 20) { // Within 20 units
          nearestDistance = distance
          nearestEnemy = enemyPos
        }
      }
    }
  }

  return nearestEnemy
}

function findNearestAvailableRock(playerPosition: Vector3): Vector3 | null {
  const player = Player.getInstanceOrNull()
  if (!player) return null

  // Get current realm and its rocks
  const currentRealm = player.gameController.realmController.currentRealm
  if (!currentRealm) return null

  let nearestRock: Vector3 | null = null
  let nearestDistance = Infinity

  if (currentRealm.getId() === 'antrom') {
    console.log('Checking for rocks near player position:', playerPosition)
    
    // Use actual rock positions from Antrom realm
    const rockPositions = [
      // Negative Z area rocks
      Vector3.create(58.79, 1.26, -50.96),
      Vector3.create(50.85, 1.26, -45.08),
      Vector3.create(49.09, 1.26, -54.18),
      Vector3.create(52.56, 1.26, -23.76),
      Vector3.create(83.12, 1.26, -28.51),
      Vector3.create(85.94, 1.26, -15.38),
      Vector3.create(74.72, 1.26, -12.42),
      Vector3.create(55.71, 1.26, -38.81),
      Vector3.create(81.29, 1.26, -54.54),
      Vector3.create(84.09, 1.26, -39.22),
      Vector3.create(90.35, 1.26, -49.22),
      Vector3.create(70.79, 1.26, -61.73),
      Vector3.create(37.59, 4.64, -32.27),
      Vector3.create(28.28, 4.34, -28.64),
      Vector3.create(28.65, 4.49, -19.29),
      
      // Positive Z area rocks
      Vector3.create(44.78, 7.41, 18.91),
      Vector3.create(46.4, 3.76, 52.16),
      Vector3.create(51.94, 4.29, 56.65),
      Vector3.create(50.93, 4.48, 58.95),
      Vector3.create(46.97, 4.25, 57.51),
      Vector3.create(65.85, 4.08, 62.56),
      
      // Negative X area rocks
      Vector3.create(-42.15, 0.91, 37.1),
      Vector3.create(-34.41, 1.72, 41.06)
    ]
    
    for (const rockPos of rockPositions) {
      // Check if rock is already occupied
      if (player.isRockOccupied(rockPos)) {
        console.log('Rock at', rockPos, 'is already occupied')
        continue
      }
      
      const distance = Vector3.distance(playerPosition, rockPos)
      console.log('Rock at', rockPos, 'distance:', distance)
      
      if (distance < nearestDistance && distance <= 30) { // Increased to 30 units for testing
        nearestDistance = distance
        nearestRock = rockPos
        console.log('Found closer rock at', rockPos, 'distance:', distance)
      }
    }
    
    if (nearestRock) {
      console.log('Selected rock for miner placement:', nearestRock, 'distance:', nearestDistance)
    } else {
      console.log('No suitable rock found within 30 units')
    }
  }

  return nearestRock
}

function findNearestAnimal(playerPosition: Vector3): Vector3 | null {
  const player = Player.getInstanceOrNull()
  if (!player) return null

  // Get current realm and its animals
  const currentRealm = player.gameController.realmController.currentRealm
  if (!currentRealm) return null

  let nearestAnimal: Vector3 | null = null
  let nearestDistance = Infinity

  if (currentRealm.getId() === 'antrom') {
    // Check pigs and chickens in Antrom realm
    const pigs = (currentRealm as any).pigs || []
    const chickens = (currentRealm as any).chickens || []
    
    // Check pigs
    for (const pig of pigs) {
      if (pig && !pig.isDead && pig.health > 0) {
        const animalPos = Transform.get(pig.entity).position
        const distance = Vector3.distance(playerPosition, animalPos)
        if (distance < nearestDistance && distance <= 20) { // Within 20 units
          nearestDistance = distance
          nearestAnimal = animalPos
        }
      }
    }
    
    // Check chickens
    for (const chicken of chickens) {
      if (chicken && !chicken.isDead && chicken.health > 0) {
        const animalPos = Transform.get(chicken.entity).position
        const distance = Vector3.distance(playerPosition, animalPos)
        if (distance < nearestDistance && distance <= 20) { // Within 20 units
          nearestDistance = distance
          nearestAnimal = animalPos
        }
      }
    }
  }

  return nearestAnimal
}

export class PurchaseMenu {
  public isVisible: boolean = false
  public selectedUnit: UnitType | null = null
  public isPlacing: boolean = false
  public placingUnitType: UnitType | null = null
  private placementSystem: (() => void) | null = null

  constructor() {
    // Initialize UI
  }

  show(): void {
    this.isVisible = true
    this.selectedUnit = null
  }

  hide(): void {
    this.isVisible = false
    this.selectedUnit = null
    this.isPlacing = false
    this.placingUnitType = null
    
    // Clean up placement system if it exists
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }
  }

  private clearPlacementState(): void {
    this.isPlacing = false
    this.placingUnitType = null
    
    // Clean up placement system if it exists
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }
  }

  selectUnit(unitType: UnitType): void {
    this.selectedUnit = unitType
    console.log('Selected unit:', unitType)
    
    // Play button click sound
    const soundEntity = engine.addEntity()
    AudioSource.create(soundEntity, {
      audioClipUrl: 'assets/sounds/buttonclick.mp3',
      loop: false,
      playing: true
    })
    
    // Remove sound entity after playing
    utils.timers.setTimeout(() => {
      engine.removeEntity(soundEntity)
    }, 1000)
  }

  canPurchaseUnit(unitType: UnitType): boolean {
    const player = Player.getInstanceOrNull()
    if (!player) return false
    
    const unitDef = UNIT_DEFINITIONS[unitType]
    return player.inventory.getItemCount(ITEM_TYPES.COIN) >= unitDef.cost
  }

  purchaseUnit(unitType: UnitType): void {
    const player = Player.getInstanceOrNull()
    if (!player) return
    
    const unitDef = UNIT_DEFINITIONS[unitType]
    
    if (player.inventory.getItemCount(ITEM_TYPES.COIN) >= unitDef.cost) {
      // For now, only implement lumberjack and fighter placement
      if (unitType === 'lumberjack') {
        // Check if we can actually place a lumberjack before deducting gold
        const playerPos = Transform.get(engine.PlayerEntity).position
        const nearestTree = findNearestAvailableTree(playerPos)
        
        if (!nearestTree) {
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 200
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 3000)
          
          player.gameController.uiController.displayAnnouncement(
            'Must be near an unoccupied tree to place lumberjack!',
            Color4.Red(),
            3000
          )
          return
        }
        
        // Only deduct gold if we can actually place the unit
        player.inventory.incrementItem(ITEM_TYPES.COIN, -unitDef.cost)
        this.startLumberjackPlacement()
      } else if (unitType === 'fighter') {
        // Check if we can actually place a fighter before deducting gold
        const playerPos = Transform.get(engine.PlayerEntity).position
        const nearestEnemy = findNearestEnemy(playerPos)
        
        if (!nearestEnemy) {
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          player.gameController.uiController.displayAnnouncement(
            'No enemies nearby! Place fighter near enemies.',
            Color4.Red(),
            3000
          )
          return
        }
        
        // Only deduct gold if we can actually place the unit
        player.inventory.incrementItem(ITEM_TYPES.COIN, -unitDef.cost)
        this.startFighterPlacement()
      } else if (unitType === 'miner') {
        // Check if we can actually place a miner before deducting gold
        const playerPos = Transform.get(engine.PlayerEntity).position
        const nearestRock = findNearestAvailableRock(playerPos)
        
        if (!nearestRock) {
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          player.gameController.uiController.displayAnnouncement(
            'Must be near rocks to place miner!',
            Color4.Red(),
            3000
          )
          return
        }
        
        // Only deduct gold if we can actually place the unit
        player.inventory.incrementItem(ITEM_TYPES.COIN, -unitDef.cost)
        this.startMinerPlacement()
      } else if (unitType === 'farmer') {
        // Check if we can actually place a farmer before deducting gold
        const playerPos = Transform.get(engine.PlayerEntity).position
        const nearestAnimal = findNearestAnimal(playerPos)
        
        if (!nearestAnimal) {
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          player.gameController.uiController.displayAnnouncement(
            'Must be near animals to place farmer!',
            Color4.Red(),
            3000
          )
          return
        }
        
        // Only deduct gold if we can actually place the unit
        player.inventory.incrementItem(ITEM_TYPES.COIN, -unitDef.cost)
        this.startFarmerPlacement()
      } else {
        // Play invalid placement sound for unavailable units
        const soundEntity = engine.addEntity()
        AudioSource.create(soundEntity, {
          audioClipUrl: 'assets/sounds/invalidplacement.mp3',
          loop: false,
          playing: true,
          volume: 0.8
        })
        
        // Remove sound entity after playing
        utils.timers.setTimeout(() => {
          engine.removeEntity(soundEntity)
        }, 3000)
        
        // Show placeholder message for other units
        player.gameController.uiController.displayAnnouncement(
          `${unitDef.name} coming soon!`,
          Color4.Yellow(),
          3000
        )
      }
    }
  }

  private startLumberjackPlacement(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }

    this.isPlacing = true
    this.placingUnitType = 'lumberjack'
    this.isVisible = false

    player.gameController.uiController.displayAnnouncement(
      'Click on a tree to assign lumberjack!',
      Color4.Blue(),
      5000
    )

    let placementActive = false
    let lastClickPosition: Vector3 | null = null

    utils.timers.setTimeout(() => {
      placementActive = true
      console.log('Lumberjack placement system now active')
    }, 1000) // 1 second delay

    this.placementSystem = () => {
      if (this.isPlacing && this.placingUnitType === 'lumberjack' && placementActive && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        const input = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        if (input && input.hit && input.hit.position) {
          lastClickPosition = input.hit.position
        }

        const playerPos = Transform.get(engine.PlayerEntity).position
        const availableTrees = this.getAllAvailableTrees(playerPos)

        if (availableTrees.length === 0) {
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 3000)
          
          player.gameController.uiController.displayAnnouncement(
            'No available trees nearby! Move closer to trees.',
            Color4.Red(),
            3000
          )
          this.clearPlacementState()
          return
        }

        if (!lastClickPosition) {
          player.gameController.uiController.displayAnnouncement(
            'Could not detect click position. Try again.',
            Color4.Red(),
            2000
          )
          return
        }

        const selectedTree = this.findClickedTree(lastClickPosition)

        if (!selectedTree) {
          player.gameController.uiController.displayAnnouncement(
            'Click directly on a tree to assign lumberjack!',
            Color4.Red(),
            2000
          )
          return
        }

        const angle = Math.random() * Math.PI * 2
        const distance = 2 + Math.random() * 2
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          selectedTree.x + offsetX,
          selectedTree.y - 0.5,
          selectedTree.z + offsetZ
        )

        console.log('Placing lumberjack at:', placementPos, 'next to selected tree at:', selectedTree)
        this.placeLumberjack(placementPos, selectedTree)
      }
    }
    engine.addSystem(this.placementSystem)
  }

  private placeLumberjack(position: Vector3, treePosition: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    player.addLumberjack(position, treePosition)
    this.hide()
    
    // Play lumberjack deployment sound
    const soundEntity = engine.addEntity()
    AudioSource.create(soundEntity, {
      audioClipUrl: this.getRandomLumberjackSound(),
      loop: false,
      playing: true,
      volume: 1.0
    })
    
    // Remove sound entity after playing
    utils.timers.setTimeout(() => {
      engine.removeEntity(soundEntity)
    }, 3000)
    
    // Show success message
    player.gameController.uiController.displayAnnouncement(
      'Lumberjack deployed!',
      Color4.Green(),
      2000
    )
  }

  private startFighterPlacement(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Clean up any existing placement system
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }

    this.isPlacing = true
    this.placingUnitType = 'fighter'
    this.isVisible = false
    
    // Create placement system for fighter
    this.placementSystem = () => {
      if (this.isPlacing && this.placingUnitType === 'fighter' && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // Get player position
        const playerPos = Transform.get(engine.PlayerEntity).position
        
        // Check if there are enemies nearby
        const nearestEnemy = findNearestEnemy(playerPos)
        if (!nearestEnemy) {
          // No enemies nearby, show invalid placement message
          player.gameController.uiController.displayAnnouncement(
            'No enemies nearby! Place fighter near enemies.',
            Color4.Red(),
            3000
          )
          
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          // Clear placement state but keep menu open
          this.clearPlacementState()
          return
        }
        
        // Place fighter next to the player
        const angle = Math.random() * Math.PI * 2
        const distance = 2 + Math.random() * 2
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          playerPos.x + offsetX,
          playerPos.y - 0.5,
          playerPos.z + offsetZ
        )
        
        console.log('Placing fighter at:', placementPos, 'next to player at:', playerPos, 'near enemy at:', nearestEnemy)
        this.placeFighter(placementPos)
      }
    }
    
    engine.addSystem(this.placementSystem)
  }

  private placeFighter(position: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    player.addFighter(position)
    this.hide()
    
    // Play fighter deployment sound
    const soundEntity = engine.addEntity()
    AudioSource.create(soundEntity, {
      audioClipUrl: this.getRandomKnightSound(),
      loop: false,
      playing: true,
      volume: 1.0
    })
    
    // Remove sound entity after playing
    utils.timers.setTimeout(() => {
      engine.removeEntity(soundEntity)
    }, 3000)
    
    // Show success message - removed to reduce spam
  }

  private startMinerPlacement(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Clean up any existing placement system
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }

    this.isPlacing = true
    this.placingUnitType = 'miner'
    this.isVisible = false
    
    // Show instruction to player
    player.gameController.uiController.displayAnnouncement(
      'Click on a rock to assign miner!',
      Color4.Blue(),
      5000
    )
    
    // Add a delay before the placement system becomes active
    let placementActive = false
    let lastClickPosition: Vector3 | null = null
    
    utils.timers.setTimeout(() => {
      placementActive = true
      console.log('Miner placement system now active')
    }, 1000) // 1 second delay
    
    // Create placement system for miner
    this.placementSystem = () => {
      if (this.isPlacing && this.placingUnitType === 'miner' && placementActive && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // Store the click position immediately
        const input = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        if (input && input.hit && input.hit.position) {
          lastClickPosition = input.hit.position
        }
        
        // Get player position
        const playerPos = Transform.get(engine.PlayerEntity).position
        
        // Get all available rocks in the area
        const availableRocks = this.getAllAvailableRocks(playerPos)
        
        if (availableRocks.length === 0) {
          console.log('No available rocks found near player position:', playerPos)
          
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          player.gameController.uiController.displayAnnouncement(
            'No available rocks nearby! Move closer to rocks.',
            Color4.Red(),
            3000
          )
          // Clear placement state but keep menu open
          this.clearPlacementState()
          return
        }
        
        // Use the stored click position
        if (!lastClickPosition) {
          player.gameController.uiController.displayAnnouncement(
            'Could not detect click position. Try again.',
            Color4.Red(),
            2000
          )
          return
        }
        
        const selectedRock = this.findClickedRock(lastClickPosition)
        
        if (!selectedRock) {
          player.gameController.uiController.displayAnnouncement(
            'Click directly on a rock to assign miner!',
            Color4.Red(),
            2000
          )
          return
        }
        
        // Place miner next to the selected rock
        const angle = Math.random() * Math.PI * 2
        const distance = 2 + Math.random() * 2
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          selectedRock.x + offsetX,
          selectedRock.y - 0.5,
          selectedRock.z + offsetZ
        )
        
        console.log('Placing miner at:', placementPos, 'next to selected rock at:', selectedRock)
        this.placeMiner(placementPos, selectedRock)
      }
    }
    
    engine.addSystem(this.placementSystem)
  }

  private placeMiner(position: Vector3, rockPosition: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    player.addMiner(position, rockPosition)
    this.hide()
    
    // Play miner deployment sound
    const soundEntity = engine.addEntity()
    AudioSource.create(soundEntity, {
      audioClipUrl: this.getRandomMinerSound(),
      loop: false,
      playing: true,
      volume: 1.0
    })
    
    // Remove sound entity after playing
    utils.timers.setTimeout(() => {
      engine.removeEntity(soundEntity)
    }, 3000)
    
    // Show success message
    player.gameController.uiController.displayAnnouncement(
      'Miner deployed!',
      Color4.Green(),
      2000
    )
  }

  private startFarmerPlacement(): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    // Clean up any existing placement system
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }

    this.isPlacing = true
    this.placingUnitType = 'farmer'
    this.isVisible = false
    
    // Create placement system for farmer
    this.placementSystem = () => {
      if (this.isPlacing && this.placingUnitType === 'farmer' && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // Get player position
        const playerPos = Transform.get(engine.PlayerEntity).position
        
        // Check if there are animals nearby
        const nearestAnimal = findNearestAnimal(playerPos)
        if (!nearestAnimal) {
          // No animals nearby, show invalid placement message
          player.gameController.uiController.displayAnnouncement(
            'No animals nearby! Place farmer near animals.',
            Color4.Red(),
            3000
          )
          
          // Play invalid placement sound
          const soundEntity = engine.addEntity()
          AudioSource.create(soundEntity, {
            audioClipUrl: 'assets/sounds/invalidplacement.mp3',
            loop: false,
            playing: true,
            volume: 0.8
          })
          
          // Remove sound entity after playing
          utils.timers.setTimeout(() => {
            engine.removeEntity(soundEntity)
          }, 1000)
          
          // Clear placement state but keep menu open
          this.clearPlacementState()
          return
        }
        
        // Place farmer next to the player
        const angle = Math.random() * Math.PI * 2
        const distance = 2 + Math.random() * 2
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          playerPos.x + offsetX,
          playerPos.y - 0.5,
          playerPos.z + offsetZ
        )
        
        console.log('Placing farmer at:', placementPos, 'next to player at:', playerPos, 'near animal at:', nearestAnimal)
        this.placeFarmer(placementPos)
      }
    }
    
    engine.addSystem(this.placementSystem)
  }

  private placeFarmer(position: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    player.addFarmer(position)
    this.hide()
    
    // Play farmer deployment sound
    const soundEntity = engine.addEntity()
    AudioSource.create(soundEntity, {
      audioClipUrl: this.getRandomFarmerSound(),
      loop: false,
      playing: true,
      volume: 1.0
    })
    
    // Remove sound entity after playing
    utils.timers.setTimeout(() => {
      engine.removeEntity(soundEntity)
    }, 3000)
    
    // Show success message
    player.gameController.uiController.displayAnnouncement(
      'Farmer deployed!',
      Color4.Green(),
      2000
    )
  }

  private getUnitIcon(unitType: UnitType): string {
    switch (unitType) {
      case 'lumberjack':
        return '🪓' // Will be replaced with icon
      case 'miner':
        return '⛏️' // Will be replaced with icon
      case 'farmer':
        return '🌾' // Will be replaced with icon
      case 'fighter':
        return '⚔️' // Will be replaced with icon
      default:
        return '❓'
    }
  }

  private getUnitIconPath(unitType: UnitType): string {
    switch (unitType) {
      case 'lumberjack':
        return 'assets/images/unitPurchase/icons/lumberjack_icon.png'
      case 'miner':
        return 'assets/images/unitPurchase/icons/miner_icon.png'
      case 'farmer':
        return 'assets/images/unitPurchase/icons/farmer_icon.png'
      case 'fighter':
        return 'assets/images/unitPurchase/icons/fighter_icon.png'
      default:
        return ''
    }
  }

  private getRandomKnightSound(): string {
    const knightSounds = [
      'assets/sounds/knight_unit_sounds/knight_unit1.mp3',
      'assets/sounds/knight_unit_sounds/knight_unit2.mp3',
      'assets/sounds/knight_unit_sounds/knight_unit3.mp3'
    ]
    const randomIndex = Math.floor(Math.random() * knightSounds.length)
    return knightSounds[randomIndex]
  }

  private getRandomLumberjackSound(): string {
    const lumberjackSounds = [
      'assets/sounds/lumberjack_unit_sounds/lj_unit1.mp3',
      'assets/sounds/lumberjack_unit_sounds/lj_unit2.mp3',
      'assets/sounds/lumberjack_unit_sounds/lj_unit3.mp3'
    ]
    const randomIndex = Math.floor(Math.random() * lumberjackSounds.length)
    return lumberjackSounds[randomIndex]
  }

  private getRandomMinerSound(): string {
    const minerSounds = [
      'assets/sounds/miner_unit_sounds/miner_unit1.mp3',
      'assets/sounds/miner_unit_sounds/miner_unit2.mp3',
      'assets/sounds/miner_unit_sounds/miner_unit3.mp3'
    ]
    const randomIndex = Math.floor(Math.random() * minerSounds.length)
    return minerSounds[randomIndex]
  }

  private getRandomFarmerSound(): string {
    const farmerSounds = [
      'assets/sounds/farmer_unit_sounds/farmer_unit1.mp3',
      'assets/sounds/farmer_unit_sounds/farmer_unit2.mp3',
      'assets/sounds/farmer_unit_sounds/farmer_unit3.mp3'
    ]
    const randomIndex = Math.floor(Math.random() * farmerSounds.length)
    return farmerSounds[randomIndex]
  }

  private getAllAvailableRocks(playerPosition: Vector3): Vector3[] {
    const player = Player.getInstanceOrNull()
    if (!player) return []

    const availableRocks: Vector3[] = []
    const rockPositions = [
      Vector3.create(58.79, 1.26, -50.96),
      Vector3.create(50.85, 1.26, -45.08),
      Vector3.create(49.09, 1.26, -54.18),
      Vector3.create(52.56, 1.26, -23.76),
      Vector3.create(83.12, 1.26, -28.51),
      Vector3.create(85.94, 1.26, -15.38),
      Vector3.create(74.72, 1.26, -12.42),
      Vector3.create(55.71, 1.26, -38.81),
      Vector3.create(81.29, 1.26, -54.54),
      Vector3.create(84.09, 1.26, -39.22),
      Vector3.create(90.35, 1.26, -49.22),
      Vector3.create(70.79, 1.26, -61.73),
      Vector3.create(37.59, 4.64, -32.27),
      Vector3.create(28.28, 4.34, -28.64)
    ]

    for (const rockPos of rockPositions) {
      // Check if rock is within reasonable distance of player
      const distance = Vector3.distance(playerPosition, rockPos)
      if (distance <= 50 && !player.isRockOccupied(rockPos)) {
        availableRocks.push(rockPos)
      }
    }

    return availableRocks
  }

  private getAllAvailableTrees(playerPosition: Vector3): Vector3[] {
    const player = Player.getInstanceOrNull()
    if (!player) return []

    const availableTrees: Vector3[] = []
    const treePositions = [
      Vector3.create(68.22, 4.23, 37.68),
      Vector3.create(73.37, 4.23, 37.98),
      Vector3.create(80.37, 4.64, 36.38),
      Vector3.create(89.51, 4.77, 35.48),
      Vector3.create(90.65, 5.23, 30.45),
      Vector3.create(90.55, 4.62, 36.34),
      Vector3.create(90.49, 5.25, 30.19),
      Vector3.create(91.11, 5.73, 22.33),
      Vector3.create(89.4, 6.24, 18.29),
      Vector3.create(83.85, 6.3, 14.67),
      Vector3.create(78.96, 6.43, 10.42),
      Vector3.create(73.12, 6.14, 9.67),
      Vector3.create(71.09, 5.95, 14.23),
      Vector3.create(66.51, 5.83, 18.53),
      Vector3.create(65.46, 5.51, 22.22),
      Vector3.create(71.52, 5.42, 21.97),
      Vector3.create(79.16, 5.0, 34.28),
      Vector3.create(68.49, 3.64, 42.92),
      Vector3.create(64.66, 4.09, 41.6),
      Vector3.create(69.33, 4.19, 37.98),
      Vector3.create(32.38, 3.31, 30.82),
      Vector3.create(39.0, 3.73, 34.3),
      Vector3.create(44.22, 4.36, 36.58),
      Vector3.create(50.6, 4.22, 39.34),
      Vector3.create(58.23, 4.3, 41.14),
      Vector3.create(52.7, 4.54, 37.22),
      Vector3.create(47.38, 4.98, 34.14),
      Vector3.create(40.76, 4.4, 31.16),
      Vector3.create(32.67, 4.07, 27.09),
      Vector3.create(26.12, 4.33, 21.41),
      Vector3.create(91.26, 6.91, 12.97),
      Vector3.create(86.65, 6.9, 10.55),
      Vector3.create(81.3, 7.06, 5.46),
      Vector3.create(87.76, 7.7, 5.06),
      Vector3.create(88.3, 5.32, 32.47),
      Vector3.create(55.47, 5.75, 28.67)
    ]

    for (const treePos of treePositions) {
      // Check if tree is within reasonable distance of player
      const distance = Vector3.distance(playerPosition, treePos)
      if (distance <= 50 && !player.isTreeOccupied(treePos)) {
        availableTrees.push(treePos)
      }
    }

    return availableTrees
  }

  private getClickPosition(): Vector3 | null {
    // Get the actual click position from the input system
    const input = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    if (input && input.hit && input.hit.position) {
      return input.hit.position
    }
    return null
  }

  private findClickedRock(clickPosition: Vector3): Vector3 | null {
    // Get the actual clicked entity from the input system
    const input = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    if (!input || !input.hit || !input.hit.entityId) {
      return null
    }

    // Check if the clicked entity is a rock by looking at its model
    const clickedEntity = input.hit.entityId as any
    const gltfContainer = GltfContainer.getOrNull(clickedEntity)
    
    if (gltfContainer && gltfContainer.src.includes('mining.glb')) {
      // This is a rock! Get its position
      const transform = Transform.getOrNull(clickedEntity)
      if (transform) {
        console.log('Clicked on rock at position:', transform.position)
        return transform.position
      }
    }

    return null
  }

  private findClickedTree(clickPosition: Vector3): Vector3 | null {
    // Get the actual clicked entity from the input system
    const input = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    if (!input || !input.hit || !input.hit.entityId) {
      return null
    }

    // Check if the clicked entity is a tree by looking at its model
    const clickedEntity = input.hit.entityId as any
    const gltfContainer = GltfContainer.getOrNull(clickedEntity)
    
    if (gltfContainer && gltfContainer.src.includes('Pine.glb')) {
      // This is a tree! Get its position
      const transform = Transform.getOrNull(clickedEntity)
      if (transform) {
        console.log('Clicked on tree at position:', transform.position)
        return transform.position
      }
    }

    return null
  }

  render(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null

    const player = Player.getInstanceOrNull()
    if (!player) return null

    const goldAmount = player.inventory.getItemCount(ITEM_TYPES.COIN)

    return (
      <Canvas>
        {/* Background Overlay */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            positionType: 'absolute',
            position: { left: 0, top: 0 }
          }}
          uiBackground={{ color: Color4.create(0, 0, 0, 0.4) }}
        />
        
        {/* Main Menu Container */}
        <UiEntity
          uiTransform={{
            width: '800px',
            height: '600px',
            positionType: 'absolute',
            position: { left: '50%', top: '50%' },
            margin: { left: '-400px', top: '-300px' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'assets/images/unitPurchase/frames/purchase_menu_frame.png'
            }
          }}
        >
          {/* Grey Background Fill */}
          <UiEntity
            uiTransform={{
              width: '90%',
              height: '90%',
              positionType: 'absolute',
              position: { left: '5%', top: '5%' }
            }}
            uiBackground={{ color: Color4.create(0.15, 0.15, 0.15, 1.0) }}
          />
          {/* Header */}
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '50px',
              margin: { top: '40px' },
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            {/* Title - Centered */}
            <UiEntity
              uiTransform={{
                width: '80%',
                height: '100%'
              }}
              uiText={{
                value: 'WORKERS & UNITS',
                fontSize: 24,
                color: Color4.White(),
                textAlign: 'middle-center'
              }}
            />
            
            {/* Close button */}
            <UiEntity
              uiTransform={{
                width: '40px',
                height: '40px',
                positionType: 'absolute',
                position: { right: '40px', top: '-10px' }
              }}
              uiBackground={{
                color: Color4.create(0.8, 0.2, 0.2, 1.0)
              }}
              onMouseDown={() => this.hide()}
            >
              <Label
                value="X"
                fontSize={20}
                color={Color4.White()}
                textAlign="middle-center"
                uiTransform={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </UiEntity>
          </UiEntity>

          {/* Coin Display */}
          <UiEntity
            uiTransform={{
              width: '200px',
              height: '40px',
              positionType: 'absolute',
              position: { left: '50px', top: '40px' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/unitPurchase/frames/Background_Square_skill.png'
              }
            }}
          >
            <Label
              value={`Coin: ${goldAmount}`}
              fontSize={16}
              color={Color4.Yellow()}
              textAlign="middle-center"
              uiTransform={{
                width: '100%',
                height: '100%'
              }}
            />
          </UiEntity>

          {/* Unit Grid Container */}
          <UiEntity
            uiTransform={{
              width: '90%',
              height: '450px',
              margin: { top: '120px', left: '5%' },
              positionType: 'absolute'
            }}
          >
            {(() => {
              console.log('UNIT_DEFINITIONS:', Object.keys(UNIT_DEFINITIONS))
              console.log('UNIT_DEFINITIONS values:', Object.values(UNIT_DEFINITIONS))
              
              return Object.values(UNIT_DEFINITIONS).map((unitDef, index) => {
                const canPurchase = this.canPurchaseUnit(unitDef.type)
                const isSelected = this.selectedUnit === unitDef.type
                
                console.log(`Rendering unit ${unitDef.name} at index ${index}`)
                
                return (
                <UiEntity
                  key={unitDef.type}
                  uiTransform={{
                    width: '42%',
                    height: '200px',
                    positionType: 'absolute',
                    position: { 
                      top: `${Math.floor(index / 2) * 240}px`, 
                      left: index % 2 === 0 ? '8%' : '55%' 
                    }
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                      src: isSelected 
                        ? 'assets/images/unitPurchase/frames/unit_card_frame.png'
                        : 'assets/images/unitPurchase/frames/unit_card_background.png'
                    }
                  }}
                  onMouseDown={() => this.selectUnit(unitDef.type)}
                >
                  {/* Unit Icon */}
                  <UiEntity
                    uiTransform={{
                      width: '60px',
                      height: '60px',
                      positionType: 'absolute',
                      position: { left: '15px', top: '15px' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                        src: this.getUnitIconPath(unitDef.type)
                      }
                    }}
                  />
                  
                  {/* Unit Name */}
                  <Label
                    value={unitDef.name}
                    fontSize={18}
                    color={Color4.White()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '30px',
                      positionType: 'absolute',
                      position: { left: '85px', top: '25px' }
                    }}
                  />

                  {/* Unit Cost */}
                  <Label
                    value={`Cost: ${unitDef.cost} Coin`}
                    fontSize={14}
                    color={canPurchase ? Color4.create(0.2, 0.9, 0.2, 1.0) : Color4.create(0.9, 0.2, 0.2, 1.0)}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '25px',
                      positionType: 'absolute',
                      position: { left: '85px', top: '55px' }
                    }}
                  />

                  {/* Unit Description */}
                  <Label
                    value={unitDef.description}
                    fontSize={12}
                    color={Color4.White()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '85%',
                      height: '50px',
                      positionType: 'absolute',
                      position: { left: '15px', top: '90px' }
                    }}
                  />

                  {/* Purchase Button */}
                  <UiEntity
                    uiTransform={{
                      width: '90%',
                      height: '35px',
                      positionType: 'absolute',
                      position: { left: '5%', top: '155px' }
                    }}
                    uiBackground={{
                      color: canPurchase 
                        ? Color4.create(0.1, 0.7, 0.1, 1.0)  // Brighter green
                        : Color4.create(0.5, 0.5, 0.5, 1.0)  // Gray when disabled
                    }}
                    onMouseDown={() => {
                      if (canPurchase) {
                        // Play button click sound
                        const soundEntity = engine.addEntity()
                        AudioSource.create(soundEntity, {
                          audioClipUrl: 'assets/sounds/buttonclick.mp3',
                          loop: false,
                          playing: true
                        })
                        
                        // Remove sound entity after playing
                        utils.timers.setTimeout(() => {
                          engine.removeEntity(soundEntity)
                        }, 1000)
                        
                        this.purchaseUnit(unitDef.type)
                      }
                    }}
                  >
                    <Label
                      value={canPurchase ? "PURCHASE" : "INSUFFICIENT GOLD"}
                      fontSize={13}
                      color={Color4.White()}
                      textAlign="middle-center"
                      uiTransform={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </UiEntity>
                </UiEntity>
                )
              })
            })()}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
} 