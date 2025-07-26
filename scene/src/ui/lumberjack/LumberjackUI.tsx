import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { engine, inputSystem, InputAction, PointerEventType, Transform } from '@dcl/sdk/ecs'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import Canvas from '../canvas/Canvas'

// Tree positions from antrom.ts - these are the actual tree positions in the game
const TREE_POSITIONS = [
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

function findNearestAvailableTree(playerPosition: Vector3): Vector3 | null {
  const player = Player.getInstanceOrNull()
  if (!player) return null
  
  let nearestTree: Vector3 | null = null
  let nearestDistance = Infinity
  let occupiedCount = 0
  
  for (const treePos of TREE_POSITIONS) {
    // Check if this tree is already occupied
    if (player.isTreeOccupied(treePos)) {
      occupiedCount++
      continue
    }
    
    const distance = Vector3.distance(playerPosition, treePos)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestTree = treePos
    }
  }
  
  console.log(`Found ${occupiedCount} occupied trees, ${TREE_POSITIONS.length - occupiedCount} available trees`)
  
  // Only return if within 8 units of an available tree
  return nearestDistance <= 8 ? nearestTree : null
}

export class LumberjackUI {
  public isVisible: boolean = false
  public isPlacing: boolean = false
  public placementPosition: Vector3 | null = null
  public buttonPosition: { x: number; y: number } = { x: 0, y: 0 }

  constructor() {
    // Initialize UI
  }

  show(): void {
    this.isVisible = true
  }

  showAtPosition(x: number, y: number): void {
    console.log('LumberjackUI.showAtPosition() called with x:', x, 'y:', y)
    this.buttonPosition = { x, y }
    this.isVisible = true
    console.log('LumberjackUI: isVisible set to true')
  }

  hide(): void {
    this.isVisible = false
    this.isPlacing = false
    this.placementPosition = null
  }

  startPlacement(): void {
    const player = Player.getInstanceOrNull()
    if (!player || !player.canPurchaseLumberjack()) return

    this.isPlacing = true
    this.isVisible = false
    
    // Add a temporary system to handle placement clicks
    engine.addSystem(() => {
      if (this.isPlacing && inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // Get player position
        const playerPos = Transform.get(engine.PlayerEntity).position
        
        // Check if there's an available tree nearby (for tracking purposes)
        const nearestTree = findNearestAvailableTree(playerPos)
        
        if (!nearestTree) {
          console.log('No available tree found near player position:', playerPos)
          // Show error message - no available trees nearby
          player.gameController.uiController.displayAnnouncement(
            'Must be near an unoccupied tree to place lumberjack!',
            Color4.Red(),
            3000
          )
          this.hide()
          return
        }
        
        // Place lumberjack next to the player
        const angle = Math.random() * Math.PI * 2 // Random angle around the player
        const distance = 2 + Math.random() * 2 // Distance between 2-4 units from player
        const offsetX = Math.cos(angle) * distance
        const offsetZ = Math.sin(angle) * distance
        const placementPos = Vector3.create(
          playerPos.x + offsetX,
          playerPos.y - .5, // Lower Y level to ground
          playerPos.z + offsetZ
        )
        console.log('Placing lumberjack at:', placementPos, 'next to player at:', playerPos)
        this.placeLumberjack(placementPos, nearestTree)
      }
    })
  }

  placeLumberjack(position: Vector3, treePosition: Vector3): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    if (player.purchaseLumberjack()) {
      player.addLumberjack(position, treePosition)
      this.hide()
    }
  }

  render(): ReactEcs.JSX.Element | null {
    console.log('LumberjackUI.render() called, isVisible:', this.isVisible)
    if (!this.isVisible) return null

    const player = Player.getInstanceOrNull()
    if (!player) {
      console.log('LumberjackUI: No player found')
      return null
    }

    const canPurchase = player.canPurchaseLumberjack()
    const goldAmount = player.inventory.getItemCount(ITEM_TYPES.COIN)
    
    console.log('LumberjackUI: Rendering menu, canPurchase:', canPurchase, 'goldAmount:', goldAmount)

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '300px',
            height: '200px',
            positionType: 'absolute',
            position: { left: `${this.buttonPosition.x}px`, top: `${this.buttonPosition.y}px` }
          }}
          uiBackground={{ color: Color4.create(0.8, 0.8, 0.8, 1.0) }}
        >
                  {/* Title */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '25px',
            margin: { top: '5px' }
          }}
          uiText={{
            value: 'Lumberjack',
            fontSize: 14,
            color: Color4.Yellow(),
            textAlign: 'middle-center'
          }}
        />

        {/* Info */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '40px',
            margin: { top: '30px' }
          }}
          uiText={{
            value: `Cost: ${player.lumberjackCost} Gold\nHarvest: ${player.lumberjackHarvestAmount} wood/3s\nGold: ${goldAmount}\nPlaces next to player!`,
            fontSize: 10,
            color: Color4.White(),
            textAlign: 'middle-center'
          }}
        />

        {/* Purchase Button */}
        <UiEntity
          uiTransform={{
            width: '80px',
            height: '25px',
            positionType: 'absolute',
            position: { left: '50%', bottom: '10px' },
            margin: { left: '-40px' }
          }}
          uiBackground={{ 
            color: canPurchase ? Color4.Green() : Color4.Red() 
          }}
          onMouseDown={() => {
            if (canPurchase) {
              this.startPlacement()
            }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
            uiText={{
              value: canPurchase ? 'Buy' : 'No Gold',
              fontSize: 12,
              color: Color4.White(),
              textAlign: 'middle-center'
            }}
          />
        </UiEntity>

          {/* Close Button */}
          <UiEntity
            uiTransform={{
              width: '20px',
              height: '20px',
              positionType: 'absolute',
              position: { right: '5px', top: '5px' }
            }}
            uiBackground={{ color: Color4.Red() }}
            onMouseDown={() => this.hide()}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%'
              }}
              uiText={{
                value: 'X',
                fontSize: 12,
                color: Color4.White(),
                textAlign: 'middle-center'
              }}
            />
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
} 