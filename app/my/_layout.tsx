import { Stack } from 'expo-router'

export default function MyLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
}
