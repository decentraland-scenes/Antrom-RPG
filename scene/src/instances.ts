export let currentActiveScene = 'Antrom'

export const setCurrentActiveScene = (sceneName: string) => {
  currentActiveScene = sceneName
  // atlasAnalytics.updateBranchName(sceneName)
}

// export const craftItem = (id: number) => {
//     const itemMeta = ItemTree[id]
//     //@ts-ignore
//     const hasItem = player.items.find((item) => item.id === id)
//     const hasNeeds = itemMeta?.needs
//         ? itemMeta.needs?.reduce((accm, itemID) => {
//               //@ts-ignore
//               const hasItem = player.items?.find((item) => item.id === itemID)
//               return accm && !!hasItem
//           }, true)
//         : true
//     log(itemMeta)
//     if (!hasNeeds && !hasItem) {
//         ui.displayAnnouncement(`You are missing some items`)
//     }
//     if (hasItem) {
//         ui.displayAnnouncement(`This item is already in your inventory`)
//     }
//     if (itemMeta && !hasItem && hasNeeds) {
//         const chickenCount = player.inventory.getItemCount(ITEM_TYPES.CHICKEN)
//         const rockCount = player.inventory.getItemCount(ITEM_TYPES.ROCK)
//         const treeCount = player.inventory.getItemCount(ITEM_TYPES.TREE)
//         const boneCount = player.inventory.getItemCount(ITEM_TYPES.BONE)
//         if (
//             itemMeta.craftingMaterials.chicken <= chickenCount &&
//             itemMeta.craftingMaterials.wood <= treeCount &&
//             itemMeta.craftingMaterials.rock <= rockCount &&
//             itemMeta.craftingMaterials.bone <= boneCount
//         ) {
//             const item = new Item(
//                 id,
//                 itemMeta.name,
//                 itemMeta.type,
//                 itemMeta.buff,
//                 itemMeta.image
//             )
//             player.addItem(item)
//             ui.displayAnnouncement(`Crafted Item: ${itemMeta.name}`)
//             log(itemMeta.craftingMaterials.tree)
//             player.inventory.reduceItem(
//                 ITEM_TYPES.CHICKEN,
//                 itemMeta.craftingMaterials.chicken
//             )
//             player.inventory.reduceItem(
//                 ITEM_TYPES.ROCK,
//                 itemMeta.craftingMaterials.rock
//             )
//             player.inventory.reduceItem(
//                 ITEM_TYPES.TREE,
//                 itemMeta.craftingMaterials.wood
//             )
//             if (itemMeta.craftingMaterials.bone) {
//                 player.inventory.reduceItem(
//                     ITEM_TYPES.BONE,
//                     itemMeta.craftingMaterials.bone
//                 )
//             }
//             player.writeDataToServer()
//             if (tutorialChecker.isTutorialActive) {
//                 tutorialDialogWindow.openDialogWindow(guideWitchDialog, 8)
//             }
//         } else {
//             ui.displayAnnouncement(`You dont have enough!`)
//         }
//     }
// }
