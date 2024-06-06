import { Color4 } from '@dcl/sdk/math'
import type { Dialog, DialogButton } from './dialogsData'
import { npcDialogsSprites } from './dialogsData'

import ReactEcs, {
  Button,
  UiEntity
} from '@dcl/sdk/react-ecs'
import { canvasInfo, getUvs } from '../utils/utils'



const DIALOG_ASPECT_RATIO = 0.3

const DIALOG_WIDTH_FACTOR = 0.4
const DIALOG_HEIGHT_FACTOR = DIALOG_WIDTH_FACTOR * DIALOG_ASPECT_RATIO

const BUTTON_ASPECT_RATIO = 0.26
const BUTTON_WIDTH_FACTOR = DIALOG_WIDTH_FACTOR * 0.2
const BUTTON_HEIGHT_FACTOR = BUTTON_WIDTH_FACTOR * BUTTON_ASPECT_RATIO

type NpcDialogProps = {
  isVisible: boolean 
  dialogIndex: number
  assignedDialogs: Dialog[]
  nextMessage: () => void
  goToDialog: (dialog:string) => void
}

type AnswerButton={
  answer: DialogButton
}


function npcDialog({isVisible, dialogIndex, assignedDialogs, nextMessage, goToDialog}: NpcDialogProps): ReactEcs.JSX.Element{
  function AnswerButton({answer}:AnswerButton): ReactEcs.JSX.Element {
    return (
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * BUTTON_WIDTH_FACTOR,
            height: canvasInfo.width * BUTTON_HEIGHT_FACTOR
          }}
        >
          <Button
            value={answer.label}
            disabled={answer.disabled ?? false}
            variant="secondary"
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
            color={answer.disabled === true ? Color4.Gray() : Color4.White()}
            uiBackground={{
              textureMode: 'stretch',
              uvs:
                answer.disabled === true
                  ? getUvs(npcDialogsSprites.available_button)
                  : getUvs(npcDialogsSprites.unavailable_button),
              texture: { src: npcDialogsSprites.available_button.atlasSrc }
            }}
            onMouseDown={() => {
              goToDialog(answer.goToDialog)
            }}
          />
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * BUTTON_HEIGHT_FACTOR * 0.7,
              height: canvasInfo.width * BUTTON_HEIGHT_FACTOR * 0.7,
              display: answer.action !== undefined ? 'flex' : 'none',
              positionType: 'absolute',
              position: {
                top: canvasInfo.width * BUTTON_HEIGHT_FACTOR * 0.15,
                left: canvasInfo.width * BUTTON_HEIGHT_FACTOR * 0.175
              }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs:
                answer.action === 'primary'
                  ? getUvs(npcDialogsSprites.e_icon_avaialable)
                  : getUvs(npcDialogsSprites.f_icon_avaialable),
              texture: { src: npcDialogsSprites.e_icon_avaialable.atlasSrc }
            }}
          />
        </UiEntity>
      )
    }


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
        {assignedDialogs[dialogIndex].buttons.map((button, index) => (
          <UiEntity key={index}>
            <AnswerButton answer={button}/>
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