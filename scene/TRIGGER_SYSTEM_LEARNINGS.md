# Trigger System Learnings - Decentraland SDK7

## Problem Summary

We encountered persistent `[getFrom] Component core::Transform for entity #XXX not found` errors when trying to restart the game after the Gargoyle Fountain (tower) was destroyed. These errors were coming from the `@dcl-sdk/utils` trigger system trying to access entities that had been removed from the ECS engine.

## Root Cause Analysis

### The Core Issue

The `@dcl-sdk/utils` trigger system maintains internal references to entities with triggers attached. When these entities are removed from the ECS engine (via `engine.removeEntity()` or `entityController.removeEntity()`), the trigger system still tries to access them during its update cycle, causing errors.

### Error Chain

```
1. Entity with triggers is removed from ECS
2. Trigger system still has internal references to that entity
3. Trigger system's updateCollisions() runs every frame
4. updateCollisions() calls getWorldPosition() on removed entity
5. getWorldPosition() calls Transform.get() on removed entity
6. Transform.get() throws "[getFrom] Component core::Transform for entity #XXX not found"
```

### Specific Culprits Found

1. **GargoyleFountain.ts**: Removed itself with `engine.removeEntity(this.entity)` after death
2. **monsterMobAuto.ts**: Removed trigger entities with `entityController.removeEntity()` when monsters died
3. **player.tsx**: Removed deployed units with `engine.removeEntity()` during restart

## Failed Solutions (What Didn't Work)

### 1. Error Suppression Approaches

- **Console.error override**: Didn't work because errors came from browser's internal console system
- **Window.onerror override**: Didn't work because `window` is not available in Decentraland environment
- **Transform.get override**: Didn't work because the error happens deep inside the library

### 2. Entity Management Approaches

- **Aggressive entity removal**: Made the problem worse by removing more entities
- **Trigger system disable**: Couldn't access the trigger system's internal state
- **Sequential restart with delays**: Didn't address the fundamental race condition

### 3. Complex Cleanup Approaches

- **Multiple step restart process**: Added complexity without solving the core issue
- **Entity lifecycle management**: Required extensive changes to the entire codebase

## The Working Solution

### Key Insight

Instead of trying to fix the trigger system or manage entity lifecycles, we **avoided entity removal entirely** during restart.

### Solution Components

#### 1. **Keep Entities in ECS**

- Don't remove entities that have triggers attached
- Move them far away instead: `position = Vector3.create(1000, 1000, 1000)`
- Make them invisible: `VisibilityComponent.getMutable(entity).visible = false`

#### 2. **Reset Game State in Place**

```typescript
// Instead of removing entities, reset their state
private performSimpleReset(): void {
  // Reset game over state
  this.isGameOver = false

  // Reset player position and health
  player.refillHealthBar(1, false)
  setPlayerPosition(-22.21, 5.43, -26.53)

  // Reset gargoyle fountain health
  gargoyleFountain.health = gargoyleFountain.maxHealth
  gargoyleFountain.isDead = false

  // Move executioners far away (don't remove them)
  this.clearExecutioners()

  // Start fresh game
  playButtonManager.startGame()
}
```

#### 3. **Entity Clearing Strategy**

```typescript
private clearExecutioners(): void {
  for (const executioner of executioners) {
    // Move far away instead of removing
    Transform.getMutable(executioner.entity).position = Vector3.create(1000, 1000, 1000)

    // Make invisible
    VisibilityComponent.getMutable(executioner.entity).visible = false
  }

  // Clear array for new spawns
  executioners.length = 0
}
```

## Performance Considerations

### ⚠️ **Current Issue: Entities Still Exist**

Yes, the entities still exist in the ECS engine, which could cause performance issues:

1. **Memory Usage**: Entities continue to consume memory
2. **System Updates**: ECS systems still process these entities
3. **Trigger System**: Trigger system still updates these entities
4. **Scaling Problems**: With many restarts, entity count could grow significantly

### **Better Solutions for Production**

#### Option 1: **Delayed Entity Removal**

```typescript
// Remove entities after a delay when trigger system has forgotten them
private safeRemoveEntity(entity: Entity, delay: number = 5000): void {
  utils.timers.setTimeout(() => {
    try {
      engine.removeEntity(entity)
    } catch (error) {
      console.log('Entity already removed or has triggers:', error)
    }
  }, delay)
}
```

#### Option 2: **Entity Pooling**

```typescript
// Reuse entities instead of creating/removing them
class EntityPool {
  private pool: Entity[] = []

  getEntity(): Entity {
    return this.pool.pop() || entityController.addEntity()
  }

  returnEntity(entity: Entity): void {
    // Reset entity state and return to pool
    Transform.getMutable(entity).position = Vector3.Zero()
    this.pool.push(entity)
  }
}
```

#### Option 3: **Trigger System Cleanup**

```typescript
// Manually remove triggers before removing entities
private safeRemoveEntityWithTriggers(entity: Entity): void {
  // Remove triggers first (if possible)
  try {
    // This would require access to trigger system internals
    // utils.triggers.removeTrigger(entity) // If such function existed
  } catch (error) {
    console.log('Could not remove triggers:', error)
  }

  // Then remove entity
  engine.removeEntity(entity)
}
```

#### Option 4: **Component-Based State Management**

```typescript
// Use components to mark entities as inactive instead of removing them
@Component('Inactive')
export class InactiveComponent {}

// Systems check for InactiveComponent and skip processing
engine.addSystem(() => {
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    if (engine.hasComponent(entity, InactiveComponent)) {
      continue // Skip inactive entities
    }
    // Process active entities
  }
})
```

## Key Learnings

### 1. **Trigger System Behavior**

- The `@dcl-sdk/utils` trigger system is a black box
- It maintains internal state that we can't directly access or modify
- It expects all entities with triggers to exist throughout their lifecycle
- Removing entities with triggers causes persistent errors

### 2. **Entity Lifecycle Management**

- **Don't remove entities** that have triggers attached
- **Move them away** instead of removing them
- **Keep them in ECS** to satisfy trigger system expectations
- **Reset state** rather than recreating entities

### 3. **Error Handling Strategy**

- **Prevention is better than suppression**: Fix the root cause instead of hiding errors
- **Simple solutions work better**: Avoid complex entity management systems
- **Work with the system**: Don't fight the trigger system, work around its limitations

### 4. **Decentraland SDK7 Specifics**

- `window` object is not available in Decentraland environment
- Console overrides don't work for internal library errors
- Entity removal should be avoided when triggers are involved
- State reset is more reliable than entity recreation

### 5. **Performance Considerations**

- **Entities still exist** in ECS even when moved away
- **Memory usage** continues to grow with each restart
- **System updates** still process moved entities
- **Consider entity pooling** for better performance
- **Monitor entity count** during development

## Best Practices for Future Development

### 1. **When Working with Triggers**

- Always keep entities with triggers in the ECS
- Move entities away instead of removing them
- Reset entity state rather than recreating entities
- Be aware of trigger system's internal state management

### 2. **For Game Restart Systems**

- Implement state reset rather than entity removal
- Move problematic entities far away
- Reset health, position, and state in place
- Avoid complex cleanup procedures

### 3. **Error Prevention**

- Test entity removal thoroughly when triggers are involved
- Monitor for trigger system errors during development
- Implement defensive programming around entity lifecycle
- Use simple, reliable solutions over complex ones

### 4. **Performance Optimization**

- Monitor entity count during development
- Consider entity pooling for frequently created/destroyed entities
- Implement component-based state management
- Use delayed entity removal when possible

## Code Patterns to Follow

### ✅ Good Pattern (Current Solution)

```typescript
// Move entity away instead of removing
Transform.getMutable(entity).position = Vector3.create(1000, 1000, 1000)
VisibilityComponent.getMutable(entity).visible = false

// Reset state in place
entity.health = entity.maxHealth
entity.isDead = false
```

### ✅ Better Pattern (For Production)

```typescript
// Use component-based state management
@Component('Inactive')
export class InactiveComponent {}

// Mark entity as inactive instead of removing
engine.addComponent(entity, InactiveComponent)

// Systems skip inactive entities
if (engine.hasComponent(entity, InactiveComponent)) {
  continue
}
```

### ❌ Bad Pattern

```typescript
// Don't remove entities with triggers
engine.removeEntity(entity)
entityController.removeEntity(entity)
```

## Conclusion

The key learning is that the `@dcl-sdk/utils` trigger system has strict expectations about entity lifecycle. By working within these constraints (keeping entities in ECS) rather than fighting them (removing entities), we achieved a reliable restart system without trigger system errors.

**The solution was simple**: Don't remove entities, just move them away and reset their state.

**For production**: Consider implementing entity pooling or component-based state management to avoid performance issues from accumulated entities.
