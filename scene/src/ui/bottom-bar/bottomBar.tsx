import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from '../utils/utils'
import {
  HEIGTH_FACTOR,
  HP_BACKGROUND_FACTOR,
  HP_FRAME_ASPECT_RATIO,
  HP_W_FRAME_FACTOR,
  WIDTH_FACTOR,
  XP_BACKGROUND_ASPECT_RATIO,
  XP_BACKGROUND_FACTOR,
  XP_FRAME_ASPECT_RATIO,
  XP_W_FRAME_FACTOR,
  bottomBarSprites
} from './bottomBarData'

type BottomBarProps = {
  isVisible: boolean

}

function BottomBar({
  isVisible,
}: BottomBarProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null


  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        display: isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR,
          height: canvasInfo.width * HEIGTH_FACTOR,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent:'center',
        margin:{bottom:canvasInfo.height*0.01}
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.background),
          texture: { src: bottomBarSprites.background.atlasSrc }
        }}
      > 
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * XP_BACKGROUND_FACTOR,
          height: canvasInfo.width * WIDTH_FACTOR * XP_BACKGROUND_FACTOR * XP_BACKGROUND_ASPECT_RATIO,
          positionType: 'absolute',
          alignItems: 'flex-start',
          position:{bottom: -canvasInfo.width * HEIGTH_FACTOR * 0.005},

        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.xpBackground),
          texture: { src: bottomBarSprites.xpBackground.atlasSrc }
        }}
      />   
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * XP_W_FRAME_FACTOR,
          height: canvasInfo.width * WIDTH_FACTOR * XP_W_FRAME_FACTOR * XP_FRAME_ASPECT_RATIO,
          positionType: 'absolute',
          position:{bottom: -canvasInfo.width * HEIGTH_FACTOR * 0.005},
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.xpFrame),
          texture: { src: bottomBarSprites.xpFrame.atlasSrc }
        }}
      />  
        <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * HP_BACKGROUND_FACTOR,
          height: canvasInfo.width * WIDTH_FACTOR * HP_BACKGROUND_FACTOR,
          positionType: 'absolute',
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.hpBackground),
          texture: { src: bottomBarSprites.hpBackground.atlasSrc }
        }}
      />   
      <UiEntity
        uiTransform={{
          width: canvasInfo.width * WIDTH_FACTOR * HP_W_FRAME_FACTOR,
          height: canvasInfo.width * WIDTH_FACTOR * HP_W_FRAME_FACTOR * HP_FRAME_ASPECT_RATIO,
          positionType: 'absolute',
          position:{top: -canvasInfo.width * HEIGTH_FACTOR * 0.28},
          alignItems: 'flex-start'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(bottomBarSprites.hpFrame),
          texture: { src: bottomBarSprites.hpFrame.atlasSrc }
        }}
      /> 
                       

      </UiEntity>
    </UiEntity>
  )
}

export default BottomBar
