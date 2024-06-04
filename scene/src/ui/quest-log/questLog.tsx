import { canvasInfo } from '.'
import { QUEST_STAGES } from './questsData'
import type { StageButtonType } from './questsData'

import ReactEcs, {
  Button,
  ReactEcsRenderer,
  UiEntity
} from '@dcl/sdk/react-ecs'

export function setupQuestLog(): void {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
const isInfo: boolean = false
let isVisible: boolean = false
let selectedStage: string = 'quest'
let stageDescription: string = ''
let stageNeeded: number = 0
let stageProgress: number = -1
let progress: string = ''
let isProgressVisible: boolean = false

const uiComponent = (): ReactEcs.JSX.Element => (
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
          display:
            isVisible !== undefined && isVisible !== null ? 'none' : 'flex',
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
          display:
            isVisible !== undefined && isVisible !== null ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: canvasInfo.width * 0.3,
            height: (canvasInfo.width * 0.5) / 1.33,
            display: isInfo !== undefined && isInfo !== null ? 'none' : 'flex',
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
              display:
                isInfo !== undefined && isInfo !== null ? 'none' : 'flex',
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
              display:
                isInfo !== undefined && isInfo !== null ? 'none' : 'flex',
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
                  <StageButton title={stage.title} id={stage.id} />
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
                  positionType: 'relative',
                  width: '80%',
                  height: '10%',
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
              <UiEntity
                uiTransform={{
                  width: '80%',
                  height: '10%',
                  positionType: 'relative',
                  margin: { left: '10%', top: '10%' },
                  display: selectedStage === 'quest' ? 'none' : 'flex'
                }}
              >
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

function changeVisibility(): void {
  isVisible = !isVisible
}

function StageButton(props: StageButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{ width: '100%', height: '100%' }}
      uiText={{ value: props.title, textAlign: 'middle-left', fontSize: 18 }}
      onMouseDown={() => {
        setStage(props.id)
      }}
    />
  )
}

function setStage(id: string): void {
  const stage = QUEST_STAGES.filter((stage) => stage.id === id)[0]
  stageDescription = stage.info
  stageNeeded = stage.need
  stageProgress = stage.progress
  selectedStage = stage.id
  progress = stage.progress.toString() + '/' + stage.need.toString()
  isProgressVisible = false
}

function openQuestLog(): void {
  setStage('quest')
  isVisible = true
}

function showProgress(): void {
  isProgressVisible = true
}
