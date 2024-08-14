import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, INPUT_KEYS_ARRAY, type Sprite } from '../../utils/ui-utils'
import {
  HEIGTH_FACTOR,
  HP_BACKGROUND_FACTOR,
  HP_FRAME_ASPECT_RATIO,
  HP_W_FRAME_FACTOR,
  WIDTH_FACTOR,
  XP_FRAME_ASPECT_RATIO,
  XP_W_FRAME_FACTOR,
  bottomBarSprites
} from './bottomBarData'
import { BottomBarSkillSlot } from './bottomBarSkillSlot'
import { type BottomBarProps } from './skillsData'

function BottomBar({
  currentXp,
  levelXp,
  currentHpPercent,
  level,
  slotsData,
  hasPotion,
  onTryPotion
}: BottomBarProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  // Sprite to HP Background:
  const HpBackgroundSprite: Sprite = {
    atlasSrc: 'assets/images/skillbar_spritesheet.png',
    atlasSize: { x: 645, y: 462 },
    x: 0,
    y: 0 + (100 - currentHpPercent),
    w: 100,
    h: 100 - (100 - currentHpPercent)
  }

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: canvasInfo.width,
        height: canvasInfo.height,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR,
          height: canvasInfo.width * HEIGTH_FACTOR,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          margin: { bottom: canvasInfo.height * 0.02 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.background),
          texture: { src: bottomBarSprites.background.atlasSrc }
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * XP_W_FRAME_FACTOR,
            height:
              canvasInfo.width *
              WIDTH_FACTOR *
              XP_W_FRAME_FACTOR *
              XP_FRAME_ASPECT_RATIO,
            positionType: 'absolute',
            position: { bottom: -canvasInfo.width * HEIGTH_FACTOR * 0.02 },
            alignItems: 'flex-start'
          }}
        >
          <UiEntity
            uiTransform={{
              width:
                (canvasInfo.width *
                  WIDTH_FACTOR *
                  XP_W_FRAME_FACTOR *
                  currentXp) /
                levelXp,
              height: '100%',
              positionType: 'absolute'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(bottomBarSprites.xpBackground),
              texture: { src: bottomBarSprites.xpBackground.atlasSrc }
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              positionType: 'absolute'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(bottomBarSprites.xpFrame),
              texture: { src: bottomBarSprites.xpFrame.atlasSrc }
            }}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              positionType: 'absolute',
              position: { bottom: canvasInfo.width * HEIGTH_FACTOR * 0.01 }
            }}
            uiText={{
              value: currentXp.toString() + '/' + levelXp.toString(),
              fontSize: canvasInfo.width * HEIGTH_FACTOR * 0.1
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * WIDTH_FACTOR * HP_BACKGROUND_FACTOR,
              height:
                (canvasInfo.width *
                  WIDTH_FACTOR *
                  HP_BACKGROUND_FACTOR *
                  currentHpPercent) /
                100,
              positionType: 'absolute',
              position: {
                top:
                  ((100 - currentHpPercent) / 100) *
                  canvasInfo.width *
                  WIDTH_FACTOR *
                  HP_BACKGROUND_FACTOR
              }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(HpBackgroundSprite),
              texture: { src: HpBackgroundSprite.atlasSrc }
            }}
          />
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * WIDTH_FACTOR * HP_W_FRAME_FACTOR,
              height:
                canvasInfo.width *
                WIDTH_FACTOR *
                HP_W_FRAME_FACTOR *
                HP_FRAME_ASPECT_RATIO,
              positionType: 'absolute',
              position: { top: -canvasInfo.width * HEIGTH_FACTOR * 0.28 }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(bottomBarSprites.hpFrame),
              texture: { src: bottomBarSprites.hpFrame.atlasSrc }
            }}
          />
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * WIDTH_FACTOR * HP_W_FRAME_FACTOR,
              height:
                canvasInfo.width *
                WIDTH_FACTOR *
                HP_W_FRAME_FACTOR *
                HP_FRAME_ASPECT_RATIO,
              positionType: 'absolute',
              position: { top: -canvasInfo.width * HEIGTH_FACTOR * 0.28 }
            }}
            uiText={{
              value: currentHpPercent.toFixed(0).toString() + '%',
              fontSize: canvasInfo.width * HEIGTH_FACTOR * 0.15
            }}
          />
        </UiEntity>

        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.33,
            height: canvasInfo.width * WIDTH_FACTOR * 0.095,
            positionType: 'absolute',
            justifyContent: 'space-between',
            position: {
              bottom: canvasInfo.width * HEIGTH_FACTOR * 0.155,
              left: canvasInfo.width * WIDTH_FACTOR * 0.051
            }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[0]}
              hotKey={INPUT_KEYS_ARRAY[0]}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[1]}
              hotKey={INPUT_KEYS_ARRAY[1]}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[2]}
              hotKey={INPUT_KEYS_ARRAY[2]}
            />
          </UiEntity>
        </UiEntity>

        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.33,
            height: canvasInfo.width * WIDTH_FACTOR * 0.095,
            positionType: 'absolute',
            justifyContent: 'space-between',
            position: {
              bottom: canvasInfo.width * HEIGTH_FACTOR * 0.155,
              right: canvasInfo.width * WIDTH_FACTOR * 0.051
            }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[3]}
              hotKey={INPUT_KEYS_ARRAY[3]}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[4]}
              hotKey={INPUT_KEYS_ARRAY[4]}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '30%',
              height: '100%'
            }}
          >
            <BottomBarSkillSlot
              slot={slotsData[5]}
              hotKey={INPUT_KEYS_ARRAY[5]}
            />
          </UiEntity>
        </UiEntity>

        <UiEntity
          uiTransform={{
            width: '10%',
            height: '10%',
            positionType: 'absolute',
            position: {
              bottom: canvasInfo.width * HEIGTH_FACTOR * 0.42,
              left: canvasInfo.width * WIDTH_FACTOR * 0.355
            }
          }}
          uiText={{
            value: level.toString(),
            fontSize: canvasInfo.width * HEIGTH_FACTOR * 0.1,
            textAlign: 'middle-center'
          }}
        />
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * WIDTH_FACTOR * 0.06,
            height: canvasInfo.width * WIDTH_FACTOR * 0.06,
            positionType: 'absolute',
            position: {
              bottom: canvasInfo.width * HEIGTH_FACTOR * 0.1,
              left: canvasInfo.width * WIDTH_FACTOR * 0.54
            }
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: hasPotion
                ? bottomBarSprites.potionEnabled.atlasSrc
                : bottomBarSprites.potionDisabled.atlasSrc
            },
            uvs: getUvs(
              hasPotion
                ? bottomBarSprites.potionEnabled
                : bottomBarSprites.potionDisabled
            )
          }}
          onMouseDown={() => {
            onTryPotion()
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

export default BottomBar
