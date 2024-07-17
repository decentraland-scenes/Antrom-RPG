import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import Canvas from '../canvas/Canvas'
import { inventorySprites } from './inventoryData'

type InventoryProps = {
  isVisible: boolean
  isInventory: boolean
  isCompanions: boolean
  isSkills: boolean
  isProfessions: boolean
  scrollRight: () => void
  scrollLeft: () => void
  leftSprite: Sprite
  rightSprite: Sprite
  updateTab: (arg: number) => void
}

function Inventory({
  isVisible,
  isInventory,
  isCompanions,
  isSkills,
  isProfessions,
  scrollRight,
  scrollLeft,
  leftSprite,
  rightSprite,
  updateTab
}: InventoryProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <Canvas>
      {isVisible && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              height: canvasInfo.width * 0.035,
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(leftSprite),

                texture: { src: leftSprite.atlasSrc }
              }}
              onMouseDown={scrollLeft}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03 * 4.71,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(
                  isInventory
                    ? inventorySprites.inventoryButtonSelected
                    : inventorySprites.inventoryButton
                ),

                texture: { src: leftSprite.atlasSrc }
              }}
              onMouseDown={() => {
                updateTab(0)
              }}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03 * 4.71,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(
                  isCompanions
                    ? inventorySprites.companionsButtonSelected
                    : inventorySprites.companionsButton
                ),

                texture: { src: leftSprite.atlasSrc }
              }}
              onMouseDown={() => {
                updateTab(1)
              }}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03 * 4.71,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(
                  isSkills
                    ? inventorySprites.skillsButtonSelected
                    : inventorySprites.skillsButton
                ),

                texture: { src: leftSprite.atlasSrc }
              }}
              onMouseDown={() => {
                updateTab(2)
              }}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03 * 4.71,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(
                  isProfessions
                    ? inventorySprites.professionsButtonSelected
                    : inventorySprites.professionsButton
                ),

                texture: { src: leftSprite.atlasSrc }
              }}
              onMouseDown={() => {
                updateTab(3)
              }}
            />

            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.03,
                height: canvasInfo.width * 0.03
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(rightSprite),
                texture: { src: rightSprite.atlasSrc }
              }}
              onMouseDown={scrollRight}
            />
            <UiEntity
              uiTransform={{
                width: canvasInfo.width * 0.035 * 17,
                height: canvasInfo.width * 0.035,
                positionType: 'absolute',
                position: { left: '2.4%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: getUvs(inventorySprites.topNavBarFrame),
                texture: { src: inventorySprites.topNavBarFrame.atlasSrc }
              }}
            />
          </UiEntity>

          {isInventory && (
            <UiEntity uiText={{ value: 'Inventory', fontSize: 50 }}></UiEntity>
          )}
          {isCompanions && (
            <UiEntity uiText={{ value: 'Companions', fontSize: 50 }}></UiEntity>
          )}
          {isSkills && (
            <UiEntity uiText={{ value: 'Skills', fontSize: 50 }}></UiEntity>
          )}
          {isProfessions && (
            <UiEntity
              uiText={{ value: 'Professions', fontSize: 50 }}
            ></UiEntity>
          )}
        </UiEntity>
      )}
    </Canvas>
  )
}

export default Inventory
