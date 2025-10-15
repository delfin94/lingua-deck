
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import FloatingTabBar from '@/components/FloatingTabBar';

const tabs = [
  {
    name: 'decks',
    route: '/(tabs)/decks',
    icon: 'book.stack',
    label: 'Decks',
  },
  {
    name: 'study',
    route: '/(tabs)/study',
    icon: 'brain',
    label: 'Study',
  },
  {
    name: 'ai-tutor',
    route: '/(tabs)/ai-tutor',
    icon: 'lightbulb',
    label: 'AI Tutor',
  },
  {
    name: 'progress',
    route: '/(tabs)/progress',
    icon: 'chart.bar',
    label: 'Progress',
  },
  {
    name: 'profile',
    route: '/(tabs)/profile',
    icon: 'person',
    label: 'Profile',
  },
];

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
        tabBar={() => (
          <FloatingTabBar 
            tabs={tabs}
            containerWidth={320}
            borderRadius={28}
            bottomMargin={20}
          />
        )}
      >
        <Tabs.Screen
          name="decks"
          options={{
            title: 'Decks',
          }}
        />
        <Tabs.Screen
          name="study"
          options={{
            title: 'Study',
          }}
        />
        <Tabs.Screen
          name="ai-tutor"
          options={{
            title: 'AI Tutor',
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
        <Tabs.Screen
          name="(home)"
          options={{
            href: null, // This will hide the tab
          }}
        />
      </Tabs>
    </>
  );
}
