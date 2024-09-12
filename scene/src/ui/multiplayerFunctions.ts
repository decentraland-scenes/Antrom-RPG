
// export async function createRoom() {
//     const ws = setupWebSocket()

//     if (ws.readyState === WebSocket.OPEN) {
//         const playerData = await getUserData()
//         const playerRealm = await getCurrentRealm()
//         let currentClass: any

//         const playerClasses = {
//             cleric: "CLERIC",
//             mage: "MAGE",
//             thief: "THIEF",
//             ranger: "RANGER",
//             berserker: "BERSERKER",
//             default: "CLASS",
//         }

//         if (player.class === 0) {
//             currentClass = playerClasses.cleric
//         } else if (player.class === 1) {
//             currentClass = playerClasses.mage
//         } else if (player.class === 2) {
//             currentClass = playerClasses.thief
//         } else if (player.class === 3) {
//             currentClass = playerClasses.ranger
//         } else if (player.class === 4) {
//             currentClass = playerClasses.berserker
//         } else {
//             log("Player class not Found using default")
//             currentClass = playerClasses.default
//         }
//         log(`player class num: ${currentClass}`)

//         let playerLevel = player.levels.getLevel(LEVEL_TYPES.PLAYER)
//         const playerInstance = Player.getInstance()
//         let playerHp = playerInstance.health
//         let playerEther = player.inventory.getItemCount(ITEM_TYPES.GEM4)
//         ws.send(
//             JSON.stringify({
//                 type: "initRoom",
//                 userId: playerData.userId,
//                 playerName: playerData.displayName,
//                 realm: playerRealm.displayName,
//                 playerClass: currentClass,
//                 playerLevel: playerLevel,
//                 playerHp: playerHp,
//                 playerEther: playerEther,
//             })
//         )
//         log("Using realm: ", playerRealm.displayName)
//     } else {
//         ws.onopen = async () => {
//             const playerData = await getUserData()
//             const playerRealm = await getCurrentRealm()
//             let currentClass: any

//             const playerClasses = {
//                 cleric: "CLERIC",
//                 mage: "MAGE",
//                 thief: "THIEF",
//                 ranger: "RANGER",
//                 berserker: "BERSERKER",
//                 default: "CLASS",
//             }

//             if (player.class === 0) {
//                 currentClass = playerClasses.cleric
//             } else if (player.class === 1) {
//                 currentClass = playerClasses.mage
//             } else if (player.class === 2) {
//                 currentClass = playerClasses.thief
//             } else if (player.class === 3) {
//                 currentClass = playerClasses.ranger
//             } else if (player.class === 4) {
//                 currentClass = playerClasses.berserker
//             } else {
//                 log("Player class not Found using default")
//                 currentClass = playerClasses.default
//             }
//             log(`player class num: ${currentClass}`)

//             let playerLevel = player.levels.getLevel(LEVEL_TYPES.PLAYER)
//             const playerInstance = Player.getInstance()
//             let playerHp = playerInstance.health
//             let playerEther = player.inventory.getItemCount(ITEM_TYPES.GEM4)

//             ws.send(
//                 JSON.stringify({
//                     type: "initRoom",
//                     userId: playerData.userId,
//                     playerName: playerData.displayName,
//                     realm: playerRealm.displayName,
//                     playerClass: currentClass,
//                     playerLevel: playerLevel,
//                     playerHp: playerHp,
//                     playerEther: playerEther,
//                 })
//             )
//             log("Using realm: ", playerRealm.displayName)
//         }
//     }
// }
