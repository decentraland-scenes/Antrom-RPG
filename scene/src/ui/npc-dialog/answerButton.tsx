import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../../utils/ui-utils'
import {
  type DialogButton,
  npcDialogsSprites,
  BUTTON_HEIGHT_FACTOR,
  BUTTON_WIDTH_FACTOR
} from './dialogsData'

type AnswerButtonType = {
  answer: DialogButton
  goToDialog: (arg: string) => void
}

export function AnswerButton({
  answer,
  goToDialog
}: AnswerButtonType): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

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
