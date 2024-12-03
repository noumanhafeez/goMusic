import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './app/navigation/AppNavigation';
import AudioProivder from './app/context/AudioProivder';
import { FavoritesProvider } from './app/components/FavContext'; // Import FavoritesProvider
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible
        await SplashScreen.preventAutoHideAsync();
        // Simulate a loading process (e.g., fetching resources)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2 seconds of loading
      } catch (e) {
        console.warn(e);
      } finally {
        // App is ready, hide the splash screen
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    // Set the navigation bar color to black
    NavigationBar.setBackgroundColorAsync('black');
  }, []);

  if (!isAppReady) {
    // Show a custom splash screen with a background image
    return (
      <ImageBackground
        source={require('./assets/Backgrounds/shad.jpg')} // Replace with your image path
        style={styles.backgroundImage}
        resizeMode="cover" // Ensures the image covers the entire screen
      >
        <View style={styles.splashContainer}>
          <Text style={styles.splashTitle}>Welcome to Music Player</Text>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ImageBackground>
    );
  }

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
  backgroundImage: {
    flex: 1, // Ensures the image takes up the entire screen
    justifyContent: 'center',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add semi-transparent overlay for text clarity
  },
  splashTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    opacity:0.6,
    marginBottom: 20,
  },
});
