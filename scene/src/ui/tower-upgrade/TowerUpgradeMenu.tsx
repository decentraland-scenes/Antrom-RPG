import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { engine, AudioSource } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import Canvas from '../canvas/Canvas'

export type TowerUpgradeType = 'health' | 'placeholder1' | 'placeholder2' | 'placeholder3'

export interface TowerUpgradeDefinition {
  type: TowerUpgradeType
  name: string
  cost: number
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
    iconPath: 'assets/images/towerUpgradePurchace/42_wall_nobg.png',
    effect: '+10,000 HP'
  },
  placeholder1: {
    type: 'placeholder1',
    name: 'Upgrade 1',
    cost: 150,
    description: 'Coming soon...',
    iconPath: 'assets/images/tower-upgrade/placeholder1_icon.png',
    effect: 'Coming Soon'
  },
  placeholder2: {
    type: 'placeholder2',
    name: 'Upgrade 2',
    cost: 300,
    description: 'Coming soon...',
    iconPath: 'assets/images/tower-upgrade/placeholder2_icon.png',
    effect: 'Coming Soon'
  },
  placeholder3: {
    type: 'placeholder3',
    name: 'Upgrade 3',
    cost: 500,
    description: 'Coming soon...',
    iconPath: 'assets/images/tower-upgrade/placeholder3_icon.png',
    effect: 'Coming Soon'
  }
}

export class TowerUpgradeMenu {
  private isVisible: boolean = false
  private selectedUpgrade: TowerUpgradeType | null = null

  show(): void {
    console.log('TowerUpgradeMenu: Showing menu')
    this.isVisible = true
  }

  hide(): void {
    console.log('TowerUpgradeMenu: Hiding menu')
    this.isVisible = false
    this.selectedUpgrade = null
  }

  private selectUpgrade(upgradeType: TowerUpgradeType): void {
    console.log('TowerUpgradeMenu: Selected upgrade:', upgradeType)
    this.selectedUpgrade = upgradeType
  }

  private canPurchaseUpgrade(upgradeType: TowerUpgradeType): boolean {
    const player = Player.getInstanceOrNull()
    if (!player) return false

    const upgradeDef = TOWER_UPGRADE_DEFINITIONS[upgradeType]
    return player.inventory.getItemCount(ITEM_TYPES.TREE) >= upgradeDef.cost
  }

  private purchaseUpgrade(upgradeType: TowerUpgradeType): void {
    const player = Player.getInstanceOrNull()
    if (!player) return

    const upgradeDef = TOWER_UPGRADE_DEFINITIONS[upgradeType]

    if (player.inventory.getItemCount(ITEM_TYPES.TREE) >= upgradeDef.cost) {
      if (upgradeType === 'health') {
        // Apply health upgrade to gargoyle fountain
        const currentRealm = player.gameController.realmController.currentRealm
        if (currentRealm && currentRealm.getId() === 'antrom') {
          const gargoyleFountain = (currentRealm as any).gargoyleFountain
          if (gargoyleFountain && !gargoyleFountain.isDead) {
            // Deduct wood
            player.inventory.incrementItem(ITEM_TYPES.TREE, -upgradeDef.cost)
            
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
      } else {
        // Placeholder upgrades - show coming soon message
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
          `${upgradeDef.name} coming soon!`,
          Color4.Yellow(),
          3000
        )
      }
    } else {
      // Play insufficient funds sound
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
        'Insufficient wood for upgrade!',
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
                value: 'TOWER UPGRADES',
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
              value={`Wood: ${woodAmount}`}
              fontSize={16}
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
              height: '450px',
              margin: { top: '120px', left: '5%' },
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
                  onMouseDown={() => this.selectUpgrade(upgradeDef.type)}
                >
                  {/* Upgrade Icon */}
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
                        src: upgradeDef.iconPath
                      }
                    }}
                  />
                  
                  {/* Upgrade Name */}
                  <Label
                    value={upgradeDef.name}
                    fontSize={16}
                    color={Color4.White()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '20px',
                      positionType: 'absolute',
                      position: { left: '85px', top: '15px' }
                    }}
                  />
                  
                  {/* Upgrade Cost */}
                  <Label
                    value={`Cost: ${upgradeDef.cost} wood`}
                    fontSize={12}
                    color={Color4.Yellow()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '15px',
                      positionType: 'absolute',
                      position: { left: '85px', top: '40px' }
                    }}
                  />
                  
                  {/* Upgrade Effect */}
                  <Label
                    value={upgradeDef.effect}
                    fontSize={14}
                    color={Color4.Green()}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '70%',
                      height: '20px',
                      positionType: 'absolute',
                      position: { left: '85px', top: '60px' }
                    }}
                  />
                  
                  {/* Upgrade Description */}
                  <Label
                    value={upgradeDef.description}
                    fontSize={10}
                    color={Color4.create(0.8, 0.8, 0.8, 1)}
                    textAlign="middle-left"
                    uiTransform={{
                      width: '90%',
                      height: '40px',
                      positionType: 'absolute',
                      position: { left: '5%', top: '85px' }
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
                        
                        this.purchaseUpgrade(upgradeDef.type)
                      }
                    }}
                  >
                    <Label
                      value={canPurchase ? "UPGRADE" : "INSUFFICIENT WOOD"}
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
            })}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
} 