import { UiCanvasInformation, engine, Transform } from '@dcl/sdk/ecs'
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
    modelPath: 'assets/models/Miner.glb'
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
    modelPath: 'assets/models/Farmer.glb'
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
        // Only deduct gold if we can actually place the unit
        player.inventory.incrementItem(ITEM_TYPES.COIN, -unitDef.cost)
        this.startFighterPlacement()
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

    // Clean up any existing placement system
    if (this.placementSystem) {
      engine.removeSystem(this.placementSystem)
      this.placementSystem = null
    }

    this.isPlacing = true
    this.placingUnitType = 'lumberjack'
    this.isVisible = false
    
    // Create placement system for lumberjack
    this.placementSystem = () => {
      if (this.isPlacing && this.placingUnitType === 'lumberjack' && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // Get player position
        const playerPos = Transform.get(engine.PlayerEntity).position
        
        // Check if there's an available tree nearby
        const nearestTree = findNearestAvailableTree(playerPos)
        
        if (!nearestTree) {
          console.log('No available tree found near player position:', playerPos)
          
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
            'Must be near an unoccupied tree to place lumberjack!',
            Color4.Red(),
            3000
          )
          this.hide()
          return
        }
        
        // Place lumberjack next to the player
        const angle = Math.random() * Math.PI * 2
        const distance = 2 + Math.random() * 2
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          playerPos.x + offsetX,
          playerPos.y - 0.5,
          playerPos.z + offsetZ
        )
        
        console.log('Placing lumberjack at:', placementPos, 'next to player at:', playerPos)
        this.placeLumberjack(placementPos, nearestTree)
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
        
        console.log('Placing fighter at:', placementPos, 'next to player at:', playerPos)
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
    
    // Show success message
    player.gameController.uiController.displayAnnouncement(
      'Fighter deployed!',
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