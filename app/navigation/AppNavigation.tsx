import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import { MyTabBar } from '../components/TabBar';
import PlayList from '../screens/PlayList';



const Tab = createBottomTabNavigator()

const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />} // Pass custom tab bar here
      screenOptions={{
        headerShown:false,
        headerStyle: {
          backgroundColor: 'pink', // Set the background color
          height:50,
          
        },
        headerBackground: () => (
          <Image
            source={require('../../assets/Backgrounds/shad.jpg')} // Replace with your image URL
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover" // Adjust based on your desired fit
          />
        ),
        headerTitleStyle: {
          color: 'gray', // Text color
          fontSize: 30, // Text size
          fontWeight: 'bold', // Text weight
          textAlign: 'center', // Center the text
          letterSpacing: 1, // Add spacing between letters
        },
      }}
    >
      <Tab.Screen name="AudioList" component={AudioList} options={{title: 'Songs'}} />
      <Tab.Screen name="Player" component={Player} options={{title: 'Play'}} />
      <Tab.Screen name="Play" component={PlayList} options={{title: 'Favorites'}} />


    </Tab.Navigator>
  );
}

export default AppNavigation

const styles = StyleSheet.create({
  linearGradient: {
    ...StyleSheet.absoluteFillObject, // Covers the entire tab bar
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})
