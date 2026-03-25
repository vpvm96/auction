import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Path, G } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'

type SocialProvider = 'kakao' | 'naver' | 'apple' | 'google'

interface ProviderConfig {
  label: string
  bgColor: string
  textColor: string
  borderColor?: string
}

const PROVIDER_CONFIG: Record<SocialProvider, ProviderConfig> = {
  kakao: {
    label: '카카오로 로그인',
    bgColor: '#FEE500',
    textColor: '#000000',
  },
  naver: {
    label: '네이버로 로그인',
    bgColor: '#03C75A',
    textColor: '#FFFFFF',
  },
  apple: {
    label: 'Apple로 로그인',
    bgColor: '#000000',
    textColor: '#FFFFFF',
  },
  google: {
    label: 'Google로 로그인',
    bgColor: '#FFFFFF',
    textColor: '#333333',
    borderColor: Colors.border,
  },
}

function KakaoIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.51 6.6-.2.73-.72 2.64-.82 3.05-.13.5.18.5.38.36.16-.1 2.46-1.67 3.46-2.35.48.07.97.1 1.47.1 5.52 0 10-3.58 10-7.76C22 6.58 17.52 3 12 3z"
        fill="#000000"
      />
    </Svg>
  )
}

function NaverIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <G>
        <Path
          d="M13.57 10.7L6.14 0H0v20h6.43V9.3L13.86 20H20V0h-6.43v10.7z"
          fill="#FFFFFF"
        />
      </G>
    </Svg>
  )
}

function GoogleIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  )
}

function SocialIcon({ provider, size, color }: { provider: SocialProvider; size: number; color: string }) {
  switch (provider) {
    case 'kakao':
      return <KakaoIcon size={size} />
    case 'naver':
      return <NaverIcon size={size} />
    case 'google':
      return <GoogleIcon size={size} />
    case 'apple':
      return <Ionicons name="logo-apple" size={size} color={color} />
  }
}

interface SocialLoginButtonProps {
  provider: SocialProvider
  onPress: () => void
}

export function SocialLoginButton({ provider, onPress }: SocialLoginButtonProps) {
  const config = PROVIDER_CONFIG[provider]

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: config.bgColor },
        config.borderColor != null
          ? { borderWidth: 1, borderColor: config.borderColor }
          : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <SocialIcon provider={provider} size={20} color={config.textColor} />
        <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semibold,
  },
})
