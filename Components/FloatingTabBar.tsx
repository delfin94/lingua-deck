
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = 320,
  borderRadius = 28,
  bottomMargin = 20
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  // Move all hooks to the top level
  const animatedValue = useSharedValue(0);
  
  // Create shared values for each tab at the top level - fixed to not use hooks in callbacks
  const scaleValue0 = useSharedValue(1);
  const scaleValue1 = useSharedValue(1);
  const scaleValue2 = useSharedValue(1);
  const scaleValue3 = useSharedValue(1);
  const scaleValue4 = useSharedValue(1);

  const scaleValues = React.useMemo(() => {
    const values = [scaleValue0, scaleValue1, scaleValue2, scaleValue3, scaleValue4];
    return values.slice(0, tabs.length);
  }, [tabs.length, scaleValue0, scaleValue1, scaleValue2, scaleValue3, scaleValue4]);

  // Enhanced active tab detection
  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      // Exact route match gets highest score
      if (pathname === tab.route) {
        score = 100;
      }
      // Check if pathname starts with tab route (for nested routes)
      else if (pathname.startsWith(tab.route)) {
        score = 80;
      }
      // Check if pathname contains the tab name
      else if (pathname.includes(tab.name)) {
        score = 60;
      }
      // Check for partial matches in the route
      else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 18,
        stiffness: 140,
        mass: 0.8,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: string, index: number) => {
    // Add press animation
    if (scaleValues[index]) {
      scaleValues[index].value = withTiming(0.85, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      }, () => {
        scaleValues[index].value = withSpring(1, {
          damping: 15,
          stiffness: 200,
        });
      });
    }

    router.push(route);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth - 24) / tabs.length; // Account for container padding
    const indicatorWidth = tabWidth * 0.9; // Make indicator slightly smaller than tab
    const offset = (tabWidth - indicatorWidth) / 2; // Center the indicator
    
    return {
      width: indicatorWidth,
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, tabs.length - 1],
            [12 + offset, 12 + offset + tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  // Create animated styles for all tabs at the top level - fixed to not use hooks in callbacks
  const tabAnimatedStyle0 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue0.value }],
  }));
  
  const tabAnimatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue1.value }],
  }));
  
  const tabAnimatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue2.value }],
  }));
  
  const tabAnimatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue3.value }],
  }));
  
  const tabAnimatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue4.value }],
  }));

  const tabAnimatedStyles = React.useMemo(() => {
    const styles = [tabAnimatedStyle0, tabAnimatedStyle1, tabAnimatedStyle2, tabAnimatedStyle3, tabAnimatedStyle4];
    return styles.slice(0, tabs.length);
  }, [tabs.length, tabAnimatedStyle0, tabAnimatedStyle1, tabAnimatedStyle2, tabAnimatedStyle3, tabAnimatedStyle4]);

  // Dynamic theme-based styles
  const getTabBarColors = () => {
    if (isDark) {
      return {
        background: 'rgba(28, 28, 30, 0.95)',
        blur: 'rgba(28, 28, 30, 0.8)',
        indicator: colors.primary,
        activeText: colors.primary,
        inactiveText: '#8E8E93',
        shadow: 'rgba(0, 0, 0, 0.6)',
      };
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        blur: 'rgba(255, 255, 255, 0.9)',
        indicator: colors.primary,
        activeText: colors.primary,
        inactiveText: '#8E8E93',
        shadow: 'rgba(0, 0, 0, 0.15)',
      };
    }
  };

  const tabColors = getTabBarColors();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[
        styles.container,
        {
          width: containerWidth,
          marginBottom: bottomMargin,
          ...Platform.select({
            ios: {
              shadowColor: tabColors.shadow,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 24,
            },
            android: {
              elevation: 12,
            },
            web: {
              boxShadow: `0 8px 32px ${tabColors.shadow}`,
            },
          }),
        }
      ]}>
        <BlurView
          intensity={Platform.OS === 'web' ? 0 : 90}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.blurContainer,
            {
              borderRadius,
              backgroundColor: Platform.OS === 'web' ? tabColors.background : tabColors.blur,
            }
          ]}
        >
          {/* Animated indicator */}
          <Animated.View 
            style={[
              styles.indicator,
              {
                backgroundColor: tabColors.indicator,
                borderRadius: borderRadius - 8,
              },
              indicatorStyle
            ]} 
          />
          
          {/* Tab buttons */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = activeTabIndex === index;

              return (
                <Animated.View key={tab.name} style={[styles.tab, tabAnimatedStyles[index]]}>
                  <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => handleTabPress(tab.route, index)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.tabContent}>
                      <IconSymbol
                        name={tab.icon}
                        size={isActive ? 26 : 24}
                        color={isActive ? tabColors.activeText : tabColors.inactiveText}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          {
                            color: isActive ? tabColors.activeText : tabColors.inactiveText,
                            fontWeight: isActive ? '700' : '500',
                            fontSize: isActive ? 12 : 11,
                          },
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    alignSelf: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 0 : 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  indicator: {
    position: 'absolute',
    top: 8,
    left: 0,
    bottom: 8,
    opacity: 0.15,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
