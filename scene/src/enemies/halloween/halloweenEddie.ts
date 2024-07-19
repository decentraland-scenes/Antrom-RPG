import { Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Player } from '../../player/player'
import { getRandomInt } from '../../utils/getRandomInt'
import MonsterOligar from '../monster'

const POSITIONS = [
  Vector3.create(4.6, 0.49, 2.46),
  Vector3.create(28.81, 0.49, -14.8),
  Vector3.create(6.52, 3.57, 43.26),
  Vector3.create(19.25, 3.52, -13.19),
  Vector3.create(25.69, 3.48, -9.83),
  Vector3.create(27.36, 3.52, 0.79),
  Vector3.create(14.25, 3.48, 2.96),
  Vector3.create(5.29, 3.48, 1.34),
  Vector3.create(-8.6, 2.45, -29.49),
  Vector3.create(-9.98, 2.59, -43.28),
  Vector3.create(37.91, 2.52, 36.32),
  Vector3.create(24.46, 2.58, 44.96)
]

// CHECK TYPE HEALER
export default class HalloweenEddie extends MonsterOligar {
  shapeFile = 'assets/models/EddyLP.glb'
  hoverText = 'Attack Eddie!'

  constructor() {
    const player = Player.getInstance()
    super(player.attack + 10, 240, player.level + 10, player.maxHealth * 5)
    this.initMonster()
  }

  onDropLoot(): void {
    // TODO twitter
    // const getTweetText = (text: string): string => {
    //     return text.split(" ").join("%20")
    // }
    // const instructions = new ui.CustomPrompt(
    //     ui.PromptStyles.DARK,
    //     350,
    //     150,
    //     true
    // )
    // instructions.addText(
    //     "Tweet your achievement!",
    //     0,
    //     50,
    //     Color4.Green(),
    //     20
    // )
    // instructions.addButton("Tweet", 0, -20, () =>
    //     openExternalURL(
    //         `https://twitter.com/intent/tweet?text=${getTweetText(
    //             `${encodeURIComponent(
    //                 "💪"
    //             )} I've defeated the evil that plagues MONTRA and earned my Dice Masters Halloween Mask! Earn yours here: https://play.decentraland.org/?position=148%2C-8 %0A%0A`
    //         )}&hashtags=decentraland,DCL,P2E`
    //     )
    // ),
    //     ui.ButtonStyles.ROUNDGOLD
    // instructions.show()
    // async function checkHalloweenMask() {
    //     const userData = await getUserData()
    //     // TODO: update the address from Polygon of the NFT you want checke
    //     // If you want to check for multiple hit me up and I can help you modify this for that
    //     let wearableOwned = false
    //     try {
    //         const provider = "wss://rpc-mainnet.matic.quiknode.pro"
    //         const providerInstance = new eth.WebSocketProvider(provider)
    //         const requestManager = new eth.RequestManager(providerInstance)
    //         const c = await new eth.ContractFactory(
    //             requestManager,
    //             ERC721
    //         ).at("0xf3df68b5748f1955f68b4fefda3f65b2e0250325")
    //         let bal = await (c as any).balanceOf(userData?.publicKey)
    //         if (bal > 0) wearableOwned = true
    //     } catch {
    //         wearableOwned = false
    //     }
    //     if (wearableOwned) {
    //         ui.displayAnnouncement("You already collected this wearable!")
    //     } else {
    //         ui.displayAnnouncement("AHHHH")
    //         // sendWearable("0xf3df68b5748f1955f68b4fefda3f65b2e0250325:0", {
    //         //     chicken: 0,
    //         //     wood: 0,
    //         //     iron: 0,
    //         //     bone: 0,
    //         // })
    //     }
    // }
    // checkHalloweenMask()
    // player.inventory.incrementItem(ITEM_TYPES.COIN, 50000)
    // player.inventory.incrementItem(ITEM_TYPES.BONE, 200)
    // player.inventory.incrementItem(ITEM_TYPES.CHICKEN, 400)
    // player.writeDataToServer()
    // console.log("on drop here")
  }

  create(): void {}

  setupAttackTriggerBox(): void {
    super.setupAttackTriggerBox()
    // TODO setup billboard?
  }

  loadTransformation(): void {
    const initialPosition = POSITIONS[getRandomInt(POSITIONS.length)]
    const initialRotation = Quaternion.fromEulerDegrees(
      0,
      getRandomInt(10) / 10 + getRandomInt(4),
      0
    )
    Transform.createOrReplace(this.entity, {
      position: initialPosition,
      rotation: initialRotation,
      scale: Vector3.create(1.5, 1.5, 1.5)
    })
  }
}
