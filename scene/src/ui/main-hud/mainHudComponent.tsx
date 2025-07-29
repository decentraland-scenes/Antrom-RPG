import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import Canvas from '../canvas/Canvas'
import {
  DISCORD_URL,
  TWITTER_URL,
  mainHudSprites,
  type lastRollType,
  type playersProfessionsType
} from './mainHudData'
import {
  ALLIANCES,
  CLASSES_STATS,
  RACES,
  type CharacterAlliances,
  type CharacterClasses,
  type CharacterRaces
} from '../creation-player/creationPlayerData'
import { Player } from '../../player/player'
import { ITEM_TYPES } from '../../inventory/playerInventoryMap'
import { LEVEL_TYPES } from '../../player/LevelManager'
import { DeployedUnitsDisplay } from '../deployed-units/DeployedUnitsDisplay'
import CountdownTimer from '../timer/countdownTimer'
import { CountdownTimerManager } from '../timer/countdownTimerManager'
import { PlayButton } from '../play-button/PlayButton'
import { PlayButtonManager } from '../play-button/PlayButtonManager'

// Number formatting function to abbreviate large numbers
function formatNumber(num: number): string {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1) + 'T'
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  } else {
    return num.toString()
  }
}

type MainHudProps = {
  isPlayerRollOpen: boolean
  isInfoOpen: boolean
  playerRollOnClick: (arg: boolean) => void
  showInfo: (arg: boolean) => void
  showInventory: () => void
  showLumberjack: () => void
  showTowerUpgrade: () => void
  openLink: (arg: string) => void
  characterRace: CharacterRaces
  characterClass: CharacterClasses
  characterAlliance: CharacterAlliances
  lastRoll: lastRollType
  playerProfessions: playersProfessionsType
}

// Resource Counter Component
function ResourceCounter(): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) {
    console.log('ResourceCounter: No canvas info')
    return <UiEntity />
  }

  const player = Player.getInstanceOrNull()
  if (!player) {
    console.log('ResourceCounter: No player found')
    return <UiEntity />
  }

  console.log('ResourceCounter: Rendering with wood count:', player.inventory.getItemCount(ITEM_TYPES.TREE))

  const woodCount = player.inventory.getItemCount(ITEM_TYPES.TREE)
  const rockCount = player.inventory.getItemCount(ITEM_TYPES.ROCK)
  // const chickenCount = player.inventory.getItemCount(ITEM_TYPES.CHICKEN) // Commented out
  const coinCount = player.inventory.getItemCount(ITEM_TYPES.COIN)

  const iconSize = canvasInfo.height * 0.04
  const fontSize = canvasInfo.height * 0.025

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: canvasInfo.height * 0.02, left: canvasInfo.width * 0.35 },
        width: 'auto',
        height: iconSize,
        flexDirection: 'row',
        alignItems: 'center'
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.5) }}
    >
      {/* Lumberjack Counter */}
      <UiEntity
        uiTransform={{
          width: iconSize,
          height: iconSize,
          margin: { right: iconSize * 0.3 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/unitPurchase/icons/lumberjack_icon.png' }
        }}
      />
      <Label
        value={formatNumber(woodCount)}
        fontSize={fontSize}
        color={Color4.White()}
        uiTransform={{
          margin: { right: iconSize * 0.8 }
        }}
      />

      {/* Miner Counter */}
      <UiEntity
        uiTransform={{
          width: iconSize,
          height: iconSize,
          margin: { right: iconSize * 0.3 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/unitPurchase/icons/miner_icon.png' }
        }}
      />
      <Label
        value={formatNumber(rockCount)}
        fontSize={fontSize}
        color={Color4.White()}
        uiTransform={{
          margin: { right: iconSize * 0.8 }
        }}
      />

      {/* Farmer Counter - Commented out
      <UiEntity
        uiTransform={{
          width: iconSize,
          height: iconSize,
          margin: { right: iconSize * 0.3 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/unitPurchase/icons/farmer_icon.png' }
        }}
      />
      <Label
        value={formatNumber(chickenCount)}
        fontSize={fontSize}
        color={Color4.White()}
        uiTransform={{
          margin: { right: iconSize * 0.8 }
        }}
      />
      */}

      {/* Coin Counter */}
      <UiEntity
        uiTransform={{
          width: iconSize,
          height: iconSize,
          margin: { right: iconSize * 0.3 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/daily_duties/coin.png' }
        }}
      />
      <Label
        value={formatNumber(coinCount)}
        fontSize={fontSize}
        color={Color4.White()}
        uiTransform={{
          margin: { right: iconSize * 0.8 }
        }}
      />
    </UiEntity>
  )
}

// Game Over Component
function GameOverScreen(): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) {
    return <UiEntity />
  }

  const player = Player.getInstanceOrNull()
  if (!player) {
    return <UiEntity />
  }

  // Check if game is over
  const isGameOver = (player.gameController as any).isGameOver
  if (!isGameOver) {
    return <UiEntity />
  }

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        width: canvasInfo.width,
        height: canvasInfo.height
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.9) }}
    >
      {/* Game Over Title */}
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: canvasInfo.height * 0.3, left: 0 },
          width: canvasInfo.width,
          height: 100
        }}
      >
        <Label
          value="GAME OVER"
          fontSize={72}
          color={Color4.Red()}
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        />
      </UiEntity>

      {/* Game Over Message */}
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: canvasInfo.height * 0.45, left: 0 },
          width: canvasInfo.width,
          height: 60
        }}
      >
        <Label
          value="The Gargoyle Fountain has been destroyed!"
          fontSize={24}
          color={Color4.White()}
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        />
      </UiEntity>

      {/* Restart Message */}
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: canvasInfo.height * 0.6, left: 0 },
          width: canvasInfo.width,
          height: 40
        }}
      >
        <Label
          value="Refresh the page to restart the game"
          fontSize={18}
          color={Color4.Yellow()}
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

// Gargoyle Fountain Health Display Component
function GargoyleFountainHealth(): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) {
    console.log('GargoyleFountainHealth: No canvas info')
    return <UiEntity />
  }

  const player = Player.getInstanceOrNull()
  if (!player) {
    console.log('GargoyleFountainHealth: No player found')
    return <UiEntity />
  }

  // Get gargoyle fountain from current realm
  const currentRealm = player.gameController.realmController.currentRealm
  if (!currentRealm || currentRealm.getId() !== 'antrom') {
    return <UiEntity />
  }

  const gargoyleFountain = (currentRealm as any).gargoyleFountain
  if (!gargoyleFountain || gargoyleFountain.isDead) {
    return <UiEntity />
  }

    const healthPercent = (gargoyleFountain.health / gargoyleFountain.maxHealth) * 100
  const iconSize = canvasInfo.height * 0.04
  const fontSize = canvasInfo.height * 0.025
  const barWidth = 300
  const barHeight = 80
  const healthBarHeight = 12

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: canvasInfo.height * 0.08, left: canvasInfo.width * 0.45 },
        width: barWidth,
        height: barHeight,
        flexDirection: 'row',
        alignItems: 'center'
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
    >
      {/* Gargoyle Icon */}
      <UiEntity
        uiTransform={{
          width: iconSize,
          height: iconSize,
          margin: { right: 20 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/Inventory_ui_icon.png' }
        }}
      />
      
      {/* Health Bar Container */}
      <UiEntity
        uiTransform={{
          width: '70%',
          height: barHeight,
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* Health Text */}
        <Label
          value={`Gargoyle Fountain`}
          fontSize={14}
          color={Color4.White()}
          textAlign="middle-left"
          uiTransform={{
            width: '100%',
            height: 20,
            positionType: 'absolute',
            position: { left: 0, top: 5 }
          }}
        />
        
        {/* Health Bar Background */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: healthBarHeight,
            positionType: 'absolute',
            position: { left: 0, top: 30 }
          }}
          uiBackground={{ color: Color4.create(0.2, 0.2, 0.2, 1) }}
        />
        
        {/* Health Bar Fill */}
        <UiEntity
          uiTransform={{
            width: `${(gargoyleFountain.health / gargoyleFountain.maxHealth) * 100}%`,
            height: healthBarHeight,
            positionType: 'absolute',
            position: { left: 0, top: 30 }
          }}
          uiBackground={{
            color: healthPercent > 50 
              ? Color4.Green() 
              : healthPercent > 25 
                ? Color4.Yellow() 
                : Color4.Red()
          }}
        />
        
        {/* Health Text */}
        <Label
          value={`${formatNumber(Math.max(0, gargoyleFountain.health))}/${formatNumber(gargoyleFountain.maxHealth)}`}
          fontSize={12}
          color={Color4.White()}
          textAlign="middle-left"
          uiTransform={{
            width: '100%',
            height: 15,
            positionType: 'absolute',
            position: { left: 0, top: 45 }
          }}
        />
      </UiEntity>
      
      {/* Status */}
      <Label
        value={gargoyleFountain.isDead ? 'DESTROYED' : 'ALIVE'}
        fontSize={10}
        color={gargoyleFountain.isDead ? Color4.Red() : Color4.Green()}
        textAlign="middle-right"
        uiTransform={{
          width: '25%',
          height: 15,
          positionType: 'absolute',
          position: { left: '70%', top: 45 }
        }}
      />
    </UiEntity>
  )
}

function MainHud({
  isPlayerRollOpen,
  isInfoOpen,
  playerRollOnClick,
  showInfo,
  showInventory,
  showLumberjack,
  showTowerUpgrade,
  openLink,
  characterAlliance,
  characterRace,
  characterClass,
  lastRoll,
  playerProfessions
}: MainHudProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const hudHeight: number = canvasInfo.height * 0.06
  let menuIconSprite: Sprite
  if (isPlayerRollOpen) {
    menuIconSprite = mainHudSprites.quickMenuIconOpen
  } else {
    menuIconSprite = mainHudSprites.quickMenuIconClose
  }

  return (
    <Canvas>
      {/* Resource Counter */}
      <ResourceCounter />
      
      {/* Gargoyle Fountain Health */}
      <GargoyleFountainHealth />
      
      {/* Countdown Timer - only show when game has started */}
      <CountdownTimer 
        minutes={CountdownTimerManager.getInstance().getCurrentTime().minutes}
        seconds={CountdownTimerManager.getInstance().getCurrentTime().seconds}
        isVisible={CountdownTimerManager.getInstance().getCurrentTime().isVisible && PlayButtonManager.getInstance().getIsGameStarted()}
        shouldFlash={CountdownTimerManager.getInstance().getCurrentTime().shouldFlash}
      />

      <UiEntity
        uiTransform={{
          width: 'auto',
          height: hudHeight,

          position: { right: hudHeight * 2, top: hudHeight * 0.25 },
          positionType: 'absolute',
          justifyContent: 'flex-end'
        }}
      >
        {/* Change Avatar icon hidden */}
        {/* Inventory and Info buttons moved to under unit purchase button */}
        {/* Quick Menu icon hidden */}
        {isPlayerRollOpen && (
          <UiEntity
            uiTransform={{
              width: canvasInfo.height * 0.25,
              height: canvasInfo.height,
              positionType: 'absolute',
              position: { top: hudHeight * 1.5 },
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: hudHeight * 1.3,
                justifyContent: 'space-around'
              }}
            >
              <UiEntity
                uiTransform={{
                  width: '30%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(ALLIANCES[characterAlliance].selectedSprite),
                  texture: {
                    src: ALLIANCES[characterAlliance].selectedSprite.atlasSrc
                  }
                }}
              />
              <UiEntity
                uiTransform={{
                  width: '30%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(RACES[characterRace].selectedSprite),
                  texture: {
                    src: RACES[characterRace].selectedSprite.atlasSrc
                  }
                }}
              />
              <UiEntity
                uiTransform={{
                  width: '30%',
                  height: '100%'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(CLASSES_STATS[characterClass].selectedSprite),
                  texture: {
                    src: CLASSES_STATS[characterClass].selectedSprite.atlasSrc
                  }
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-end',
                width: canvasInfo.height * 0.5 * 0.43,
                height: canvasInfo.height * 0.5
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(mainHudSprites.playerRoll),
                texture: {
                  src: mainHudSprites.playerRoll.atlasSrc
                }
              }}
            >
              <UiEntity
                uiTransform={{
                  width: '100%',
                  margin: { top: hudHeight * 0.7 }
                }}
                uiText={{
                  value: `+${lastRoll.gainedExperience.toString()} XP`,
                  fontSize: hudHeight * 0.4
                }}
              />
              <UiEntity
                uiTransform={{
                  width: '33%',
                  height: '32%',
                  margin: { top: hudHeight * 0.25, right: hudHeight * 0.2 },
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value: lastRoll.playerRoll.toString(),
                    fontSize: hudHeight * 0.3
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value: lastRoll.enemyRoll.toString(),
                    fontSize: hudHeight * 0.3
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value: lastRoll.playerAttack.toString(),
                    fontSize: hudHeight * 0.3
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value: lastRoll.EnemyAttack.toString(),
                    fontSize: hudHeight * 0.3
                  }}
                />
              </UiEntity>
              <UiEntity
                uiTransform={{
                  width: '33%',
                  height: '31%',
                  margin: { top: hudHeight * 1.05, right: hudHeight * 2.2 },
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value:
                      playerProfessions.lumberjackLevel > 0
                        ? playerProfessions.lumberjackLevel.toString()
                        : ' ',
                    fontSize: hudHeight * 0.25,
                    textAlign: 'top-right'
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value:
                      playerProfessions.butcherLevel > 0
                        ? playerProfessions.butcherLevel.toString()
                        : ' ',
                    fontSize: hudHeight * 0.25,
                    textAlign: 'top-right'
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value:
                      playerProfessions.miningLevel > 0
                        ? playerProfessions.miningLevel.toString()
                        : ' ',
                    fontSize: hudHeight * 0.25,
                    textAlign: 'top-right'
                  }}
                />
                <UiEntity
                  uiTransform={{ width: '100%' }}
                  uiText={{
                    value:
                      playerProfessions.assasinLevel > 0
                        ? playerProfessions.assasinLevel.toString()
                        : ' ',
                    fontSize: hudHeight * 0.25,
                    textAlign: 'top-right'
                  }}
                />
              </UiEntity>
            </UiEntity>
          </UiEntity>
        )}
        {/* {isInfoOpen && ( */}
        <UiEntity
          uiTransform={{
            display: isInfoOpen ? 'flex' : 'none',
            width: canvasInfo.height * 0.8,
            height: canvasInfo.height * 0.8,
            positionType: 'absolute',
            position: {
              top: (canvasInfo.height - canvasInfo.height * 0.8) / 2,
              right:
                (canvasInfo.width - canvasInfo.height * 0.8) / 2 - hudHeight * 2
            }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(mainHudSprites.infoPanel),
            texture: {
              src: mainHudSprites.infoPanel.atlasSrc
            }
          }}
        >
          <UiEntity
            uiTransform={{
              width: canvasInfo.height * 0.05,
              height: canvasInfo.height * 0.05,
              positionType: 'absolute',
              position: { top: '22%', right: '2%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(mainHudSprites.exitButton),
              texture: {
                src: mainHudSprites.exitButton.atlasSrc
              }
            }}
            onMouseDown={() => {
              showInfo(false)
            }}
          />
          <UiEntity
            uiTransform={{
              width: canvasInfo.height * 0.05 * 1.27,
              height: canvasInfo.height * 0.05,
              positionType: 'absolute',
              position: { bottom: '23%', right: '2%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(mainHudSprites.discordLogo),
              texture: {
                src: mainHudSprites.discordLogo.atlasSrc
              }
            }}
            onMouseDown={() => {
              openLink(DISCORD_URL)
            }}
          />
          <UiEntity
            uiTransform={{
              width: canvasInfo.height * 0.05,
              height: canvasInfo.height * 0.05,
              positionType: 'absolute',
              position: { bottom: '23%', right: '12%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(mainHudSprites.twitterLogo),
              texture: {
                src: mainHudSprites.twitterLogo.atlasSrc
              }
            }}
            onMouseDown={() => {
              openLink(TWITTER_URL)
            }}
          />
        </UiEntity>
        {/* )} */}
      </UiEntity>
      
      {/* Tower Upgrade Button - positioned above the units button */}
      <UiEntity
        uiTransform={{
          width: hudHeight,
          height: hudHeight,
          position: { right: hudHeight * 0.2, top: hudHeight * 11.3 },
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'assets/images/towerUpgradePurchace/Icon_Tower.png'
          }
        }}
        onMouseDown={() => {
          showTowerUpgrade()
        }}
      />
      <Label
        value="Tower"
        fontSize={hudHeight * 0.2}
        color={Color4.White()}
        uiTransform={{
          position: { right: hudHeight * 0.2, top: hudHeight * 12.0 },
          positionType: 'absolute',
          width: hudHeight,
          height: hudHeight * 0.4
        }}
        textAlign="middle-center"
      />

      {/* Units Button - positioned below the main HUD bar */}
      <UiEntity
        uiTransform={{
          width: hudHeight,
          height: hudHeight,
          position: { right: hudHeight * 0.2, top: hudHeight * 12.5 },
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'assets/images/unitPurchase/unitPurchaseButton.png'
          }
        }}
        onMouseDown={() => {
          showLumberjack()
        }}
      />
      <Label
        value="Units"
        fontSize={hudHeight * 0.2}
        color={Color4.White()}
        uiTransform={{
          position: { right: hudHeight * 0.2, top: hudHeight * 13.2 },
          positionType: 'absolute',
          width: hudHeight,
          height: hudHeight * 0.4
        }}
        textAlign="middle-center"
      />

      {/* Inventory Button - positioned under unit purchase button */}
      <UiEntity
        uiTransform={{
          width: hudHeight,
          height: hudHeight,
          position: { right: hudHeight * 0.2, top: hudHeight * 13.7 },
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(mainHudSprites.inventoryIcon),
          texture: {
            src: mainHudSprites.inventoryIcon.atlasSrc
          }
        }}
        onMouseDown={() => {
          showInventory()
        }}
      />
      <Label
        value="Inventory"
        fontSize={hudHeight * 0.2}
        color={Color4.White()}
        uiTransform={{
          position: { right: hudHeight * 0.2, top: hudHeight * 14.4 },
          positionType: 'absolute',
          width: hudHeight,
          height: hudHeight * 0.4
        }}
        textAlign="middle-center"
      />

      {/* Info Button (question mark) - positioned under inventory button */}
      <UiEntity
        uiTransform={{
          width: hudHeight,
          height: hudHeight,
          position: { right: hudHeight * 0.2, top: hudHeight * 14.9 },
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(mainHudSprites.infoMenuIcon),
          texture: {
            src: mainHudSprites.infoMenuIcon.atlasSrc
          }
        }}
        onMouseDown={() => {
          showInfo(true)
        }}
      />
      <Label
        value="Info"
        fontSize={hudHeight * 0.2}
        color={Color4.White()}
        uiTransform={{
          position: { right: hudHeight * 0.2, top: hudHeight * 15.6 },
          positionType: 'absolute',
          width: hudHeight,
          height: hudHeight * 0.4
        }}
        textAlign="middle-center"
      />

      {/* Deployed Units Display */}
      <DeployedUnitsDisplay isVisible={true} />

      {/* Rules Screen - rendered on top when game hasn't started */}
      <PlayButton 
        isVisible={PlayButtonManager.getInstance().getIsVisible()}
        onPlayClicked={() => PlayButtonManager.getInstance().dismissRules()}
      />



      {/* Game Over Screen - rendered on top when game is over */}
      <GameOverScreen />
    </Canvas>
  )
}

export default MainHud
