import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons' // Assuming Feather icons, adjust if needed
import React from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { ThemedText } from './ThemedText' // Adjust import path as needed

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'button' | 'row'
  buttonText?: string
  iconName?: keyof typeof Feather.glyphMap // Type for Feather icon names
}

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  type = 'button',
  buttonText,
  iconName,
  children,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint')

  const baseStyles: StyleProp<ViewStyle> =
    type === 'button'
      ? {
          paddingHorizontal: 13,
          paddingVertical: 5,
          borderRadius: 21,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
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

  const textColor = getTextColor()

  return (
    <TouchableOpacity style={[baseStyles, type === 'default' ? { backgroundColor } : null, style]} {...rest}>
      {buttonText ? (
        <>
          <ThemedText
            style={{
              color: textColor,
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            {buttonText}
          </ThemedText>
          {iconName && <Feather name={iconName} size={18} color={textColor} />}
        </>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
