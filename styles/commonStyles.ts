
import { StyleSheet } from 'react-native';

// Light theme colors
export const lightColors = {
  background: '#f9f9f9',
  text: '#212121',
  textSecondary: '#757575',
  primary: '#3f51b5',
  secondary: '#e91e63',
  accent: '#00bcd4',
  card: '#ffffff',
  surface: '#ffffff',
  highlight: '#ffeb3b',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

// Dark theme colors
export const darkColors = {
  background: '#121212',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  primary: '#7986cb',
  secondary: '#f48fb1',
  accent: '#4dd0e1',
  card: '#1e1e1e',
  surface: '#1e1e1e',
  highlight: '#fff59d',
  border: '#2c2c2c',
  success: '#81c784',
  warning: '#ffb74d',
  error: '#e57373',
};

// Default to light colors for backward compatibility
export const colors = lightColors;

// Function to get colors based on theme
export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextOutline: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
