import React, { useEffect, useState, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavContext';
import { AudioContext } from '../context/AudioProivder';
import { play, playNext, playPrevious } from '../misc/audioController'; // Ensure this file exists
import { Audio } from 'expo-av';

const PlayList = () => {
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation();
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSliderBeingUsed, setIsSliderBeingUsed] = useState(false);

  const { playbackObj, soundObj, updateState, currentAudio } = useContext(AudioContext);

  useEffect(() => {
    if (playbackObj) {
      playbackObj.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    }
  }, [playbackObj]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis / 1000); // Duration in seconds
      if (!isSliderBeingUsed) {
        setSliderValue(status.positionMillis / status.durationMillis); // Normalize slider value (0-1)
      }
    }

    if (status.didJustFinish) {
      handleSongEnd(); // Auto-play next song
    }
  };

  const handleAudioPress = async (audio, index) => {
    try {
      if (playbackObj && soundObj?.isPlaying) {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
      }

      const playback = playbackObj || new Audio.Sound();
      const status = await play(playback, audio.uri);

      updateState({
        currentAudio: audio,
        playbackObj: playback,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });

      setCurrentSongIndex(index);
      setIsPlaying(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error in handleAudioPress:', error);
    }
  };

  const handleSongEnd = async () => {
    if (currentSongIndex === null || favorites.length === 0) return;
  
    // Looping: When the last song finishes, go back to the first song.
    const nextSongIndex = (currentSongIndex + 1) % favorites.length;
    const nextSong = favorites[nextSongIndex];
  
    try {
      const status = await playNext(playbackObj, nextSong.uri);
      updateState({
        currentAudio: nextSong,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: nextSongIndex,
      });
  
      setCurrentSongIndex(nextSongIndex);
      setSliderValue(0);
    } catch (error) {
      console.error('Error in handleSongEnd:', error);
    }
  };
  

  const handlePreviousSong = async () => {
    if (currentSongIndex === null || !favorites[currentSongIndex]) return;

    const prevSongIndex = (currentSongIndex - 1 + favorites.length) % favorites.length;
    const prevSong = favorites[prevSongIndex];

    const status = await playPrevious(playbackObj, prevSong.uri);
    updateState({
      currentAudio: prevSong,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: prevSongIndex,
    });

    setCurrentSongIndex(prevSongIndex);
    setSliderValue(0);
  };

  const handleSliderChange = async (value) => {
    if (playbackObj && soundObj?.isLoaded) {
      const seekPosition = value * duration * 1000; // Convert to milliseconds
      await playbackObj.setPositionAsync(seekPosition);
    }
  };

  const renderFavoriteItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleAudioPress(item, index)}
      style={styles.favoriteItem}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.filename || 'Unknown Title'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeFavorite(item.uri)} style={styles.removeButton}>
        <MaterialCommunityIcons name="heart-off" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/Backgrounds/shad.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Favorite Songs</Text>
        {favorites.length === 0 ? (
          <Text style={styles.noFavorites}>No favorites yet!</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.uri}
            renderItem={renderFavoriteItem}
          />
        )}
        
        {/* Modal */}
        <Modal
  visible={showModal}
  onRequestClose={async () => {
    setShowModal(false);
    if (playbackObj && isPlaying) {
      await playbackObj.pauseAsync(); // Pause the song when the modal is closed
      setIsPlaying(false);
    }
  }}
  animationType="fade"
  transparent={true}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{currentAudio?.filename || 'Unknown Song'}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePreviousSong} style={styles.controlButton}>
          <MaterialCommunityIcons name="skip-previous" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setIsPlaying(!isPlaying);
            if (isPlaying) {
              await playbackObj.pauseAsync();
            } else {
              await playbackObj.playAsync();
            }
          }}
          style={styles.controlButton}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSongEnd} style={styles.controlButton}>
          <MaterialCommunityIcons name="skip-next" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      </View>
    </ImageBackground>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: Platform.OS === 'ios' ? 80 : 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#eb9234',
  },
  noFavorites: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 70,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(243, 241, 239, 0.5)',
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 15,
    color: 'black',
    opacity:0.4
  },
  removeButton: {
    padding: 10,
  },
  backButton: {
     marginTop: 220,
    backgroundColor: '#eb9234',
    padding: 10,
    position:'absolute',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    marginHorizontal: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
});
