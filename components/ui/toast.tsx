import { Ionicons } from '@expo/vector-icons'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@/constants/tokens'
import { useTheme } from '@/hooks/useTheme'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

interface ToastOptions {
  message: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  show: (options: ToastOptions) => void
  hide: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 2200

interface ToastState {
  id: number
  message: string
  variant: ToastVariant
  duration: number
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const idRef = useRef(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const hide = useCallback(() => {
    clearTimer()
    setToast(null)
  }, [])

  const show = useCallback(
    ({ message, variant = 'info', duration = DEFAULT_DURATION }: ToastOptions) => {
      clearTimer()
      idRef.current += 1
      const id = idRef.current
      setToast({ id, message, variant, duration })
      hideTimerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current))
      }, duration)
    },
    [],
  )

  useEffect(() => clearTimer, [])

  const value: ToastContextValue = { show, hide }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast != null ? <ToastView key={toast.id} state={toast} onHide={hide} /> : null}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (ctx == null) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

interface ToastViewProps {
  state: ToastState
  onHide: () => void
}

const VARIANT_ICON: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  info: 'information-circle',
  warning: 'alert-circle',
  error: 'close-circle',
}

function ToastView({ state, onHide }: ToastViewProps) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    opacity.set(withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }))
    translateY.set(withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }))

    const timer = setTimeout(() => {
      opacity.set(withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) }))
      translateY.set(
        withTiming(20, { duration: 200, easing: Easing.in(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(onHide)()
        }),
      )
    }, Math.max(0, state.duration - 200))

    return () => clearTimeout(timer)
  }, [state.id, state.duration, opacity, translateY, onHide])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: translateY.get() }],
  }))

  const iconColor =
    state.variant === 'success'
      ? theme.status.success
      : state.variant === 'warning'
        ? theme.status.warning
        : state.variant === 'error'
          ? theme.status.danger
          : theme.status.info

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.container, { bottom: insets.bottom + Spacing.section }, animatedStyle]}
    >
      <Pressable
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel={state.message}
        onPress={onHide}
        style={[
          styles.toast,
          {
            backgroundColor: theme.bg.elevated,
            borderColor: theme.border.subtle,
          },
          Shadow.md,
        ]}
      >
        <Ionicons name={VARIANT_ICON[state.variant]} size={18} color={iconColor} />
        <Text
          style={[styles.message, { color: theme.text.primary }]}
          numberOfLines={2}
        >
          {state.message}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.page,
    right: Spacing.page,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
  },
  message: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
})
