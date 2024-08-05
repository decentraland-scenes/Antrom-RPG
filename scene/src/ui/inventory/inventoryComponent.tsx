import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs, type Sprite } from '../../utils/ui-utils'
import Canvas from '../canvas/Canvas'
import { inventorySprites } from './inventoryData'
import { mainHudSprites } from '../main-hud/mainHudData'

type InventoryProps = {
  inventory: (() => ReactEcs.JSX.Element) | undefined
  companions: (() => ReactEcs.JSX.Element) | undefined
  skills: (() => ReactEcs.JSX.Element) | undefined
  professions: (() => ReactEcs.JSX.Element) | undefined
  scrollRight: () => void
  scrollLeft: () => void
  leftSprite: Sprite
  rightSprite: Sprite
  updateTab: (arg: number) => void
  showInventory: (arg: boolean) => void
  visibility: boolean
}

function Inventory({
  inventory,
  companions,
  skills,
  professions,
  scrollRight,
  scrollLeft,
  leftSprite,
  rightSprite,
  updateTab,
  showInventory,
  visibility
}: InventoryProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  if (!visibility) return null


  return (
    <Canvas>
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
                inventory !== undefined
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
                companions !== undefined
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
                skills !== undefined
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
                professions !== undefined
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
        <UiEntity
            uiTransform={{
              width: canvasInfo.height * 0.05,
              height: canvasInfo.height * 0.05,
              positionType: 'absolute',
              position: { top: '40%', right: '-13%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: getUvs(mainHudSprites.exitButton),
              texture: {
                src: mainHudSprites.exitButton.atlasSrc
              }
            }}
            onMouseDown={() => {
              showInventory(false)
            }}
          />
        </UiEntity>

        {inventory !== undefined && (
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * 0.8,
              height: canvasInfo.width * 0.8 * 0.51
            }}
          >
            {inventory()}
          </UiEntity>
        )}
        {companions !== undefined && (
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * 0.8,
              height: canvasInfo.width * 0.8 * 0.51
            }}
          >
            {companions()}
          </UiEntity>
        )}
        {skills !== undefined && (
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * 0.8,
              height: canvasInfo.width * 0.8 * 0.51
            }}
          >
            {skills()}
          </UiEntity>
        )}
        {professions !== undefined && (
          <UiEntity
            uiTransform={{
              width: canvasInfo.width * 0.8,
              height: canvasInfo.width * 0.8 * 0.51
            }}
          >
            {professions()}
          </UiEntity>
        )}
      </UiEntity>
    </Canvas>
  )
}

export default Inventory
