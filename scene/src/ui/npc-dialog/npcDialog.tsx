import type { Dialog } from './dialogsData'
import {
  DIALOG_HEIGHT_FACTOR,
  DIALOG_WIDTH_FACTOR,
  npcDialogsSprites
} from './dialogsData'

import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../utils/utils'
import { AnswerButton } from './answerButton'

type NpcDialogProps = {
  isVisible: boolean
  dialogIndex: number
  assignedDialogs: Dialog[]
  nextMessage: () => void
  goToDialog: (dialog: string) => void
}

function npcDialog({
  isVisible,
  dialogIndex,
  assignedDialogs,
  nextMessage,
  goToDialog
}: NpcDialogProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        padding: { bottom: canvasInfo.height * 0.025 },
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * DIALOG_WIDTH_FACTOR,
          height: canvasInfo.width * DIALOG_HEIGHT_FACTOR,
          flexDirection: 'column',
          alignItems: 'center'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(npcDialogsSprites.background),
          texture: { src: npcDialogsSprites.background.atlasSrc }
        }}
        onMouseDown={nextMessage}
      >
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: '80%',
            height: '70%',
            margin: { left: '10%' }
          }}
          uiText={{
            value: assignedDialogs[dialogIndex].text,
            textAlign: 'middle-left',
            fontSize: 14
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: '80%',
            height: '40%',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: {
              bottom: canvasInfo.width * DIALOG_HEIGHT_FACTOR * 0.05
            }
          }}
        >
          {assignedDialogs[dialogIndex].buttons.map((answer, index) => (
            <UiEntity key={index}>
              <AnswerButton answer={answer} goToDialog={goToDialog} />
            </UiEntity>
          ))}
        </UiEntity>
        <UiEntity
          uiTransform={{
            position: {
              left: canvasInfo.width * DIALOG_WIDTH_FACTOR * -0.04,
              top: canvasInfo.width * DIALOG_WIDTH_FACTOR * -0.04
            },
            positionType: 'absolute',
            width: canvasInfo.width * DIALOG_HEIGHT_FACTOR * 0.5,
            height: canvasInfo.width * DIALOG_HEIGHT_FACTOR * 0.5
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: assignedDialogs[dialogIndex].portraitSource }
          }}
        />
        <UiEntity
          uiTransform={{
            position: {
              right: canvasInfo.width * DIALOG_WIDTH_FACTOR * 0.02,
              bottom: canvasInfo.width * DIALOG_WIDTH_FACTOR * 0.02
            },
            positionType: 'absolute',
            width: canvasInfo.width * DIALOG_HEIGHT_FACTOR * 0.25,
            height: canvasInfo.width * DIALOG_HEIGHT_FACTOR * 0.25
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(npcDialogsSprites.click_on_bg_icon),
            texture: { src: npcDialogsSprites.click_on_bg_icon.atlasSrc }
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

export default npcDialog
