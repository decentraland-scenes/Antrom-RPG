import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { QUEST_STAGES } from './questsData'

import ReactEcs, { Button, UiEntity } from '@dcl/sdk/react-ecs'
import { StageButton } from './stageButton'

type questLogProps = {
  isInfo: boolean
  isVisible: boolean
  selectedStage: string
  stageDescription: string
  stageNeeded: number
  stageProgress: number
  progress: string
  isProgressVisible: boolean
  setStage: (arg: string) => void
  openQuestLog: () => void
  showProgress: () => void
  changeVisibility: () => void
}

function QuestLog({
  isInfo,
  isVisible,
  selectedStage,
  stageDescription,
  stageNeeded,
  stageProgress,
  progress,
  isProgressVisible,
  setStage,
  openQuestLog,
  showProgress,
  changeVisibility
}: questLogProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%'
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.1,
            height: canvasInfo.width * 0.1 * 0.216,
            display: 'flex',
            positionType: 'absolute',
            position: { top: '20%', right: '0.5%' }
          }}
          uiText={{
            value: 'Quest Info',
            textAlign: 'middle-left',
            fontSize: 12,
            font: 'sans-serif'
          }}
        />
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.1,
            height: canvasInfo.width * 0.1 * 0.216,
            display: isVisible ? 'none' : 'flex',
            positionType: 'absolute',
            position: { top: '25%', right: '0.5%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: 'assets/images/eventQuests/questInProgress.png' }
          }}
          onMouseDown={openQuestLog}
        />

        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: '100%',
            height: '100%',
            display: isVisible ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: canvasInfo.width * 0.3,
              height: (canvasInfo.width * 0.5) / 1.33,
              display: isInfo ? 'none' : 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/eventQuests/questMenuUI2.png'
              }
            }}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: '81%',
                height: '24%',
                margin: { top: '17%' },
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: 'assets/images/callanQuest/2.png'
                }
              }}
            />
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: '80%',
                height: '55%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-start',
                  justifyContent: 'flex-start'
                }}
              >
                {QUEST_STAGES.slice(1).map((stage, index) => (
                  <UiEntity
                    key={index}
                    uiTransform={{ width: '100%', height: '20%' }}
                  >
                    <StageButton stage={stage} setStage={setStage} />
                  </UiEntity>
                ))}
              </UiEntity>
              <UiEntity
                uiTransform={{
                  positionType: 'relative',
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-start'
                }}
              >
                <UiEntity
                  uiTransform={{
                    positionType: 'relative',
                    width: '80%',
                    height: '50%',
                    margin: { left: '10%', top: '20%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'flex-start'
                  }}
                  uiText={{
                    value: stageDescription,
                    fontSize: 14,
                    textAlign: 'top-left'
                  }}
                />

                <UiEntity
                  uiTransform={{
                    width: '80%',
                    height: '10%',
                    positionType: 'relative',
                    margin: { left: '10%', top: '10%' },
                    display: selectedStage === 'quest' ? 'none' : 'flex'
                  }}
                >
                  <UiEntity
                    uiTransform={{
                      positionType: 'relative',
                      width: '80%',
                      height: '100%',
                      margin: { left: '10%', top: '10%' },
                      display: isProgressVisible ? 'flex' : 'none',
                      flexDirection: 'column',
                      alignSelf: 'flex-start'
                    }}
                    uiText={{
                      value: progress,
                      fontSize: 14,
                      textAlign: 'top-left'
                    }}
                  />
                  <Button
                    value=""
                    variant="secondary"
                    // disabled={stageNeeded == stageProgress}
                    uiTransform={{
                      width: '100%',
                      height: '100%',
                      display: isProgressVisible ? 'none' : 'flex'
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                        src: 'assets/images/eventQuests/checkProgressButton.png'
                      }
                    }}
                    onMouseDown={showProgress}
                  />
                </UiEntity>
                <UiEntity
                  uiTransform={{
                    width: '80%',
                    height: '10%',
                    positionType: 'relative',
                    margin: { left: '10%', top: '10%' },
                    display: selectedStage === 'quest' ? 'flex' : 'none'
                  }}
                >
                  <Button
                    value=""
                    variant="secondary"
                    // disabled={stageNeeded == stageProgress}
                    uiTransform={{
                      width: '100%',
                      height: '100%',
                      display: 'flex'
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                        src: 'assets/images/eventQuests/Abandon_Quest.png'
                      }
                    }}
                    onMouseDown={changeVisibility}
                  />
                </UiEntity>
                <Button
                  value=""
                  variant="secondary"
                  // disabled={stageNeeded == stageProgress}
                  uiTransform={{
                    width: '80%',
                    height: '10%',
                    positionType: 'relative',
                    margin: { left: '10%', top: '5%' },
                    display: 'flex'
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                      src:
                        stageNeeded === stageProgress
                          ? 'assets/images/eventQuests/claimRewardActive.png'
                          : 'assets/images/eventQuests/claimRewardInactive.png'
                    }
                  }}
                />
              </UiEntity>
            </UiEntity>

            <UiEntity
              uiTransform={{
                position: { right: '10%', top: '8%' },
                positionType: 'absolute',
                width: '25',
                height: '25'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'assets/images/eventQuests/exitButton.png' }
              }}
              onMouseDown={changeVisibility}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default QuestLog
