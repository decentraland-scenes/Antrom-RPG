import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import Canvas from '../canvas/Canvas'
import { Player } from '../../player/player'
import { Fighter } from '../../units/Fighter'
import { Lumberjack } from '../../units/Lumberjack'
import { Miner } from '../../units/Miner'
import { Farmer } from '../../units/Farmer'

interface DeployedUnitsDisplayProps {
  isVisible: boolean
}

interface UnitDisplayData {
  type: 'fighter' | 'lumberjack' | 'miner' | 'farmer'
  health: number
  maxHealth: number
  isDead: boolean
  iconPath: string
  name: string
}

export function DeployedUnitsDisplay({ isVisible }: DeployedUnitsDisplayProps): ReactEcs.JSX.Element | null {
  console.log('DeployedUnitsDisplay: isVisible =', isVisible)
  
  if (!isVisible) return null

  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (!canvasInfo) {
    console.log('DeployedUnitsDisplay: No canvas info')
    return null
  }

  const player = Player.getInstanceOrNull()
  if (!player) {
    console.log('DeployedUnitsDisplay: No player found')
    return null
  }

  // Collect all deployed units
  const deployedUnits: UnitDisplayData[] = []

  // Add fighters
  console.log('DeployedUnitsDisplay: Found', player.fighters.length, 'fighters')
  player.fighters.forEach((fighter: Fighter) => {
    console.log('DeployedUnitsDisplay: Fighter health:', fighter.health, '/', fighter.maxHealth, 'isDead:', fighter.isDead)
    deployedUnits.push({
      type: 'fighter',
      health: fighter.health,
      maxHealth: fighter.maxHealth,
      isDead: fighter.isDead,
      iconPath: 'assets/images/unitPurchase/icons/fighter_icon.png',
      name: 'Fighter'
    })
  })

  // Add lumberjacks (no health system - always alive)
  player.lumberjacks.forEach((lumberjack: Lumberjack) => {
    deployedUnits.push({
      type: 'lumberjack',
      health: 100,
      maxHealth: 100,
      isDead: false,
      iconPath: 'assets/images/unitPurchase/icons/lumberjack_icon.png',
      name: 'Lumberjack'
    })
  })

  // Add miners (no health system - always alive)
  player.miners.forEach((miner: Miner) => {
    deployedUnits.push({
      type: 'miner',
      health: 100,
      maxHealth: 100,
      isDead: false,
      iconPath: 'assets/images/unitPurchase/icons/miner_icon.png',
      name: 'Miner'
    })
  })

  // Add farmers (no health system - always alive)
  player.farmers.forEach((farmer: Farmer) => {
    deployedUnits.push({
      type: 'farmer',
      health: 100,
      maxHealth: 100,
      isDead: false,
      iconPath: 'assets/images/unitPurchase/icons/farmer_icon.png',
      name: 'Farmer'
    })
  })

  console.log('DeployedUnitsDisplay: Total deployed units:', deployedUnits.length)
  
  // Always show the panel for testing, even if no units
  const hasUnits = deployedUnits.length > 0

  const unitSize = 60
  const healthBarHeight = 8
  const spacing = 10
  const panelWidth = 200
  const panelHeight = hasUnits ? deployedUnits.length * (unitSize + spacing) + 20 : 100
  
  console.log('DeployedUnitsDisplay: Rendering panel with', deployedUnits.length, 'units')

  return (
    <Canvas>
      <UiEntity
        uiTransform={{
          width: panelWidth,
          height: panelHeight,
          positionType: 'absolute',
          position: { left: '1%', top: '25%' }
        }}
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.8) // Dark background
        }}
      >
        {/* Title */}
        <Label
          value={hasUnits ? `Deployed Units (${deployedUnits.length})` : 'No Units Deployed'}
          fontSize={16}
          color={Color4.White()}
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: 30,
            margin: { top: 10 }
          }}
        />

        {/* Units List */}
        {hasUnits && deployedUnits.map((unit, index) => (
          <UiEntity
            key={`${unit.type}-${index}`}
            uiTransform={{
              width: '90%',
              height: unitSize,
              positionType: 'absolute',
              position: { 
                left: '5%', 
                top: 40 + index * (unitSize + spacing) 
              }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/unitPurchase/frames/unit_card_background.png' }
            }}
          >
            {/* Unit Icon */}
            <UiEntity
              uiTransform={{
                width: 40,
                height: 40,
                positionType: 'absolute',
                position: { left: 10, top: 10 }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: unit.iconPath }
              }}
            />

            {/* Unit Name */}
            <Label
              value={unit.name}
              fontSize={14}
              color={unit.isDead ? Color4.Red() : Color4.White()}
              textAlign="middle-left"
              uiTransform={{
                width: '60%',
                height: 20,
                positionType: 'absolute',
                position: { left: 60, top: 5 }
              }}
            />

            {/* Health Bar Background */}
            <UiEntity
              uiTransform={{
                width: '60%',
                height: healthBarHeight,
                positionType: 'absolute',
                position: { left: 60, top: 30 }
              }}
              uiBackground={{ color: Color4.create(0.2, 0.2, 0.2, 1.0) }}
            />

            {/* Health Bar Fill */}
            <UiEntity
              uiTransform={{
                width: `${(unit.health / unit.maxHealth) * 60}%`,
                height: healthBarHeight,
                positionType: 'absolute',
                position: { left: 60, top: 30 }
              }}
              uiBackground={{ 
                color: unit.isDead 
                  ? Color4.Red() 
                  : unit.health / unit.maxHealth > 0.5 
                    ? Color4.Green() 
                    : unit.health / unit.maxHealth > 0.25 
                      ? Color4.Yellow() 
                      : Color4.Red() 
              }}
            />

            {/* Health Text */}
            <Label
              value={`${Math.max(0, unit.health)}/${unit.maxHealth}`}
              fontSize={12}
              color={unit.isDead ? Color4.Red() : Color4.White()}
              textAlign="middle-left"
              uiTransform={{
                width: '60%',
                height: 15,
                positionType: 'absolute',
                position: { left: 60, top: 45 }
              }}
            />

            {/* Status Indicator */}
            <Label
              value={unit.isDead ? 'DEAD' : 'ALIVE'}
              fontSize={10}
              color={unit.isDead ? Color4.Red() : Color4.Green()}
              textAlign="middle-right"
              uiTransform={{
                width: '25%',
                height: 15,
                positionType: 'absolute',
                position: { left: '70%', top: 45 }
              }}
            />
          </UiEntity>
        ))}
      </UiEntity>
    </Canvas>
  )
} 