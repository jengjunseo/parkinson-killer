import AsyncStorage from '@react-native-async-storage/async-storage';

import { SavedTimeboxingSession } from '../types/timeboxing';

const TIMER_KEY = '@pk_timer_v4';

export async function loadSavedSession(): Promise<SavedTimeboxingSession | null> {
  const stored = await AsyncStorage.getItem(TIMER_KEY);
  return stored ? (JSON.parse(stored) as SavedTimeboxingSession) : null;
}

export async function saveSession(session: SavedTimeboxingSession) {
  await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(session));
}

export async function clearSavedSession() {
  await AsyncStorage.removeItem(TIMER_KEY);
}
