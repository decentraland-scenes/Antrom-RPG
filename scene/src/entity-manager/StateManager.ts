// src/StateManager.ts
import EntityManager from './EntityManager'
import { networking } from './networking' // Import your networking module

export function updateEntityState(id: number, state: any) {
  const entityManager = EntityManager.getInstance()
  const entity = entityManager.getEntities().get(id)

  if (entity) {
    // Update entity state
  }

  // Notify other players of the state change
  syncEntityState(id, state)
}

function syncEntityState(id: number, state: any) {
  // Replace with actual networking code
  networking.send('updateEntityState', { id, state })
}

networking.on('updateEntityState', (data: { id: number; state: any }) => {
  updateEntityState(data.id, data.state)
})
