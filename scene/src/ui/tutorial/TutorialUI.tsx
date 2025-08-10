import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import Canvas from '../canvas/Canvas'
import { Color4 } from '@dcl/sdk/math'
import { TutorialManager } from './TutorialManager'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { getUvs } from '../../utils/ui-utils'

interface TutorialUIProps {
  isVisible: boolean
}

// Tutorial UI sprites
const tutorialSprites = {
  background: {
    atlasSrc: 'assets/images/UiElements/Pop_up_Window.png',
    atlasSize: { x: 512, y: 256 },
    x: 0,
    y: 0,
    w: 512,
    h: 256
  },
  nextButton: {
    atlasSrc: 'assets/images/tutorialQuest/nextButton.png',
    atlasSize: { x: 110, y: 40 },
    x: 0,
    y: 0,
    w: 110,
    h: 40
  },
  skipButton: {
    atlasSrc: 'assets/images/eventQuests/Abandon_Quest.png',
    atlasSize: { x: 99, y: 40 },
    x: 0,
    y: 0,
    w: 99,
    h: 40
  },
  startButton: {
    atlasSrc: 'assets/images/UiElements/Bag_button_green.png',
    atlasSize: { x: 140, y: 40 },
    x: 0,
    y: 0,
    w: 140,
    h: 40
  }
}

export function TutorialUI({ isVisible }: TutorialUIProps): ReactEcs.JSX.Element | null {
  if (!isVisible) return null

  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (!canvasInfo) return null

  const tutorialManager = TutorialManager.getInstance()
  const isTutorialActive = tutorialManager.isTutorialActive()
  const currentStep = tutorialManager.getCurrentStep()

  return (
    <Canvas>
      {/* Main Tutorial Container - positioned above tower upgrade menu */}
      <UiEntity
        uiTransform={{
          width: '500px',
          height: '400px',
          positionType: 'absolute',
          position: { right: '120px', top: '35%' },
          margin: { top: '-200px' }
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
            margin: { top: '20px' },
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
              value: isTutorialActive ? currentStep?.title || "TUTORIAL" : "TUTORIAL",
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
              position: { right: '30px', top: '-10px' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/x.png' }
            }}
            onMouseDown={() => {
              tutorialManager.skipTutorial()
            }}
          />
        </UiEntity>

        {/* Step Progress Indicator */}
        {isTutorialActive && (
          <UiEntity
            uiTransform={{
              width: '180px',
              height: '35px',
              positionType: 'absolute',
              position: { left: '30px', top: '70px' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/unitPurchase/frames/Background_Square_skill.png'
              }
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%'
              }}
              uiText={{
                value: `Step ${tutorialManager.getCurrentStepIndex() + 1} of ${tutorialManager.getTotalSteps()}`,
                fontSize: 14,
                color: Color4.Yellow(),
                textAlign: 'middle-center'
              }}
            />
          </UiEntity>
        )}

        {/* Content Area */}
        <UiEntity
          uiTransform={{
            width: '90%',
            height: '200px',
            positionType: 'absolute',
            position: { left: '5%', top: '120px' }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
            uiText={{
              value: isTutorialActive 
                ? currentStep?.instructions || "Follow the instructions" 
                : "Welcome to Antrom! This tutorial will guide you through the basics of resource gathering and unit deployment. You'll learn how to deploy lumberjacks to gather wood and fighters for combat.",
              fontSize: 16,
              color: Color4.White(),
              textAlign: 'middle-center'
            }}
          />
        </UiEntity>

        {/* Button Section */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '60px',
            positionType: 'absolute',
            position: { left: '0%', top: '340px' },
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          {isTutorialActive ? (
            <UiEntity>
              {/* Next Button */}
              <UiEntity
                uiTransform={{
                  width: '120px',
                  height: '40px',
                  margin: { right: '20px' }
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: {
                    src: 'assets/images/UiElements/Bag_button_green.png'
                  }
                }}
                onMouseDown={() => {
                  tutorialManager.nextStep()
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '100%',
                    height: '100%'
                  }}
                  uiText={{
                    value: "Next",
                    fontSize: 16,
                    color: Color4.White(),
                    textAlign: 'middle-center'
                  }}
                />
              </UiEntity>

              {/* Skip Tutorial Button */}
              <UiEntity
                uiTransform={{
                  width: '120px',
                  height: '40px',
                  margin: { left: '20px' }
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: {
                    src: 'assets/images/UiElements/Bag_button_red.png'
                  }
                }}
                onMouseDown={() => {
                  tutorialManager.skipTutorial()
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '100%',
                    height: '100%'
                  }}
                  uiText={{
                    value: "Skip Tutorial",
                    fontSize: 14,
                    color: Color4.White(),
                    textAlign: 'middle-center'
                  }}
                />
              </UiEntity>
            </UiEntity>
          ) : (
            <UiEntity>
              {/* Start Tutorial Button */}
              <UiEntity
                uiTransform={{
                  width: '160px',
                  height: '45px',
                  positionType: 'absolute',
                  position: { left: '50%', top: '50%' },
                  margin: { left: '-80px', top: '-22px' }
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: {
                    src: 'assets/images/UiElements/Bag_button_green.png'
                  }
                }}
                onMouseDown={() => {
                  tutorialManager.startTutorial()
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '100%',
                    height: '100%'
                  }}
                  uiText={{
                    value: "Start Tutorial",
                    fontSize: 18,
                    color: Color4.White(),
                    textAlign: 'middle-center'
                  }}
                />
              </UiEntity>

              {/* Restart Tutorial Button */}
              <UiEntity
                uiTransform={{
                  width: '160px',
                  height: '45px',
                  positionType: 'absolute',
                  position: { left: '50%', top: '50%' },
                  margin: { left: '100px', top: '-22px' }
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  texture: {
                    src: 'assets/images/UiElements/Bag_button_green.png'
                  }
                }}
                onMouseDown={() => {
                  tutorialManager.restartTutorial()
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '100%',
                    height: '100%'
                  }}
                  uiText={{
                    value: "Restart",
                    fontSize: 18,
                    color: Color4.White(),
                    textAlign: 'middle-center'
                  }}
                />
              </UiEntity>
            </UiEntity>
          )}
        </UiEntity>
      </UiEntity>
    </Canvas>
  )
} 