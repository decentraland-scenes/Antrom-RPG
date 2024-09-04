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

  let pageWidth = canvasInfo.width * 0.8 < 1132 ? canvasInfo.width * 0.8 : 1132
  let pageHeight = pageWidth * 0.5

  if (pageHeight > canvasInfo.height * 0.7) {
    pageHeight = canvasInfo.height * 0.7
    pageWidth = 2 * pageHeight
  }

  return (
    <Canvas>
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: { top: -pageHeight * 0.1 }
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            height: pageWidth * 0.045,
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              width: pageWidth * 0.04,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.04 * 4.71,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.04 * 4.71,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.04 * 4.71,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.04 * 4.71,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.04,
              height: pageWidth * 0.04
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
              width: pageWidth * 0.79,
              height: pageWidth * 0.045,
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
              width: pageWidth * 0.04,
              height: pageWidth * 0.04,
              positionType: 'absolute',
              position: { top: '0%', right: '-15%' }
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
              width: pageWidth,
              height: pageHeight
            }}
          >
            {inventory()}
          </UiEntity>
        )}
        {companions !== undefined && (
          <UiEntity
            uiTransform={{
              width: pageWidth,
              height: pageHeight
            }}
          >
            {companions()}
          </UiEntity>
        )}
        {skills !== undefined && (
          <UiEntity
            uiTransform={{
              width: pageWidth,
              height: pageHeight
            }}
          >
            {skills()}
          </UiEntity>
        )}
        {professions !== undefined && (
          <UiEntity
            uiTransform={{
              width: pageWidth,
              height: pageHeight
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
