import EntityManager from './EntityManager'
import { networking } from './networking' // Import your networking module

// Define a type for the data expected from the network
interface SyncEntityData {
  id: number
}

export function createExecutioner(id: number) {
  const entityManager = EntityManager.getInstance()
  const entity = entityManager.createOrGetEntity(id)

  if (!entity) {
    console.error(`Failed to create or retrieve entity with ID: ${id}`)
    return
  }

  // Initialize or update the entity as needed
}

export function syncEntity(id: number) {
  // Replace with actual networking code
  networking.send('syncEntity', { id })
}

// Register the callback for the event without checking return value
networking.on('syncEntity', (data: SyncEntityData) => {
  createExecutioner(data.id)
})
