import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily } from '@/constants/tokens'

type IconName = React.ComponentProps<typeof Ionicons>['name']

interface TabIconProps {
  name: IconName
  focused: boolean
  color: string
}

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons)

function TabIcon({ name, focused, color }: TabIconProps) {
  const scale = useSharedValue(focused ? 1 : 0.9)

  useEffect(() => {
    scale.set(withTiming(focused ? 1.1 : 1, { duration: 180 }))
  }, [focused, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedIonicons name={name} size={24} color={color} />
    </Animated.View>
  )
}

export default function TabLayout() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const bottomInset = Math.min(insets.bottom, 12)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.bg.surface,
            borderTopColor: theme.border.default,
            height: 64 + bottomInset,
            paddingBottom: 10 + bottomInset,
          },
        ],
        tabBarActiveTintColor: theme.brand.primary,
        tabBarInactiveTintColor: theme.text.tertiary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: '공매물건',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'hammer' : 'hammer-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="institution"
        options={{
          title: '기관공매',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'business' : 'business-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '관심목록',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'heart' : 'heart-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: 'MY',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'person' : 'person-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
})
