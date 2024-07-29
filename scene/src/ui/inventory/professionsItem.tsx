// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { professionsPageSprites, type ProfessionType } from './professionsData'
import { getUvs } from '../../utils/ui-utils'

type ProfessionItemProps = {
  profession: ProfessionType
  selectedProfession: ProfessionType | undefined
  level: number
  selectProfession: (arg: ProfessionType) => void
}

function ProfessionItem({
  profession,
  selectedProfession,
  level,
  selectProfession
}: ProfessionItemProps): ReactEcs.JSX.Element {
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
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(profession.frame),
        texture: { src: profession.frame.atlasSrc }
      }}
      onMouseDown={() => {
        selectProfession(profession)
      }}
    >
      <UiEntity
        uiTransform={{
          width: '10%',
          height: '10%',
          positionType: 'absolute',
          position: { left: '26.5%', top: '4%' },
          display: level > 25 ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(professionsPageSprites.xp_gem_25),
          texture: { src: professionsPageSprites.xp_gem_25.atlasSrc }
        }}
      />
      <UiEntity
        uiTransform={{
          width: '10%',
          height: '10%',
          positionType: 'absolute',
          position: { left: '63.5%', top: '4%' },
          display: level > 50 ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(professionsPageSprites.xp_gem_50),
          texture: { src: professionsPageSprites.xp_gem_50.atlasSrc }
        }}
      />
      <UiEntity
        uiTransform={{
          width: '10%',
          height: '10%',
          positionType: 'absolute',
          position: { left: '45%', top: '3.5%' },
          display: level > 100 ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(professionsPageSprites.xp_gem_100),
          texture: { src: professionsPageSprites.xp_gem_100.atlasSrc }
        }}
      />
      {/*
          
          Check if the profession has a wearable, 
          if it has a wearable check if the
           character has a wearable      
      <UiEntity
      uiTransform={{
        width: '10%',
        height: '10%',
        positionType: 'absolute',
        position:{left:'45%', bottom:'13.5%'},
        display: 'flex'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(professionsPageSprites.wearableOwnedGem),
        texture: { src: professionsPageSprites.wearableOwnedGem.atlasSrc }
      }}
      /> */}
      <UiEntity
        uiTransform={{
          width: '50%',
          height: '30%',
          positionType: 'absolute',
          position: { left: '25%', bottom: '-15%' },
          display: profession === selectedProfession ? 'flex' : 'none'
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: getUvs(professionsPageSprites.selectionTool),
          texture: { src: professionsPageSprites.selectionTool.atlasSrc }
        }}
      />
    </UiEntity>
  )
}

export default ProfessionItem
