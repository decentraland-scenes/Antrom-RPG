// src/PlayerManager.ts
import { networking } from './networking' // Import your networking module
import { createExecutioner } from './ExecutionerManager'
import EntityManager from './EntityManager'

export function onPlayerJoin(playerId: string) {
  const entityManager = EntityManager.getInstance()
  const maxEntities = EntityManager.getMaxEntities()

  for (let id = 1; id <= maxEntities; id++) {
    createExecutioner(id)
  }
}

networking.on('playerJoin', (playerId) => onPlayerJoin(playerId))
