import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Utility functions for real-time subscriptions
 */

/**
 * Subscribe to changes in a table
 * @param table - The table to subscribe to
 * @param event - The event to listen for (INSERT, UPDATE, DELETE, or *)
 * @param callback - The callback function to execute when an event occurs
 * @param filter - Optional filter for the subscription
 * @returns The subscription channel
 */
export function subscribeToTable(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void,
  filter?: string
): RealtimeChannel {
  const channel = supabase
    .channel(`table-changes-${table}`)
    .on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table,
        filter
      },
      callback
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to user progress changes
 * @param userId - The user ID to subscribe to
 * @param callback - The callback function to execute when progress changes
 * @returns The subscription channel
 */
export function subscribeToUserProgress(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable(
    'UserProgress',
    '*',
    callback,
    `user_id=eq.${userId}`
  );
}

/**
 * Subscribe to user achievements
 * @param userId - The user ID to subscribe to
 * @param callback - The callback function to execute when achievements change
 * @returns The subscription channel
 */
export function subscribeToUserAchievements(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable(
    'UserAchievements',
    '*',
    callback,
    `user_id=eq.${userId}`
  );
}

/**
 * Subscribe to user assessment results
 * @param userId - The user ID to subscribe to
 * @param callback - The callback function to execute when assessment results change
 * @returns The subscription channel
 */
export function subscribeToUserAssessments(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable(
    'UserAssessments',
    '*',
    callback,
    `user_id=eq.${userId}`
  );
}

/**
 * Subscribe to study plan changes
 * @param userId - The user ID to subscribe to
 * @param callback - The callback function to execute when study plan changes
 * @returns The subscription channel
 */
export function subscribeToStudyPlan(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  return subscribeToTable(
    'StudyPlans',
    '*',
    callback,
    `user_id=eq.${userId}`
  );
}

/**
 * Unsubscribe from a channel
 * @param channel - The channel to unsubscribe from
 */
export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
