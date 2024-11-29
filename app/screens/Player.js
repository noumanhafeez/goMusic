import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, TouchableOpacity, Pressable, Platform } from 'react-native';
import React, { useContext, useEffect, useState, Animate, Easing } from 'react';
import color from '../misc/color';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProivder';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTime } from '../misc/helper';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { useNavigation } from '@react-navigation/native'; 
import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFavorites } from '../components/FavContext'; // Update the path as needed



const width = Dimensions.get('window').width;

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackObj, soundObj, currentAudio, currentAudioIndex, totalAudioCount, isPlaying, updateState } = context;
  const navigation = useNavigation();
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  // Inside the Player component
  const [prevButtonSize, setPrevButtonSize] = useState(30);

const handlePrevButtonPress = () => {
  setPrevButtonSize(80); // Increase size
  handlePrev(); // Call your existing handlePrev function
  
  // Reset size back to normal after a short delay
  setTimeout(() => setPrevButtonSize(60), 200);
};

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some((song) => song.uri === currentAudio?.uri);
        setIsLiked(isFavorite);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    checkIfFavorite();
    if (playbackObj) {
      playbackObj.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis);
          setPlaybackDuration(status.durationMillis);
        }

        if (status.didJustFinish) {
          handleNext(); // Automatically play the next audio when the current one finishes
        }
      });
    }

    return () => {
      if (playbackObj) {
        playbackObj.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [playbackObj, currentAudioIndex, context.audioFiles, totalAudioCount]);

  const calculateSeekBar = () => {
    if (playbackDuration) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const handleSliderValueChange = async (value) => {
    if (playbackObj && soundObj.isLoaded) {
      const seekPosition = value * playbackDuration;
      await playbackObj.setPositionAsync(seekPosition);
      setPlaybackPosition(seekPosition);
    }
  };

  const togglePlayPause = async () => {
    if (soundObj?.isLoaded) {
      if (soundObj.isPlaying) {
        const status = await playbackObj.pauseAsync();
        updateState(context, { soundObj: status, isPlaying: false });
      } else {
        const status = await playbackObj.playAsync();
        updateState(context, { soundObj: status, isPlaying: true });
      }
    }
  };

  const handleNext = async () => {
    const { audioFiles, currentAudioIndex, playbackObj, updateState } = context;
    const totalAudioCount = audioFiles.length;
  
    if (totalAudioCount === 0) {
      console.log('No songs available to play.');
      return;
    }
  
    const nextAudioIndex = (currentAudioIndex + 1) % totalAudioCount; // Wrap around to 0 if at the last song
    const nextAudio = audioFiles[nextAudioIndex];
  
    try {
      await playbackObj.unloadAsync(); // Unload the current audio
      const status = await playbackObj.loadAsync(
        { uri: nextAudio.uri },
        { shouldPlay: true }
      ); // Load and play the next audio
  
      updateState(context, {
        currentAudio: nextAudio,
        currentAudioIndex: nextAudioIndex,
        soundObj: status,
        isPlaying: true,
      });
    } catch (error) {
      console.error('Error playing next audio:', error);
    }
  };
  
  const handlePrev = async () => {
    if (currentAudioIndex > 0) {
      const prevAudioIndex = currentAudioIndex - 1;
      const prevAudio = context.audioFiles[prevAudioIndex];

      try {
        await playbackObj.unloadAsync();
        const status = await playbackObj.loadAsync({ uri: prevAudio.uri }, { shouldPlay: true });
        updateState(context, {
          currentAudio: prevAudio,
          currentAudioIndex: prevAudioIndex,
          soundObj: status,
          isPlaying: true,
        });
      } catch (error) {
        console.error('Error playing previous audio:', error);
      }
    } else {
      console.log('No previous songs to play.');
    }
  };

  const renderLiveTimestamp = () => {
    return (
      <View style={styles.timestampContainer}>
        <Text style={styles.currentTime}>{convertTime(playbackPosition / 1000)}</Text>
        <Text style={styles.totalTime}>{convertTime(playbackDuration / 1000)}</Text>
      </View>
    );
  };
  
  const limitTextLength = (text, wordLimit) => {
    // Replace special characters like underscores or hyphens with spaces
    const cleanedText = text.replace(/[_-]/g, ' ');
  
    // Split text by spaces to ensure proper word counting
    const words = cleanedText.split(/\s+/);  // This handles spaces, tabs, and newlines
  
    // If word count exceeds the limit, truncate
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
  
    return text; // Return the original text if under the word limit
  };

  const [isLiked, setIsLiked] = useState(false);
  const handlePress = () => {
    setIsLiked(!isLiked); // Toggle the liked state
  };

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isSongFavorite = currentAudio ? isFavorite(currentAudio.uri) : false;

  const toggleFavorite = () => {
    if (currentAudio) {
      if (isSongFavorite) {
        removeFavorite(currentAudio.uri);
      } else {
        addFavorite(currentAudio);
      }
    }
  };

  return (
    <ImageBackground
              source={require('../../assets/Backgrounds/shad.jpg')} // Replace with your image path
              style={styles.backgroundImage}
            >
    <View style={styles.container}>
      <Text style={styles.audioCount}>{`${currentAudioIndex + 1} / ${totalAudioCount}`}</Text>
      <View style={styles.midBanner}>
      <Image
           source={require('../../assets/man.png')} // Adjust the path to your image
            style={styles.image}
        />
      </View>
      <View style={styles.audioPlayer}>
      <View style={styles.containers}>
  <Text 
    numberOfLines={1}
    style={styles.title}
  >
    {limitTextLength(currentAudio?.filename || 'No Audio Playing', 5)}
  </Text>
</View>
        <View>
          <Text>{renderLiveTimestamp()}</Text>
        </View>
      </View>
      <Slider
        style={{ bottom:70,height: 20, width: width, }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor='#eb9234'
        maximumTrackTintColor='#664727'
        thumbTintColor='#C9A9A6'
        value={calculateSeekBar()}
        onSlidingComplete={handleSliderValueChange}
      />
      <TouchableOpacity onPress={toggleFavorite} style={styles.touchable}>
        <MaterialCommunityIcons
          name={isSongFavorite ? "heart" : "heart-outline"} // Change icon based on state
          size={30} // Icon size
          color={isSongFavorite ? "red" : "white"} // Change color based on state
        />
      </TouchableOpacity>
      <View style={styles.controller}>
       <PlayerButton iconType="PREV" onPress={handlePrev} size={60}  />
        <PlayerButton
         onPress={togglePlayPause}
    iconType={isPlaying ? 'PAUSE' : 'PLAY'}
    size={60}
    
  />
  <PlayerButton iconType="NEXT" onPress={handleNext} size={60}  />
</View>
    </View>
    </ImageBackground>
  );
};


export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: Platform.OS === 'ios' ? 0 : 30
    // backgroundColor:'black'
  },
  timestampContainer: {
    flexDirection: 'row', // Align texts horizontally
    justifyContent: 'space-between', // Space between left and right
    width: '100%', // Ensure it takes full width
    paddingLeft:20,
    paddingRight:20
  },
  image: {
    width: 300, // Adjust dimensions as needed
    height: 300,
    resizeMode: 'contain', // Ensures the image scales correctly
    bottom:40,
    borderRadius:30
  },
  backButton: {
    marginRight: 10,
    backgroundColor:'red'
  },
  gradient: {
    flex: 1, // Ensure the gradient covers the entire screen
    // height:1200,
  },
  currentTime: {
    fontSize: 14,
    color: 'black', // You can adjust the color as needed
    opacity:0.5
  },
  totalTime: {
    fontSize: 14,
    color: 'black', // You can adjust the color as needed
    opacity:0.5,
    textAlign: 'right', // Ensure the duration is aligned to the right
  },
  audioCount: {
    textAlign: 'right',
    padding: 15,
    opacity:0.4,
    color:'black',
    fontSize: 15,
    top:30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    position:'absolute',
    top:30
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire area
  },
  audioPlayer:{
    bottom:80,
  },
  midBanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containers: {
    position: 'absolute',  // Ensure the container is fixed in position
    left: 10,              // Fixed left position
    bottom: 40,            // Fixed bottom position
    width: '100%',         // Make sure it spans the full width
    justifyContent: 'center', // Center the title
    alignItems: 'center',  // Align the text in the center
  },
  title: {
    fontSize: 16,
    padding: 50,
    right:10,
    opacity: 0.7,
    color: 'gray',
    textAlign: 'center',  // Ensure the text is centered within the container
  },
  
  controller: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    bottom:50
  },
  touchable:{ 
    position:'absolute', 
    bottom:240,
    left:25,
  }
});

