import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { engine, AudioSource } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import Canvas from '../canvas/Canvas'

export type TowerUpgradeType = 'health' | 'defense' | 'regeneration' | 'armor'

export interface TowerUpgradeDefinition {
  type: TowerUpgradeType
  name: string
  cost: number | { wood: number; rock: number }
  description: string
  iconPath: string
  effect: string
}

export const TOWER_UPGRADE_DEFINITIONS: Record<TowerUpgradeType, TowerUpgradeDefinition> = {
  health: {
    type: 'health',
    name: 'Tower Health',
    cost: 100,
    description: 'Increases tower health by 10,000',
    iconPath: 'assets/images/towerUpgradePurchace/tower_health.png',
    effect: '+10,000 HP'
  },
  defense: {
    type: 'defense',
    name: 'Tower Defense',
    cost: 200,
    description: 'Reinforces tower defenses, slowing enemy spawn cycles',
    iconPath: 'assets/images/towerUpgradePurchace/tower_defense.png',
    effect: '-30s Spawn Time'
  },
  regeneration: {
    type: 'regeneration',
    name: 'Tower Regeneration',
    cost: { wood: 150, rock: 100 },
    description: 'Adds healing crystals that slowly restore tower health',
    iconPath: 'assets/images/towerUpgradePurchace/tower_regen.png',
    effect: '+500 HP/30s'
  },
  armor: {
    type: 'armor',
    name: 'Tower Armor',
    cost: 300,
    description: 'Reinforces tower with stone armor, reducing incoming damage',
    iconPath: 'assets/images/towerUpgradePurchace/tower_armor.png',
    effect: '-25% Damage'
  }
}

export class TowerUpgradeMenu {
  private isVisible: boolean = false
  private selectedUpgrade: TowerUpgradeType | null = null
  private defenseUpgradeCount: number = 0 // Track how many defense upgrades purchased

  show(): void {
    console.log('TowerUpgradeMenu: Showing menu')
    this.isVisible = true
  }

  hide(): void {
    console.log('TowerUpgradeMenu: Hiding menu')
    this.isVisible = false
    this.selectedUpgrade = null
  }

  reset(): void {
    console.log('TowerUpgradeMenu: Resetting upgrade counts')
    this.defenseUpgradeCount = 0
  }

  private selectUpgrade(upgradeType: TowerUpgradeType): void {
    console.log('TowerUpgradeMenu: Selected upgrade:', upgradeType)
    this.selectedUpgrade = upgradeType
  }

  private getUpgradeCost(upgradeType: TowerUpgradeType): number | { wood: number; rock: number } {
    const upgradeDef = TOWER_UPGRADE_DEFINITIONS[upgradeType]
    
    if (upgradeType === 'defense') {
      // Increasing cost: base cost * (1 + 0.5 * upgrade count)
      const baseCost = 200
      const costMultiplier = 1 + (0.5 * this.defenseUpgradeCount)
      return Math.floor(baseCost * costMultiplier)
    }
    
    return upgradeDef.cost
  }

  private canPurchaseUpgrade(upgradeType: TowerUpgradeType): boolean {
    const player = Player.getInstanceOrNull()
    if (!player) return false

    // Check if one-time upgrades are already applied
    if (upgradeType === 'armor') {
      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const gargoyleFountain = (currentRealm as any).gargoyleFountain
        if (gargoyleFountain && gargoyleFountain.hasArmor) {
          return false // Already has armor
        }
      }
    }

    if (upgradeType === 'regeneration') {
      const currentRealm = player.gameController.realmController.currentRealm
      if (currentRealm && currentRealm.getId() === 'antrom') {
        const gargoyleFountain = (currentRealm as any).gargoyleFountain
        if (gargoyleFountain && gargoyleFountain.hasRegeneration) {
          return false // Already has regeneration
        }
      }
    }

    const cost = this.getUpgradeCost(upgradeType)
    
    if (typeof cost === 'number') {
      return player.inventory.getItemCount(ITEM_TYPES.TREE) >= cost
    } else {
      return player.inventory.getItemCount(ITEM_TYPES.TREE) >= cost.wood &&
             player.inventory.getItemCount(ITEM_TYPES.ROCK) >= cost.rock
    }
  }

  private purchaseUpgrade(upgradeType: TowerUpgradeType): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    const cost = this.getUpgradeCost(upgradeType)

    let canAfford = false
    if (typeof cost === 'number') {
      canAfford = player.inventory.getItemCount(ITEM_TYPES.TREE) >= cost
    } else {
      canAfford = player.inventory.getItemCount(ITEM_TYPES.TREE) >= cost.wood &&
                  player.inventory.getItemCount(ITEM_TYPES.ROCK) >= cost.rock
    }
    
    if (canAfford) {
      if (upgradeType === 'health') {
        // Apply health upgrade to gargoyle fountain
        const currentRealm = player.gameController.realmController.currentRealm
        if (currentRealm && currentRealm.getId() === 'antrom') {
          const gargoyleFountain = (currentRealm as any).gargoyleFountain
          if (gargoyleFountain && !gargoyleFountain.isDead) {
            // Deduct resources
            if (typeof cost === 'number') {
              player.inventory.incrementItem(ITEM_TYPES.TREE, -cost)
            } else {
              player.inventory.incrementItem(ITEM_TYPES.TREE, -cost.wood)
              player.inventory.incrementItem(ITEM_TYPES.ROCK, -cost.rock)
            }
            
            // Apply health upgrade
            gargoyleFountain.maxHealth += 10000
            gargoyleFountain.health += 10000
            
            // Play success sound
            const soundEntity = engine.addEntity()
            AudioSource.create(soundEntity, {
              audioClipUrl: 'assets/sounds/buttonclick.mp3',
              loop: false,
              playing: true,
              volume: 0.8
            })
            
            // Remove sound entity after playing
            utils.timers.setTimeout(() => {
              engine.removeEntity(soundEntity)
            }, 1000)
            
            // Show success message
            player.gameController.uiController.displayAnnouncement(
              'Tower health upgraded! +10,000 HP',
              Color4.Green(),
              3000
            )
            
            console.log('Tower health upgraded. New health:', gargoyleFountain.health, '/', gargoyleFountain.maxHealth)
          } else {
            player.gameController.uiController.displayAnnouncement(
              'Tower not available for upgrade!',
              Color4.Red(),
              3000
            )
          }
        }
      } else if (upgradeType === 'defense') {
        // Apply defense upgrade to gargoyle fountain
        const currentRealm = player.gameController.realmController.currentRealm
        if (currentRealm && currentRealm.getId() === 'antrom') {
          const gargoyleFountain = (currentRealm as any).gargoyleFountain
          if (gargoyleFountain && !gargoyleFountain.isDead) {
            // Deduct resources
            if (typeof cost === 'number') {
              player.inventory.incrementItem(ITEM_TYPES.TREE, -cost)
            } else {
              player.inventory.incrementItem(ITEM_TYPES.TREE, -cost.wood)
              player.inventory.incrementItem(ITEM_TYPES.ROCK, -cost.rock)
            }
            
            // Apply defense upgrade with diminishing returns
            this.defenseUpgradeCount++
            const baseTimeIncrease = 30000 // 30 seconds base
            const diminishingFactor = Math.max(0.5, 1 - (this.defenseUpgradeCount * 0.1)) // Diminishing returns: 10% less each time
            const actualTimeIncrease = Math.floor(baseTimeIncrease * diminishingFactor)
            const oldInterval = gargoyleFountain.spawnCycleInterval
            gargoyleFountain.spawnCycleInterval += actualTimeIncrease
            console.log(`Tower Defense: Old interval: ${oldInterval/1000}s, Added: ${actualTimeIncrease/1000}s, New interval: ${gargoyleFountain.spawnCycleInterval/1000}s`)
            
            // Play success sound
            const soundEntity = engine.addEntity()
            AudioSource.create(soundEntity, {
              audioClipUrl: 'assets/sounds/buttonclick.mp3',
              loop: false,
              playing: true,
              volume: 0.8
            })
            
            // Remove sound entity after playing
            utils.timers.setTimeout(() => {
              engine.removeEntity(soundEntity)
            }, 1000)
            
            // Show success message
            player.gameController.uiController.displayAnnouncement(
              `Tower defense upgraded! Spawn rate slowed by ${Math.floor(actualTimeIncrease / 1000)} seconds (${this.defenseUpgradeCount} upgrades)`,
              Color4.Green(),
              3000
            )
            
            console.log(`Tower defense upgraded. New spawn interval: ${gargoyleFountain.spawnCycleInterval}, upgrade count: ${this.defenseUpgradeCount}`)
          } else {
            player.gameController.uiController.displayAnnouncement(
              'Tower not available for upgrade!',
              Color4.Red(),
              3000
            )
          }
        }
      } else if (upgradeType === 'regeneration') {
        // Apply regeneration upgrade to gargoyle fountain
        const currentRealm = player.gameController.realmController.currentRealm
        if (currentRealm && currentRealm.getId() === 'antrom') {
          const gargoyleFountain = (currentRealm as any).gargoyleFountain
          if (gargoyleFountain && !gargoyleFountain.isDead) {
            // Apply regeneration upgrade - add regeneration system
            if (!gargoyleFountain.hasRegeneration) {
              // Deduct resources only if regeneration is being applied
              if (typeof cost === 'number') {
                player.inventory.incrementItem(ITEM_TYPES.TREE, -cost)
              } else {
                player.inventory.incrementItem(ITEM_TYPES.TREE, -cost.wood)
                player.inventory.incrementItem(ITEM_TYPES.ROCK, -cost.rock)
              }
              
              gargoyleFountain.hasRegeneration = true
              gargoyleFountain.regenerationAmount = 500
              gargoyleFountain.regenerationInterval = 30000 // 30 seconds
              gargoyleFountain.lastRegenerationTime = Date.now()
              
              // Add regeneration system to the fountain
              engine.addSystem(() => {
                if (gargoyleFountain.hasRegeneration && !gargoyleFountain.isDead) {
                  const currentTime = Date.now()
                  if (currentTime - gargoyleFountain.lastRegenerationTime >= gargoyleFountain.regenerationInterval) {
                    if (gargoyleFountain.health < gargoyleFountain.maxHealth) {
                      gargoyleFountain.health = Math.min(gargoyleFountain.maxHealth, gargoyleFountain.health + gargoyleFountain.regenerationAmount)
                      gargoyleFountain.lastRegenerationTime = currentTime
                      console.log('Tower regenerated health:', gargoyleFountain.health, '/', gargoyleFountain.maxHealth)
                    }
                  }
                }
              })
              
              // Play success sound
              const soundEntity = engine.addEntity()
              AudioSource.create(soundEntity, {
                audioClipUrl: 'assets/sounds/buttonclick.mp3',
                loop: false,
                playing: true,
                volume: 0.8
              })
              
              // Remove sound entity after playing
              utils.timers.setTimeout(() => {
                engine.removeEntity(soundEntity)
              }, 1000)
              
              // Show success message
              player.gameController.uiController.displayAnnouncement(
                'Tower regeneration activated! +500 HP every 30 seconds',
                Color4.Green(),
                3000
              )
              
              console.log('Tower regeneration upgraded')
            } else {
              // Regeneration already applied - show message and don't deduct resources
              player.gameController.uiController.displayAnnouncement(
                'Tower regeneration already active!',
                Color4.Yellow(),
                3000
              )
              return
            }
          } else {
            player.gameController.uiController.displayAnnouncement(
              'Tower not available for upgrade!',
              Color4.Red(),
              3000
            )
          }
        }
      } else if (upgradeType === 'armor') {
        // Apply armor upgrade to gargoyle fountain
        const currentRealm = player.gameController.realmController.currentRealm
        if (currentRealm && currentRealm.getId() === 'antrom') {
          const gargoyleFountain = (currentRealm as any).gargoyleFountain
          if (gargoyleFountain && !gargoyleFountain.isDead) {
            // Apply armor upgrade - add damage reduction
            if (!gargoyleFountain.hasArmor) {
              // Deduct resources only if armor is being applied
              if (typeof cost === 'number') {
                player.inventory.incrementItem(ITEM_TYPES.TREE, -cost)
              } else {
                player.inventory.incrementItem(ITEM_TYPES.TREE, -cost.wood)
                player.inventory.incrementItem(ITEM_TYPES.ROCK, -cost.rock)
              }
              
              gargoyleFountain.hasArmor = true
              gargoyleFountain.damageReduction = 0.25 // 25% damage reduction
              
              // Override the reduceHealth method to apply damage reduction
              const originalReduceHealth = gargoyleFountain.reduceHealth
              gargoyleFountain.reduceHealth = function(attack: number) {
                const reducedDamage = Math.floor(attack * (1 - this.damageReduction))
                console.log(`Armor reduced damage from ${attack} to ${reducedDamage}`)
                originalReduceHealth.call(this, reducedDamage)
              }
              
              // Play success sound
              const soundEntity = engine.addEntity()
              AudioSource.create(soundEntity, {
                audioClipUrl: 'assets/sounds/buttonclick.mp3',
                loop: false,
                playing: true,
                volume: 0.8
              })
              
              // Remove sound entity after playing
              utils.timers.setTimeout(() => {
                engine.removeEntity(soundEntity)
              }, 1000)
              
              // Show success message
              player.gameController.uiController.displayAnnouncement(
                'Tower armor upgraded! 25% damage reduction active',
                Color4.Green(),
                3000
              )
              
              console.log('Tower armor upgraded')
            } else {
              // Armor already applied - show message and don't deduct resources
              player.gameController.uiController.displayAnnouncement(
                'Tower armor already active!',
                Color4.Yellow(),
                3000
              )
              return
            }
          } else {
            player.gameController.uiController.displayAnnouncement(
              'Tower not available for upgrade!',
              Color4.Red(),
              3000
            )
          }
        }
      }
    } else {
      // Play insufficient funds sound
      const soundEntity = engine.addEntity()
      AudioSource.create(soundEntity, {
        audioClipUrl: 'assets/sounds/noResources.mp3',
        loop: false,
        playing: true,
        volume: 0.8
      })
      
      // Remove sound entity after playing
      utils.timers.setTimeout(() => {
        engine.removeEntity(soundEntity)
      }, 1000)
      
      player.gameController.uiController.displayAnnouncement(
        'Insufficient resources for upgrade!',
        Color4.Red(),
        3000
      )
    }
  }

  render(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null

    const player = Player.getInstanceOrNull()
    if (!player) return null

    const woodAmount = player.inventory.getItemCount(ITEM_TYPES.TREE)
    const rockAmount = player.inventory.getItemCount(ITEM_TYPES.ROCK)

    return (
      <Canvas>
        {/* Main Menu Container - positioned to the left of Tower button */}
        <UiEntity
          uiTransform={{
            width: '400px',
            height: '500px',
            positionType: 'absolute',
            position: { right: '120px', top: '70%' },
            margin: { top: '-250px' }
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
              height: '40px',
              margin: { top: '60px' },
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
                value: 'TOWER UPGRADES',
                fontSize: 20,
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
                position: { right: '30px', top: '-25px' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/x.png' }
              }}
              onMouseDown={() => {
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
                
                this.hide()
              }}
            />
          </UiEntity>

          {/* Resource Display */}
          <UiEntity
            uiTransform={{
              width: '180px',
              height: '35px',
              positionType: 'absolute',
              position: { left: '30px', top: '30px' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/unitPurchase/frames/Background_Square_skill.png'
              }
            }}
          >
            <Label
              value={`Wood: ${woodAmount} | Rock: ${rockAmount}`}
              fontSize={12}
              color={Color4.Yellow()}
              textAlign="middle-center"
              uiTransform={{
                width: '100%',
                height: '100%'
              }}
            />
          </UiEntity>

          {/* Upgrade Grid Container */}
          <UiEntity
            uiTransform={{
              width: '90%',
              height: '350px',
              margin: { top: '100px', left: '5%' },
              positionType: 'absolute'
            }}
          >
            {Object.values(TOWER_UPGRADE_DEFINITIONS).map((upgradeDef, index) => {
              const canPurchase = this.canPurchaseUpgrade(upgradeDef.type)
              const isSelected = this.selectedUpgrade === upgradeDef.type
              
              return (
                <UiEntity
                  key={upgradeDef.type}
                  uiTransform={{
                    width: '45%',
                    height: '160px',
                    positionType: 'absolute',
                    position: { 
                      top: `${Math.floor(index / 2) * 180}px`, 
                      left: index % 2 === 0 ? '5%' : '52%' 
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
                  onMouseDown={() => this.selectUpgrade(upgradeDef.type)}
                >
                  {/* Upgrade Icon */}
                  <UiEntity
                    uiTransform={{
                      width: '50px',
                      height: '50px',
                      positionType: 'absolute',
                      position: { left: '10px', top: '10px' }
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                        src: upgradeDef.iconPath
                      }
                    }}
                  />
                  
                  {/* Upgrade Name */}
                  <Label
                    value={upgradeDef.name}
                    fontSize={14}
                    color={Color4.White()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '18px',
                      positionType: 'absolute',
                      position: { left: '70px', top: '12px' }
                    }}
                  />
                  
                  {/* Upgrade Cost */}
                  <Label
                    value={
                      (() => {
                        const cost = this.getUpgradeCost(upgradeDef.type)
                        if (typeof cost === 'number') {
                          return `Cost: ${cost} wood`
                        } else {
                          return `Cost: ${cost.wood} wood, ${cost.rock} rock`
                        }
                      })()
                    }
                    fontSize={11}
                    color={Color4.Yellow()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '15px',
                      positionType: 'absolute',
                      position: { left: '70px', top: '32px' }
                    }}
                  />
                  
                  {/* Upgrade Effect */}
                  <Label
                    value={upgradeDef.effect}
                    fontSize={12}
                    color={Color4.Green()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '18px',
                      positionType: 'absolute',
                      position: { left: '70px', top: '50px' }
                    }}
                  />
                  
                  {/* Upgrade Description */}
                  <Label
                    value={upgradeDef.description}
                    fontSize={9}
                    color={Color4.create(0.8, 0.8, 0.8, 1)}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '90%',
                      height: '35px',
                      positionType: 'absolute',
                      position: { left: '5%', top: '70px' }
                    }}
                  />
                  
                  {/* Purchase Button */}
                  <UiEntity
                    uiTransform={{
                      width: '90%',
                      height: '30px',
                      positionType: 'absolute',
                      position: { left: '5%', top: '125px' }
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
                        }, 3000) // Increased to 3 seconds to allow full sound to play
                        
                        this.purchaseUpgrade(upgradeDef.type)
                      } else {
                        // Play insufficient resources sound when button is clicked but can't afford
                        const soundEntity = engine.addEntity()
                        AudioSource.create(soundEntity, {
                          audioClipUrl: 'assets/sounds/noResources.mp3',
                          loop: false,
                          playing: true,
                          volume: 0.8
                        })
                        
                        // Remove sound entity after playing
                        utils.timers.setTimeout(() => {
                          engine.removeEntity(soundEntity)
                        }, 3000) // Increased to 3 seconds to allow full sound to play
                        
                        const player = Player.getInstanceOrNull()
                        if (player) {
                          player.gameController.uiController.displayAnnouncement(
                            'Insufficient resources for upgrade!',
                            Color4.Red(),
                            3000
                          )
                        }
                      }
                    }}
                  >
                    <Label
                      value={canPurchase ? "UPGRADE" : "INSUFFICIENT RESOURCES"}
                      fontSize={12}
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
            })}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
} 