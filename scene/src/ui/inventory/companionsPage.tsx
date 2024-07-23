// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

type CompanionsPageProps = {
  prop: undefined
}

function CompanionsPage({ prop }: CompanionsPageProps): ReactEcs.JSX.Element {
  // const canvasInfo = UiCanvasInformation.get(engine.RootEntity)

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      // uiBackground={{
      //   textureMode: 'stretch',
      //   uvs: getUvs(skillsPageSprites.skillsPageFrame),
      //   texture: { src: skillsPageSprites.skillsPageFrame.atlasSrc }
      // }}
      uiText={{ value: 'Companions', fontSize: 50 }}
    ></UiEntity>
  )
}

export default CompanionsPage
