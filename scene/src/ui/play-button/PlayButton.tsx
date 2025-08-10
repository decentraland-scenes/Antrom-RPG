import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine, AudioSource } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { TutorialManager } from '../tutorial/TutorialManager'

export interface PlayButtonProps {
  isVisible: boolean
  onPlayClicked: () => void
  onTutorialClicked: () => void
}

export function PlayButton({ isVisible, onPlayClicked, onTutorialClicked }: PlayButtonProps): ReactEcs.JSX.Element | null {
  if (!isVisible) return null
  
  // Hide play button when tutorial is active
  const tutorialManager = TutorialManager.getInstance()
  if (tutorialManager.isTutorialActive()) return null

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        positionType: 'absolute',
        position: { left: 0, top: 0 }
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.7) }}
    >
      {/* Main Rules Screen */}
      <UiEntity
        uiTransform={{
          width: '500px',
          height: '600px',
          positionType: 'absolute',
          position: { left: '50%', top: '50%' },
          margin: { left: '-250px', top: '-300px' }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/unitPurchase/frames/purchase_menu_frame.png' }
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

        {/* Title */}
        <Label
          value="Antrom Gargoyle Fountain Tower Defense!"
          fontSize={32}
          color={Color4.create(1, 0.8, 0, 1.0)} // Gold color
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: '80px',
            positionType: 'absolute',
            position: { left: '0%', top: '30px' }
          }}
        />

        {/* Subtitle */}
        <Label
          value="Prepare your defenses!"
          fontSize={22}
          color={Color4.White()}
          textAlign="middle-center"
          uiTransform={{
            width: '100%',
            height: '50px',
            positionType: 'absolute',
            position: { left: '0%', top: '120px' }
          }}
        />

        {/* Instructions */}
        <Label
          value="• Place fighters near the tower\n• Gather resources with lumberjacks and miners\n• Defend the gargoyle fountain from executioners\n• Waves start 5 minutes after clicking PLAY"
          fontSize={18}
          color={Color4.create(0.8, 0.8, 0.8, 1.0)}
          textAlign="middle-center"
          uiTransform={{
            width: '90%',
            height: '200px',
            positionType: 'absolute',
            position: { left: '5%', top: '200px' }
          }}
        />



        {/* OK Button */}
        <UiEntity
          uiTransform={{
            width: '80%',
            height: '70px',
            positionType: 'absolute',
            position: { left: '10%', top: '450px' }
          }}
          uiBackground={{ color: Color4.create(0.1, 0.7, 0.1, 1.0) }}
          onMouseDown={() => {
            // Button click sound
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
            
            // Call the play clicked callback
            onPlayClicked()
          }}
        >
          <Label
            value="OK"
            fontSize={24}
            color={Color4.White()}
            textAlign="middle-center"
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
          />
        </UiEntity>

        {/* Tutorial Button */}
        <UiEntity
          uiTransform={{
            width: '80%',
            height: '50px',
            positionType: 'absolute',
            position: { left: '10%', top: '540px' }
          }}
          uiBackground={{ color: Color4.create(0.2, 0.2, 0.8, 1.0) }}
          onMouseDown={() => {
            // Button click sound
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
            
            // Call the tutorial clicked callback
            onTutorialClicked()
          }}
        >
          <Label
            value="TUTORIAL"
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
    </UiEntity>
  )
} 