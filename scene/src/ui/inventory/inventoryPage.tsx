// import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import {
  INVENTORY_CONFIG,
  type InventoryConfigItem
} from '../../inventory/playerInventoryMap'
import { getUvs } from '../../utils/ui-utils'
import { inventorySprites } from './inventoryData'
import { itemJson } from './itemData'

export type InventoryItemSlot = { itemId: string; count: number }

type InventoryPageProps = {
  inventorySlots: InventoryItemSlot[]
  physicalAttack: number
  magic: number
  physicalDefense: number
  luck: number
  criticalHitRate: number
  criticalHitDamage: number
  healthPoints: number
  maxHealthPoints: number
}

const IMMUTABLE_INV_SLOT_ARRAY = Array.from({ length: 28 })

function InventorySlotItem(
  item: InventoryItemSlot | undefined
): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  const config =
    item !== undefined && item.itemId in INVENTORY_CONFIG
      ? (INVENTORY_CONFIG as Record<string, InventoryConfigItem>)[item.itemId]
      : undefined

  const configSprite =
    config !== undefined ? (itemJson as any)[config.sprite] : undefined

  return (
    <UiEntity
      key={item?.itemId}
      uiTransform={{
        width: '25%',
        height: '14.28%'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(inventorySprites.commonItemFrame),
        texture: { src: inventorySprites.commonItemFrame.atlasSrc }
      }}
    >
      {configSprite !== undefined && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            alignItems: 'flex-end',
            padding: { left: '10%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(configSprite),
            texture: { src: configSprite.atlasSrc }
          }}
        >
          <Label
            value={item?.count.toString() ?? ''}
            fontSize={canvasInfo.height * 0.02}
          />
        </UiEntity>
      )}
    </UiEntity>
  )
}

function InventoryPage({
  inventorySlots,
  physicalAttack,
  magic,
  physicalDefense,
  luck,
  criticalHitRate,
  criticalHitDamage,
  healthPoints,
  maxHealthPoints
}: InventoryPageProps): ReactEcs.JSX.Element {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
  const fontSizeDetails = canvasInfo.height * 0.02
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'row'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(inventorySprites.inventoryPageFrame),
        texture: { src: inventorySprites.inventoryPageFrame.atlasSrc }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '23%',
          height: '100%'
        }}
        uiBackground={{
          color: { r: 0, g: 1, b: 0, a: 0.02 }
        }}
      ></UiEntity>
      <UiEntity
        uiTransform={{
          width: '9.5%',
          height: '100%'
        }}
        uiBackground={{
          color: { r: 1, g: 1, b: 0, a: 0.02 }
        }}
      ></UiEntity>
      <UiEntity
        uiTransform={{
          width: '23%',
          height: '100%'
        }}
        uiBackground={{
          color: { r: 1, g: 0, b: 1, a: 0.02 }
        }}
      ></UiEntity>

      <UiEntity
        uiTransform={{
          width: '16.5%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        <UiEntity
          uiTransform={{
            margin: { top: '10%' },
            height: '66%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Phys. Attack"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={physicalAttack.toFixed(0)}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Magic"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={magic.toFixed(0)}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Phys. Defense"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={`${physicalDefense.toFixed(0)}%`}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Luck"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={`${luck.toFixed(0)}%`}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Crit. Hit Rate"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={`${criticalHitRate.toFixed(0)}%`}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Crit. Hit Damage"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value={`${criticalHitDamage.toFixed(0)}%`}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />

          <Label
            uiTransform={{ height: fontSizeDetails * 1.5 }}
            value="Health"
            fontSize={fontSizeDetails}
          />
          <Label
            uiTransform={{
              height: fontSizeDetails * 1.5,
              margin: { bottom: '12%' }
            }}
            value={`${healthPoints.toFixed(0)}/${maxHealthPoints.toFixed(0)}`}
            color={Color4.Green()}
            fontSize={fontSizeDetails}
          />
        </UiEntity>

        <UiEntity
          uiTransform={{
            width: '100%',
            height: '6%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(inventorySprites.weaponsFilterButton),
            texture: { src: inventorySprites.weaponsFilterButton.atlasSrc }
          }}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '6%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(inventorySprites.armorFilter),
            texture: { src: inventorySprites.armorFilter.atlasSrc }
          }}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '6%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(inventorySprites.resourcesFilterButton),
            texture: { src: inventorySprites.resourcesFilterButton.atlasSrc }
          }}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '6%',
            margin: { bottom: '12%' }
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: getUvs(inventorySprites.professionFilterButton),
            texture: { src: inventorySprites.professionFilterButton.atlasSrc }
          }}
        />
      </UiEntity>

      {/* Inventory */}
      <UiEntity
        uiTransform={{
          width: '28%',
          height: '100%',
          alignItems: 'flex-end'
        }}
      >
        <UiEntity
          uiTransform={{
            width: '76%',
            height: '76%',
            margin: { bottom: '16%', left: '8%' },
            flexWrap: 'wrap'
          }}
        >
          {IMMUTABLE_INV_SLOT_ARRAY.map((value, index) =>
            InventorySlotItem(
              inventorySlots.length > index ? inventorySlots[index] : undefined
            )
          )}
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default InventoryPage
