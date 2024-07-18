import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
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

type MainHudProps = {
  isPlayerRollOpen: boolean
  isInfoOpen: boolean
  playerRollOnClick: (arg: boolean) => void
  showInfo: (arg: boolean) => void
  openLink: (arg: string) => void
  characterRace: CharacterRaces
  characterClass: CharacterClasses
  characterAlliance: CharacterAlliances
  lastRoll: lastRollType
  playerProfessions: playersProfessionsType
}

function MainHud({
  isPlayerRollOpen,
  isInfoOpen,
  playerRollOnClick,
  showInfo,
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
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: hudHeight,

          position: { right: hudHeight * 2, top: hudHeight * 0.25 },
          positionType: 'absolute',
          justifyContent: 'flex-end'
        }}
      >
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%',
            margin: { right: hudHeight * 0.2 }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(mainHudSprites.changeAvatarIcon),
            texture: {
              src: mainHudSprites.changeAvatarIcon.atlasSrc
            }
          }}
        />
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%',
            margin: { right: hudHeight * 0.2 }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(mainHudSprites.inventoryIcon),
            texture: {
              src: mainHudSprites.inventoryIcon.atlasSrc
            }
          }}
        />
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%',
            margin: { right: hudHeight * 0.2 }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(mainHudSprites.dailyDutiesIcon),
            texture: {
              src: mainHudSprites.dailyDutiesIcon.atlasSrc
            }
          }}
        />
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%',
            margin: { right: hudHeight * 0.2 }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(mainHudSprites.leaderIcon),
            texture: {
              src: mainHudSprites.leaderIcon.atlasSrc
            }
          }}
        />
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%',
            margin: { right: hudHeight * 0.2 }
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
        <UiEntity
          uiTransform={{
            width: hudHeight,
            height: '100%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(menuIconSprite),
            texture: {
              src: menuIconSprite.atlasSrc
            }
          }}
          onMouseDown={() => {
            playerRollOnClick(!isPlayerRollOpen)
          }}
        />
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
    </Canvas>
  )
}

export default MainHud
