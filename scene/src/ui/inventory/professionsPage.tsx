// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Player } from '../../player/player'
import { getUvs } from '../../utils/ui-utils'
import {
  professions,
  professionsPageSprites,
  type ProfessionType
} from './professionsData'
import ProfessionItem from './professionsItem'

type ProfessionsPageProps = {
  selectedProfession: ProfessionType | undefined
  selectProfession: (arg: ProfessionType) => void
}

function ProfessionsPage({
  selectedProfession,
  selectProfession
}: ProfessionsPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  const ITEM_SIZE = canvasInfo.height * 0.25
  const ITEM_MARGIN_Y = canvasInfo.height * 0.025
  const FONT_SIZE = canvasInfo.height * 0.025

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(professionsPageSprites.blankProfessionFrame),
        texture: { src: professionsPageSprites.blankProfessionFrame.atlasSrc }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '70%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <UiEntity
          uiTransform={{
            width: '70%',
            height: ITEM_SIZE + ITEM_MARGIN_Y * 2,
            justifyContent: 'space-between',
            margin: { top: '5%' }
          }}
        >
          {Object.values(professions)
            .splice(0, 3)
            .map((profession) => (
              <UiEntity
                uiTransform={{
                  width: ITEM_SIZE * 0.825,
                  height: ITEM_SIZE,
                  margin: {
                    top: ITEM_MARGIN_Y,
                    bottom: ITEM_MARGIN_Y
                  }
                }}
              >
                <ProfessionItem
                  profession={profession}
                  selectedProfession={selectedProfession}
                  level={Player.getInstance().levels.getLevel(profession.type)}
                  selectProfession={selectProfession}
                />
              </UiEntity>
            ))}
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '70%',
            height: ITEM_SIZE + ITEM_MARGIN_Y * 2,
            justifyContent: 'space-between'
          }}
        >
          {Object.values(professions)
            .slice(3)
            .map((profession) => (
              <UiEntity
                uiTransform={{
                  width: ITEM_SIZE * 0.825,
                  height: ITEM_SIZE,
                  margin: {
                    top: ITEM_MARGIN_Y,
                    bottom: ITEM_MARGIN_Y
                  }
                }}
              >
                <ProfessionItem
                  profession={profession}
                  selectedProfession={selectedProfession}
                  level={Player.getInstance().levels.getLevel(profession.type)}
                  selectProfession={selectProfession}
                />
              </UiEntity>
            ))}
        </UiEntity>
      </UiEntity>
      {selectedProfession !== undefined && (
        <UiEntity
          uiTransform={{
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Label
            value={'Profession Details'}
            fontSize={FONT_SIZE * 1.5}
            uiTransform={{ margin: { bottom: FONT_SIZE * 1.5 } }}
          />

          <UiEntity
            uiTransform={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              margin: { bottom: FONT_SIZE * 1 }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: selectedProfession.hasWearable
                ? getUvs(selectedProfession.owned)
                : getUvs(selectedProfession.unowned),
              texture: {
                src: professionsPageSprites.blankProfessionFrame.atlasSrc
              }
            }}
          />
          <Label
            value={'Wearable bonus ' + selectedProfession.bonus}
            fontSize={FONT_SIZE}
            uiTransform={{ margin: { bottom: FONT_SIZE * 1 } }}
          />
          <Label
            value={
              Object.keys(professions).find(
                (key) => professions[key].type === selectedProfession.type
              ) +
              ' Level ' +
              Player.getInstance()
                .levels.getLevel(selectedProfession.type)
                .toString()
            }
            fontSize={FONT_SIZE}
            uiTransform={{ margin: { bottom: FONT_SIZE * 1 } }}
          />
          <Label
            value={
              Object.keys(professions).find(
                (key) => professions[key].type === selectedProfession.type
              ) +
              ' XP ' +
              Player.getInstance()
                .levels.getXp(selectedProfession.type)
                .toString()
            }
            fontSize={FONT_SIZE}
          />
        </UiEntity>
      )}
    </UiEntity>
  )
}

export default ProfessionsPage
