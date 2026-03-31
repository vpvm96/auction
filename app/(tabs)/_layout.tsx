import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { FontFamily } from '@/constants/tokens'

type IconName = React.ComponentProps<typeof Ionicons>['name']

interface TabIconProps {
  name: IconName
  focused: boolean
  color: string
}

function TabIcon({ name, focused, color }: TabIconProps) {
  return <Ionicons name={name} size={24} color={color} />
}

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.bg.surface,
            borderTopColor: theme.border.default,
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
          title: '경매목록',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'list' : 'list-outline'}
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
    height: 64,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },
})
