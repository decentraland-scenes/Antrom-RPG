import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type StageButtonType } from './questsData'

export function StageButton({
  stage,
  setStage
}: StageButtonType): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{ width: '100%', height: '100%' }}
      uiText={{ value: stage.title, textAlign: 'middle-left', fontSize: 18 }}
      onMouseDown={() => {
        setStage(stage.id)
      }}
    />
  )
}
