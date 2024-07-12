import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import Canvas from '../canvas/Canvas'
import { mainHudSprites } from './mainHudData'

type MainHudProps = {
  isVisible: boolean
  isPlayerRollOpen: boolean
  isInfoOpen: boolean
  playerRollOnClick: (arg: boolean) => void
  showInfo: () => void
}

function MainHud({
  isVisible,
  isPlayerRollOpen,
  isInfoOpen,
  playerRollOnClick,
  showInfo
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
                showInfo()
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
                width: canvasInfo.height * 0.5 * 0.43,
                height: canvasInfo.height * 0.5,
                positionType: 'absolute',
                position: { top: hudHeight * 2, right: -hudHeight * 1.5 }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(mainHudSprites.playerRoll),
                texture: {
                  src: mainHudSprites.playerRoll.atlasSrc
                }
              }}
            ></UiEntity>
          )}
          {isInfoOpen && (
            <UiEntity
              uiTransform={{
                width: canvasInfo.height * .8,
                height: canvasInfo.height * .8,
                positionType: 'absolute',
                position: {
                  top: (canvasInfo.height - canvasInfo.height * 0.8) / 2,
                  right: (canvasInfo.width - canvasInfo.height * 0.8) / 2 - hudHeight * 2
                }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(mainHudSprites.infoPanel),
                texture: {
                  src: mainHudSprites.infoPanel.atlasSrc
                }
              }}
            ></UiEntity>
          )}
        </UiEntity>
      )}
    </Canvas>
  )
}

export default MainHud
