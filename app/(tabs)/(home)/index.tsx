
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Redirect to decks screen as the main entry point
  return <Redirect href="/(tabs)/decks" />;
}
