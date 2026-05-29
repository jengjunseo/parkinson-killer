import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '@/constants/theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

export interface AppButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function AppButton({
  title,
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: AppButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.accent,
          ...styles.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.surface,
          borderWidth: 1,
          borderColor: Theme.colors.border,
          ...styles.secondary,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.dangerSoft,
          borderWidth: 1,
          borderColor: Theme.colors.danger,
          ...styles.danger,
        };
      case 'icon':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.success,
          width: 45,
          height: 45,
          borderRadius: Theme.radius.sm,
          ...styles.icon,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.baseText,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
          ...styles.primaryText,
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: Theme.colors.textPrimary,
          ...styles.secondaryText,
        };
      case 'danger':
        return {
          ...baseTextStyle,
          color: Theme.colors.danger,
          ...styles.dangerText,
        };
      case 'icon':
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: 'bold',
          ...styles.iconText,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    >
      {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
    minHeight: 48,
  },
  primary: {
    // Primary button specific styles
  },
  secondary: {
    // Secondary button specific styles
  },
  danger: {
    // Danger button specific styles
  },
  icon: {
    // Icon button specific styles
  },
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    fontWeight: '700',
    fontSize: 18,
  },
  secondaryText: {
    fontWeight: '600',
  },
  dangerText: {
    fontWeight: '600',
  },
  iconText: {
    // Icon text specific styles
  },
});
