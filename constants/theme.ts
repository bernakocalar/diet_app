/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F0F4F8', // Soft blue-ish white
    tint: '#2A9D8F', // Modern Teal
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#2A9D8F',
    primary: '#2A9D8F',
    secondary: '#264653',
    gradientStart: '#4ECDC4',
    gradientEnd: '#2A9D8F',
    accent: '#e9c46a', // New
    orange: '#F4A261', // Sandy Brown / Orange - New
    error: '#e76f51', // New
  },
  dark: {
    text: '#ffffff', // Changed from '#ECEDEE'
    background: '#0f172a', // Slate 900 - Changed from '#0F172A'
    tint: '#4ECDC4', // Bright Teal
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#4ECDC4',
    primary: '#2A9D8F', // Changed from '#4ECDC4'
    secondary: '#264653', // Changed from '#2A9D8F'
    gradientStart: '#2A9D8F',
    gradientEnd: '#264653',
    accent: '#F4A261', // Changed to Orange for dark mode pop - New
    orange: '#E76F51', // Burnt Sienna / Darker Orange - New
    error: '#e76f51', // New
  },
  // Shared gradients can be added here or used via the mode-specific ones
  gradients: {
    primary: ['#2A9D8F', '#264653'] as const, // Changed from ['#4ECDC4', '#2A9D8F']
    ocean: ['#2A9D8F', '#264653'] as const,   // Main to Dark
    sunrise: ['#2A9D8F', '#F4A261'] as const, // New gradient with orange
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
