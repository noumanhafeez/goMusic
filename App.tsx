import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigation from './app/navigation/AppNavigation';
import AudioProivder from './app/context/AudioProivder';
import React, { useEffect, useState } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { FavoritesProvider } from './app/components/FavContext'; // Import FavoritesProvider
import color from './app/misc/color';



  
export default function App() {

  useEffect(() => {
    // Set the navigation bar color to black
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
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background overlay
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(252,176,69,1) 10%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
