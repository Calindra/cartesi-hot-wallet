/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light'

  console.log('>>>>>>>>>>>>>> THEME', theme)
  const colorFromProps = props[theme]

  if (colorFromProps) {
    console.log('[1]', colorFromProps)
    return colorFromProps
  } else {
    console.log('[2]', Colors[theme][colorName])
    return Colors[theme][colorName]
  }
}
