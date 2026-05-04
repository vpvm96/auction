import { Platform, StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native'

let LottieView: typeof import('lottie-react-native').default | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LottieView = require('lottie-react-native').default
} catch {
  LottieView = null
}

export type LoadingSpinnerSize = 'small' | 'medium' | 'large'

const SIZE_MAP: Record<LoadingSpinnerSize, number> = {
  small: 48,
  medium: 96,
  large: 160,
}

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize | number
  style?: StyleProp<ViewStyle>
}

export function LoadingSpinner({ size = 'medium', style }: LoadingSpinnerProps) {
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size]

  if (Platform.OS === 'web' || LottieView == null) {
    return <View style={[{ width: dimension, height: dimension }, style]} />
  }

  return (
    <View style={[styles.container, { width: dimension, height: dimension }, style]}>
      <LottieView
        source={require('@/assets/lottie/home-loading.json')}
        autoPlay
        loop
        style={styles.lottie}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
})
