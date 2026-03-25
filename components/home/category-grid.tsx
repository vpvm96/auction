import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { FontFamily, FontSize, Radius, Spacing } from '@/constants/tokens'
import { router } from 'expo-router'

type AuctionType = 'apartment' | 'car' | 'officetel' | 'house' | 'commercial' | 'land' | 'equipment' | 'other'

interface Category {
  type: AuctionType
  label: string
  icon: React.ComponentProps<typeof Ionicons>['name']
}

const CATEGORIES: Category[] = [
  { type: 'apartment', label: '아파트', icon: 'business-outline' },
  { type: 'car', label: '자동차', icon: 'car-outline' },
  { type: 'officetel', label: '오피스텔', icon: 'cube-outline' },
  { type: 'house', label: '주택', icon: 'home-outline' },
  { type: 'commercial', label: '상가', icon: 'storefront-outline' },
  { type: 'land', label: '토지', icon: 'map-outline' },
  { type: 'equipment', label: '중기', icon: 'construct-outline' },
  { type: 'other', label: '기타', icon: 'ellipsis-horizontal-circle-outline' },
]

interface CategoryItemProps {
  category: Category
}

function CategoryItem({ category }: CategoryItemProps) {
  const handlePress = () => {
    router.push({ pathname: '/(tabs)/list', params: { type: category.type } })
  }

  return (
    <Pressable style={styles.categoryItem} onPress={handlePress}>
      <View style={styles.iconWrapper}>
        <Ionicons name={category.icon} size={28} color={Colors.primary} />
      </View>
      <Text style={styles.categoryLabel}>{category.label}</Text>
    </Pressable>
  )
}

export function CategoryGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <CategoryItem key={cat.type} category={cat} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.page,
    marginBottom: Spacing.xl,
    padding: Spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
})
