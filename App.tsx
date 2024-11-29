import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigation from './app/navigation/AppNavigation';
import AudioProivder from './app/context/AudioProivder';
import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { FavoritesProvider } from './app/components/FavContext'; // Import FavoritesProvider
import color from './app/misc/color';



export default function App() {
  useEffect(() => {
    // Set the navigation bar color to red
    NavigationBar.setBackgroundColorAsync('black');
  }, []);

  return (
    <AudioProivder>
    <FavoritesProvider> 
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </FavoritesProvider>
  </AudioProivder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(252,176,69,1) 10%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
