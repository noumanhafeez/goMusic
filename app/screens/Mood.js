import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ImageBackground, Image } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';

// Import audio files
const songsData = {
  Rock: [
    { name: 'CocaCola', file: require('../../Songs/rock/CocaCola.mp3') },
    { name: 'Dil Lutiya', file: require('../../Songs/rock/DilLutiya.mp3') },
    { name: 'Gallan Godiyaan', file: require('../../Songs/rock/Gallan.mp3') },
    { name: 'Kala Chashma', file: require('../../Songs/rock/kalaChashma.mp3') },
    { name: 'Kar gai Chull', file: require('../../Songs/rock/KargaiChull.mp3') },
    { name: 'Abhi Toh Party', file: require('../../Songs/rock/party.mp3') },
    { name: 'Proper Patola', file: require('../../Songs/rock/ProperPatola.mp3') },
    { name: 'Tenu LeKe Jaana', file: require('../../Songs/rock/TennuLeKe.mp3') },
    { name: 'Tera Nasha', file: require('../../Songs/rock/TeraNasha.mp3') },
  ],
  CokeStudio: [
    { name: 'Afreen Afreen', file: require('../../Songs/cokeStudio/afreen.mp3') },
    { name: 'Faasle', file: require('../../Songs/cokeStudio/faasle.mp3') },
    { name: 'jhol', file: require('../../Songs/cokeStudio/jhol.mp3') },
    { name: 'jhoom', file: require('../../Songs/cokeStudio/jhoom.mp3') },
    { name: 'pasoori', file: require('../../Songs/cokeStudio/pasoori.mp3') },
    { name: 'ranjishhi', file: require('../../Songs/cokeStudio/ranjishhi.mp3') },
  ],
  Aesthetic: [
    { name: 'Aadat', file: require('../../Songs/aesthetic/Aadat.mp3') },
    { name: 'Anjanay Rastey', file: require('../../Songs/aesthetic/AnjanayRastey.mp3') },
    { name: 'Haal Aisa', file: require('../../Songs/aesthetic/HaalAisa.mp3') },
    { name: 'Hoor', file: require('../../Songs/aesthetic/Hoor.mp3') },
    { name: 'Jhula Jhulaye', file: require('../../Songs/aesthetic/Jhula.mp3') },
    { name: 'Pehli Daffa', file: require('../../Songs/aesthetic/PehliDafa.mp3') },
    { name: 'Pi Jaun', file: require('../../Songs/aesthetic/PiJaun.mp3') },
    { name: 'Royiaan', file: require('../../Songs/aesthetic/Royiaan.mp3') },
    { name: 'Yakeen', file: require('../../Songs/aesthetic/Yakeen.mp3') },
  ],
  Sad: [
    { name: 'Zara Si Dil', file: require('../../Songs/sad/ZaraSa.mp3') },
    { name: 'Ijazat', file: require('../../Songs/sad/Ijazat.mp3') },
    { name: 'Agar Tum Sath ho', file: require('../../Songs/sad/agartumsathho.mp3') },
    { name: 'Tuhjse Naraz Nahi', file: require('../../Songs/sad/Naraznahi.mp3') },
    { name: 'Subko Sub Nahi Milta', file: require('../../Songs/sad/Bayaannahimilta.mp3') },
  ]
};

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Play a sound
  const playSound = async (index) => {
    try {
      // Stop the previous sound if playing
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      // Load the new sound
      const { sound } = await Audio.Sound.createAsync(songsData[selectedMood][index].file);
      setCurrentSound(sound);
      setCurrentIndex(index);
      await sound.playAsync();
      setIsPlaying(true);

      // Play next song when current finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playNext();
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Stop the current sound
  const stopSound = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Play the next song
  const playNext = () => {
    const nextIndex = (currentIndex + 1) % songsData[selectedMood].length;
    playSound(nextIndex);
  };

  // Play the previous song
  const playPrevious = () => {
    const prevIndex = (currentIndex - 1 + songsData[selectedMood].length) % songsData[selectedMood].length;
    playSound(prevIndex);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setModalVisible(true);
    setCurrentIndex(0);
  };

  const closeModal = () => {
    setModalVisible(false);
    stopSound();
  };

  return (
    <ImageBackground
      source={require('../../assets/Backgrounds/shad.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Let's play with your mood!</Text>

        <View style={styles.boxContainer}>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={[styles.box, styles.happyBox]} onPress={() => handleMoodClick('Rock')}>
          <Text style={{fontSize:20, color:'white', fontWeight:'700', opacity:0.8}}>Rock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box, styles.cokeBox]} onPress={() => handleMoodClick('CokeStudio')}>
          <Text style={{fontSize:20, color:'white', fontWeight:'700', opacity:0.8}}>Coke Studio</Text>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={[styles.box, styles.aestheticBox]} onPress={() => handleMoodClick('Aesthetic')}>
          <Text style={{fontSize:20, color:'white', fontWeight:'700', opacity:0.8}}>Aesthetic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.box, styles.sadBox]} onPress={() => handleMoodClick('Sad')}>
          <Text style={{fontSize:20, color:'white', fontWeight:'700', opacity:0.8}}>Broken</Text>
          </TouchableOpacity>
          </View>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Fontisto name="close-a" size={16} color="red" style={{opacity:0.5, left:12}} />
          </TouchableOpacity>
            <View style={styles.modalContent}>
            <View style={{height:40, width:190, alignItems:'center', marginBottom:10, borderRadius:10, backgroundColor:'pink'}}>
              <Text style={styles.modalHeader}>Playlist: {selectedMood}</Text>
              </View>
              <FlatList
  data={songsData[selectedMood]}
  renderItem={({ item, index }) => (
    <TouchableOpacity onPress={() => playSound(index)} style={styles.songBox}>
      <Text style={styles.songItem}>{item.name}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ paddingBottom: 10, paddingTop:10 }}
  style={{ maxHeight: 140 }} // Limit the visible height to show 4 songs (adjust as needed)
  showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator
/>

              <View style={styles.controls}>
                <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? stopSound : () => playSound(currentIndex)} style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>{isPlaying ? 'Stop' : 'Play'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={playNext} style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  image: { width: 40, height: 40 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'gray', opacity:0.5 },
  boxContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' },
  box: { height: 100, width: '45%', borderRadius: 15, justifyContent: 'center', alignItems: 'center', margin: 10 },
  happyBox: { backgroundColor: '#4caf50', opacity:0.7 },
  sadBox: { backgroundColor: '#2196f3', opacity:0.9 },
  cokeBox: { backgroundColor: 'red', opacity:0.5},
  aestheticBox: { backgroundColor: 'gray', opacity:0.5},
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalHeader: { fontSize: 18, fontWeight: '500', marginBottom: 10, top:5, color:'black', opacity:0.6 },
  songItem: { fontSize: 15, marginBottom: 20, top:10, opacity:0.5, alignItems:'center', textAlign:'center' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20,top:15, width: '100%' },
  controlButton: { backgroundColor: '#4caf50', padding: 10, borderRadius: 5 },
  controlButtonText: { color: '#fff', fontSize: 16 },
  closeButton: { left:120,  padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16 },
  songBox: {
    backgroundColor: 'pink', // Light background color for the box
    // padding: 10,               // Padding inside the box
    marginBottom: 10,          // Space between boxes
    borderRadius: 10,          // Rounded corners for the box
    alignItems: 'center',      // Center align text within the box
    elevation: 2,              // Adds a shadow on Android
    shadowColor: '#000',       // Shadow color for iOS
    shadowOpacity: 0.2,        // Shadow opacity for iOS
    width:200,
    height:40,
    shadowRadius: 4,           // Shadow radius for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
  },
});

export default Mood;
