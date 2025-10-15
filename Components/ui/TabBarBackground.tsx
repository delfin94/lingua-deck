
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabBarBackground() {
  return <BlurView tint="light" intensity={95} style={StyleSheet.absoluteFill} />;
}
