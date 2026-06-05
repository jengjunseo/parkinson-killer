/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// 2026 Minimal Light Focus UI Design Tokens
export const Theme = {
  colors: {
    background: '#F6F7F9',
    surface: '#FFFFFF',
    surfaceAlt: '#FCFBF8',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    accent: '#7C3AED',
    accentSoft: '#EDE9FE',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    success: '#16A34A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
  shadow: {
    soft: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: '900',
      color: '#1F2937',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      color: '#1F2937',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#6B7280',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
