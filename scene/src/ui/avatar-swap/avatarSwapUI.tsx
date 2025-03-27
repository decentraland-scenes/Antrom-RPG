import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { getUvs } from '../../utils/ui-utils'

interface AvatarSwapUIProps {
  isVisible: boolean
  onClose: () => void
  player: Player
}

const AVATAR_MODELS = [
  'assets/models/BaseCharacter.glb',
  'assets/models/KnightwSwordNPC.glb',
  'assets/models/Mage.glb',
  'assets/models/RangerNPC.glb',
  'assets/models/SkeletonPvP.glb'
]

export function AvatarSwapUI({ isVisible, onClose, player }: AvatarSwapUIProps): ReactEcs.JSX.Element | null {
  if (!isVisible) return null

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        positionType: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.5)
      }}
    >
      <UiEntity
        uiTransform={{
          width: '30%',
          height: '50%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        uiBackground={{
          color: Color4.create(0.2, 0.2, 0.2, 0.9)
        }}
      >
        <Label
          value="Select Avatar"
          fontSize={24}
          color={Color4.White()}
          uiTransform={{
            margin: { bottom: 20 }
          }}
        />
        
        {AVATAR_MODELS.map((model, index) => (
          <UiEntity
            key={index}
            uiTransform={{
              width: '80%',
              height: 50,
              margin: { bottom: 10 }
            }}
            uiBackground={{
              color: model === player.getCurrentAvatar() 
                ? Color4.create(0.3, 0.3, 0.3, 1)
                : Color4.create(0.2, 0.2, 0.2, 1)
            }}
            onMouseDown={async () => {
              await player.swapAvatar(model)
            }}
          >
            <Label
              value={model.split('/').pop()?.replace('.glb', '') || ''}
              fontSize={18}
              color={Color4.White()}
              uiTransform={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </UiEntity>
        ))}

        <UiEntity
          uiTransform={{
            width: 100,
            height: 40,
            margin: { top: 20 }
          }}
          uiBackground={{
            color: Color4.create(0.3, 0.3, 0.3, 1)
          }}
          onMouseDown={onClose}
        >
          <Label
            value="Close"
            fontSize={18}
            color={Color4.White()}
            uiTransform={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
} 