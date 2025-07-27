import * as utils from '@dcl-sdk/utils'
import { SimpleNotification } from './simpleNotificationWindow'

export class SimpleNotificationManager {
  private notifications: SimpleNotification[] = []
  private maxNotifications: number = 3
  private cleanupTimerId: utils.TimerId | undefined = undefined

  constructor(maxNotifications: number = 3) {
    this.maxNotifications = maxNotifications
    this.startCleanupTimer()
  }

  /**
   * Add a simple text notification
   */
  addNotification(text: string, duration: number = 3000): string {
    const id = this.generateId()
    const notification: SimpleNotification = {
      id,
      text,
      timestamp: Date.now(),
      duration
    }

    this.notifications.push(notification)

    // Remove oldest notifications if we exceed max
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.maxNotifications)
    }

    return id
  }

  /**
   * Remove a specific notification by ID
   */
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id)
  }

  /**
   * Get all current notifications
   */
  getNotifications(): SimpleNotification[] {
    return [...this.notifications]
  }

  /**
   * Get notifications that haven't expired yet
   */
  getActiveNotifications(): SimpleNotification[] {
    const now = Date.now()
    return this.notifications.filter((n) => now - n.timestamp < n.duration)
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimerId = utils.timers.setInterval(() => {
      this.cleanupExpiredNotifications()
    }, 1000) // Check every second
  }

  /**
   * Remove expired notifications
   */
  private cleanupExpiredNotifications(): void {
    const now = Date.now()
    this.notifications = this.notifications.filter(
      (n) => now - n.timestamp < n.duration
    )
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`
  }

  /**
   * Cleanup when destroying the manager
   */
  destroy(): void {
    if (this.cleanupTimerId !== undefined) {
      utils.timers.clearInterval(this.cleanupTimerId)
    }
  }
}
