import { Dimensions, ScrollView, StyleSheet, Text, View, TextInput, ImageBackground, Platform } from 'react-native';
import React, { Component } from 'react';
import { AudioContext } from '../context/AudioProivder';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import AudioListItems from '../components/AudioListItems';
import OptionModal from '../components/OptionModal';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Audio } from 'expo-av';
import { pause, play, playNext, resume } from '../misc/audioController';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
      searchText: '', // Track the text input value
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
    switch (type) {
      case 'audio':
        dim.width = Dimensions.get('window').width;
        dim.height = 80;
        break;
      default:
        dim.width = 0;
        dim.height = 0;
    }
  });

  // Filter the audio files based on the search text
  filterAudioFiles = (audioFiles, searchText) => {
    return audioFiles.filter(audio => 
      audio.filename.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  handleSearchChange = (text) => {
    this.setState({ searchText: text });
  };

  handleAudioPress = async (audio) => {
    const { soundObj, playbackObj, currentAudio, updateState, audioFiles } = this.context;
    
    // Playing audio for the first time
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      
      return updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      
    }

    // Pause the current audio
    if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    // Resume the current audio
    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    // Play a different audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      return updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  };

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItems
        title={item.filename}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, OptionModalVisible: true });
          
        }}
        imageUrl={item.imageUrl}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ audioFiles, dataProvider, isPlaying, updateState }) => {
          const filteredAudioFiles = this.filterAudioFiles(audioFiles, this.state.searchText);
          const filteredDataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filteredAudioFiles);

          return (
            <ImageBackground
              source={require('../../assets/Backgrounds/shad.jpg')} // Replace with your image path
              style={styles.backgroundImage}
            >
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Find Song..."
                  autoCorrect={false}
                  placeholderTextColor="gray"
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange}
                />
                {/* Conditionally render the search icon only if searchText is empty */}
                {this.state.searchText === '' && (
                  <EvilIcons 
                    name="search" 
                    size={32} 
                    style={styles.searchIcon} 
                  />
                )}
              </View>
              <View>
                <RecyclerListView
                  style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}                  
                  dataProvider={filteredDataProvider}  // Use the filtered data provider
                  layoutProvider={this.layoutProvider}
                  extendedState={{ isPlaying }}
                  rowRenderer={this.rowRenderer}
                  showsVerticalScrollIndicator={false}
                />
                <OptionModal
                  onPlayPress={() => {
                       this.handleAudioPress(this.currentItem); // Start playing the audio
                       this.setState({ OptionModalVisible: false }); // Close the OptionModal
                       }}
                  onPlaylistPress={() => {
                    this.context.updateState(this.context, {
                      addToPlaylist: this.currentItem
                    })
                    this.props.navigation.navigate('PlayList')
                  }}
                  currentItem={this.currentItem}
                  onClose={() => this.setState({ ...this.state, OptionModalVisible: false })}
                  visible={this.state.OptionModalVisible}
                />
              </View>
            </ImageBackground>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 30,
    top:Platform.OS == 'ios' ? 40 : 0,
    flexDirection: 'row', // This is important to align text input and icon horizontally
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire area
  },
  searchInput: {
    height: 50,
    opacity: 0.9,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 15,
    paddingHorizontal: 10,
    color: 'gray',
    fontSize: 16,
    flex: 1, // This ensures the input takes available space
  },
  searchIcon: {
    position: 'absolute',
    left: 330,
    color: 'black',
    opacity: 0.4,
  },
});

export default AudioList;
