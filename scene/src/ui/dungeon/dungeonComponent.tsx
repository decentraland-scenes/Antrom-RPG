import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, UiEntity } from '@dcl/sdk/react-ecs'
import type { Option } from './dungeonsData'
import {
  DAILY_FREE_TOKENS,
  DIFFICULTIES,
  DUNGEONS,
  DUNGEONS_TO_SHOW,
  PREMIUM_TOKENS,
  SEASON_PASS
} from './dungeonsData'
import { OptionButton } from './optionButton'
import Canvas from '../canvas/Canvas'

export type SelectOptionProps = {
  id: string
  array: Option[]
}

type DungeonProps = {
  isLoading: boolean
  isInfo: boolean
  isOpen: boolean
  scrollPosition: number
  dungeon: string
  difficulty: string
  isPlayable: boolean
  setOpen: (arg: boolean) => void
  scrollRight: () => void
  scrollLeft: () => void
  selectOption: ({ id, array }: SelectOptionProps) => void
  changeInfo: () => void
  getLoadingImage: () => string
  openDungeonSelection: () => void
  playDungeon: () => void
}

function Dungeon({
  isInfo,
  isOpen,
  isLoading,
  scrollPosition,
  isPlayable,
  setOpen,
  scrollRight,
  scrollLeft,
  selectOption,
  changeInfo,
  getLoadingImage,
  openDungeonSelection,
  playDungeon
}: DungeonProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  if (canvasInfo === null) return null

  return (
    <Canvas>
      {isLoading && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            display: isLoading ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: getLoadingImage() }
          }}
        />
      )}
      {!isLoading && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            display: isLoading ? 'none' : 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              width: '10%',
              height: '100%',
              display: isOpen ? 'none' : 'flex',
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                width:
                  canvasInfo.width * 0.1 > 100 ? 100 : canvasInfo.width * 0.1,
                height:
                  canvasInfo.width * 0.1 > 100 ? 100 : canvasInfo.width * 0.1,
                display: isOpen ? 'none' : 'flex',
                positionType: 'absolute',
                position: { top: '50%', right: 20 }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/dungeon.png' }
              }}
              onMouseDown={openDungeonSelection}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: '100%',
              height: '100%',
              display: isOpen ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                position: { right: 80 },
                positionType: 'absolute',
                width: '250',
                height: '300',
                display: isOpen ? 'flex' : 'none',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                flexDirection: 'column'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/DungeonTokens.png' }
              }}
            >
              <Label
                uiTransform={{ width: '25%', height: '22%' }}
                value={DAILY_FREE_TOKENS.toString()}
                color={Color4.Black()}
                fontSize={29}
              />
              <Label
                uiTransform={{ width: '25%', height: '22%' }}
                value={PREMIUM_TOKENS.toString()}
                color={Color4.Black()}
                fontSize={29}
              />
              <Label
                uiTransform={{
                  width: '25%',
                  height: '22%',
                  margin: { bottom: '5%' }
                }}
                value={SEASON_PASS.toString()}
                color={Color4.Black()}
                fontSize={29}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.5,
                height: (canvasInfo.width * 0.5) / 1.33,
                display: isInfo ? 'flex' : 'none'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: 'assets/images/chooseDungeon/dungeonInfoFrame.png'
                }
              }}
            >
              <Button
                value=""
                variant="secondary"
                uiTransform={{
                  width: '20%',
                  height: '8%',
                  positionType: 'absolute',
                  position: { bottom: '5%', left: '40%' }
                }}
                uiBackground={{
                  textureMode: 'center',
                  texture: {
                    src: 'assets/images/chooseDungeon/back.png'
                  }
                }}
                onMouseDown={changeInfo}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: canvasInfo.width * 0.5,
                height: (canvasInfo.width * 0.5) / 1.33,
                display: isInfo ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: 'assets/images/chooseDungeon/dungeonSelectionFrame.png'
                }
              }}
            >
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  position: { top: '32%' },
                  width: '80%',
                  height: '50',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '10%',
                    height: '70%'
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                      src: 'assets/images/chooseDungeon/arrowLeft.png'
                    }
                  }}
                  onMouseDown={scrollLeft}
                />

                {DUNGEONS.slice(
                  scrollPosition,
                  scrollPosition + DUNGEONS_TO_SHOW
                ).map((dungeon, index) => (
                  <UiEntity
                    key={index}
                    uiTransform={{ width: '25%', height: '80%' }}
                  >
                    <OptionButton
                      array={DUNGEONS}
                      visible={dungeon.visible}
                      available={dungeon.available}
                      selected={dungeon.selected}
                      imgSources={dungeon.imgSources}
                      id={dungeon.id}
                      selectOption={selectOption}
                    />
                  </UiEntity>
                ))}

                <UiEntity
                  uiTransform={{
                    width: '10%',
                    height: '70%'
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                      src: 'assets/images/chooseDungeon/arrowRight.png'
                    }
                  }}
                  onMouseDown={scrollRight}
                />
              </UiEntity>
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  position: { top: '55%' },
                  width: '60%',
                  height: '50',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-around'
                }}
              >
                {DIFFICULTIES.map((difficulty, index) => (
                  <UiEntity
                    key={index}
                    uiTransform={{ width: '40%', height: '80%', margin: '2%' }}
                  >
                    <OptionButton
                      array={DIFFICULTIES}
                      visible={difficulty.visible}
                      available={difficulty.available}
                      selected={difficulty.selected}
                      imgSources={difficulty.imgSources}
                      id={difficulty.id}
                      selectOption={selectOption}
                    />
                  </UiEntity>
                ))}
              </UiEntity>

              <Button
                value=""
                variant="secondary"
                disabled={!isPlayable}
                uiTransform={{
                  width: '20%',
                  height: '40',
                  position: { bottom: '5%', left: '40%' },
                  positionType: 'absolute'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: {
                    src: isPlayable
                      ? 'assets/images/chooseDungeon/playAvail.png'
                      : 'assets/images/chooseDungeon/playUnavail.png'
                  }
                }}
                onMouseDown={playDungeon}
              />
              <UiEntity
                uiTransform={{
                  position: { right: '3%', top: '23%' },
                  positionType: 'absolute',
                  width: '25',
                  height: '25'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: { src: 'assets/images/chooseDungeon/exitButton.png' }
                }}
                onMouseDown={() => {
                  setOpen(false)
                }}
              />
              <UiEntity
                uiTransform={{
                  position: { left: '3%', top: '23%' },
                  positionType: 'absolute',
                  width: '25',
                  height: '25'
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: { src: 'assets/images/chooseDungeon/help.png' }
                }}
                onMouseDown={changeInfo}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      )}
    </Canvas>
  )
}

export default Dungeon
