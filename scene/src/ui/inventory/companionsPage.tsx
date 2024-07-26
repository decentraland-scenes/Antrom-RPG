// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import {
  companionPageSprite,
  companions,
  PetTypes,
  type CompanionType
} from './companionsData'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'

type CompanionsPageProps = {
  selectedCompanion: CompanionType | undefined
  equipedCompanion: CompanionType | undefined
  selectCompanion: (companion: CompanionType) => void
  onClickButton: () => void
  buttonSprite: Sprite
  purchasedCompanions: Array<CompanionType | undefined>
}

function CompanionSlot(
  companion: CompanionType | undefined,
  selectCompanion: (arg: CompanionType) => void,
  key: string
): ReactEcs.JSX.Element | null {
  if (companion === undefined) {
    return null
  }

  return (
    <UiEntity
      key={key}
      uiTransform={{
        width: '25%',
        height: '25%'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(companion.sprite),
        texture: { src: companion.sprite.atlasSrc }
      }}
      onMouseDown={() => {
        selectCompanion(companion)
      }}
    >
      <UiEntity
        key={companion.name}
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(companion.sprite),
          texture: { src: companion.sprite.atlasSrc }
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
          uvs: getUvs(companionPageSprite.common_frame),
          texture: { src: companionPageSprite.common_frame.atlasSrc }
        }}
      />
    </UiEntity>
  )
}

function CompanionsPage({
  selectedCompanion,
  equipedCompanion,
  selectCompanion,
  buttonSprite,
  onClickButton,
  purchasedCompanions
}: CompanionsPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(companionPageSprite.companion_frame),
        texture: { src: companionPageSprite.companion_frame.atlasSrc }
      }}
    >
      {/* Selected Companion */}
      {selectedCompanion !== undefined &&
        selectedCompanion.type !== PetTypes.PLACEHOLDER && (
          <UiEntity
            uiTransform={{
              width: '50%',
              height: '100%',
              position: { left: '0.5%' },
              positionType: 'absolute',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <UiEntity
              uiTransform={{ margin: { top: '10%', bottom: '10%' } }}
              uiText={{
                value: selectedCompanion.name,
                fontSize: canvasInfo.height * 0.03,
                textAlign: 'middle-center'
              }}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.height * 0.5,
                height: canvasInfo.height * 0.5
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(selectedCompanion?.sprite),
                texture: {
                  src:
                    selectedCompanion !== undefined
                      ? selectedCompanion.sprite.atlasSrc
                      : ''
                }
              }}
            />
          </UiEntity>
        )}

      {/* Selected Companion Details */}
      {selectedCompanion !== undefined &&
        selectedCompanion.type !== PetTypes.PLACEHOLDER && (
          <UiEntity
            uiTransform={{
              width: '15%',
              height: '100%',
              position: { left: '52%' },
              positionType: 'absolute',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <UiEntity
              uiTransform={{ margin: { top: '35%', bottom: '10%' } }}
              uiText={{
                value: selectedCompanion.lore,
                fontSize: canvasInfo.height * 0.02,
                textAlign: 'middle-left'
              }}
            />
            <UiEntity
              uiText={{
                value: selectedCompanion.stats,
                fontSize: canvasInfo.height * 0.02,
                textAlign: 'middle-left'
              }}
            />
          </UiEntity>
        )}

      {/* Companions */}
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * 0.23,
          height: '100%',
          position: { right: '2%' },
          positionType: 'absolute',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.3 * 0.7,
            height: canvasInfo.width * 0.3 * 0.7,
            margin: { bottom: '15%', top: '35%' },
            flexWrap: 'wrap'
          }}
        >
          {companions.map((companion, index) =>
            CompanionSlot(companion, selectCompanion, index.toString())
          )}
        </UiEntity>

        {selectedCompanion !== undefined &&
          selectedCompanion.type !== PetTypes.PLACEHOLDER && (
            <UiEntity
              uiTransform={{ width: '70%', height: '8%' }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(buttonSprite),
                texture: { src: buttonSprite.atlasSrc }
              }}
              onMouseDown={onClickButton}
            />
          )}
      </UiEntity>
    </UiEntity>
  )
}

export default CompanionsPage
