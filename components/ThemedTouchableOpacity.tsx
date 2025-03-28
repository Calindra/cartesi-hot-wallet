import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { ThemedText } from './ThemedText' // Adjust import path as needed

export type ThemedTouchableOpacityProps = TouchableOpacityProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'button' | 'row'
  buttonText?: string
}

export function ThemedTouchableOpacity({
  style,
  lightColor,
  darkColor,
  type = 'default',
  buttonText,
  children,
  ...rest
}: ThemedTouchableOpacityProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint')

  const baseStyles: StyleProp<ViewStyle> =
    type === 'button'
      ? {
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 21,
          backgroundColor,
        }
      : type === 'row'
      ? {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }
      : {}

  // Determine text color based on background brightness
  const getTextColor = () => {
    // Simple brightness calculation
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
      const result = shorthandRegex.exec(backgroundColor)
      return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 255, 255]
    }

    const [r, g, b] = hexToRgb(backgroundColor)
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return dark text for light backgrounds, light text for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  return (
    <TouchableOpacity style={[baseStyles, type === 'default' ? { backgroundColor } : null, style]} {...rest}>
      {buttonText ? (
        <ThemedText
          style={{
            color: getTextColor(),
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {buttonText}
        </ThemedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
