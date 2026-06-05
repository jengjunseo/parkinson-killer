export async function requestNotificationPermission() {
  return false;
}

export async function scheduleFailureNotification(_seconds: number, _failMessage: string) {
  await requestNotificationPermission();
}

export async function cancelFailureNotification() {
  // Expo Go on Android cannot use expo-notifications push functionality in SDK 53+.
  // Keep this service as a no-op for Expo Go, and replace it in a development build later.
}
