import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import Canvas from '../canvas/Canvas'
import { DISCORD_URL, mainHudSprites, TWITTER_URL } from './mainHudData'
import { CLASSES, ALLIANCES, RACES, type CharacterClasses, type CharacterAlliances, type CharacterRaces } from '../creation-player/creationPlayerData'

type MainHudProps = {
  isVisible: boolean
  isPlayerRollOpen: boolean
  isInfoOpen: boolean
  playerRollOnClick: (arg: boolean) => void
  showInfo: (arg: boolean) => void
  openLink: (arg: string) => void
  characterRace: CharacterRaces
  characterClass: CharacterClasses
  characterAlliance: CharacterAlliances
  gainedExperience: number
  playerRoll: number
  enemyRoll: number
  playerAttack: number | 'MISSED'
  EnemmyAttack: number | 'MISSED'
}

function MainHud({
  isVisible,
  isPlayerRollOpen,
  isInfoOpen,
  playerRollOnClick,
  showInfo,
  openLink, 
  characterAlliance,
  characterRace,
  characterClass
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
  console.log({isInfoOpen})
  return (
    <Canvas>
      {isVisible && (
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
                flexDirection:'column'
              }}
            >
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: hudHeight * 1.3,
                  justifyContent:'space-around'
                }}>
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
                }} />
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
                }} />
              <UiEntity
                uiTransform={{
                  width: '30%',
                  height: '100%',
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(CLASSES[characterClass].selectedSprite),
                  texture: {
                    src: CLASSES[characterClass].selectedSprite.atlasSrc
                  }
                }} />
              </UiEntity>
              <UiEntity
              uiTransform={{
                
                width: canvasInfo.height * 0.5 * 0.43,
                height: canvasInfo.height * 0.5,
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(mainHudSprites.playerRoll),
                texture: {
                  src: mainHudSprites.playerRoll.atlasSrc
                }
              }}>

              </UiEntity>
            </UiEntity>
          )}
          {/* {isInfoOpen && ( */}
            <UiEntity
              uiTransform={{
                display:isInfoOpen?'flex':'none',

                width: canvasInfo.height * 0.8,
                height: canvasInfo.height * 0.8,
                positionType: 'absolute',
                position: {
                  top: (canvasInfo.height - canvasInfo.height * 0.8) / 2,
                  right:
                    (canvasInfo.width - canvasInfo.height * 0.8) / 2 -
                    hudHeight * 2
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
                  width: canvasInfo.height * 0.05,
                  height: canvasInfo.height * 0.05,
                  positionType: 'absolute',
                  position: { bottom: '22%', right: '2%' }
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: getUvs(mainHudSprites.discordLogo),
                  texture: {
                    src: mainHudSprites.discordLogo.atlasSrc
                  }
                }}
                onMouseDown={() => { openLink(DISCORD_URL) }}


              />
              <UiEntity
              uiTransform={{
                width: canvasInfo.height * 0.05,
                height: canvasInfo.height * 0.05,
                positionType: 'absolute',
                position: { bottom: '22%', right: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(mainHudSprites.twitterLogo),
                texture: {
                  src: mainHudSprites.twitterLogo.atlasSrc
                }
              }}
              onMouseDown={() => { openLink(TWITTER_URL) }}
              />
            </UiEntity>
          {/* )} */}
        </UiEntity>
      )}
    </Canvas>
  )
}

export default MainHud
