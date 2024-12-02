import { Alert, Text, View} from 'react-native';
import React, { Component, createContext} from 'react';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import { Audio } from 'expo-av';

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playbackObj: null,
      audioFiles: [],
      playList: [],
      addToPlaylist: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  // Alert Message for permission
  permissionAlert = () => {
    Alert.alert(
      "Permission Required",
      "This app needs access to your audio files (MP3s).",
      [
        {
          text: "I am ready",
          onPress: () => this.getPermission(),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Permission denied"),
        },
      ]
    );
  };

  // Get audio files
  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    try {
      // Fetch only audio files (MP3 or other formats)
      let media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio, // Ensuring only audio is fetched
      });

      media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: media.totalCount, // Fetch all audio files
      });

      this.totalAudioCount = media.totalCount;
      this.setState({
        ...this.state,
        dataProvider: dataProvider.cloneWithRows([
          ...audioFiles,
          ...media.assets,
        ]),
        audioFiles: [...audioFiles, ...media.assets],
      });
    } catch (error) {
      console.log('Error fetching audio files', error);
    }
  };

  // Handle permissions for audio access
  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();

    if (permission.granted) {
      // Permission granted
      this.getAudioFiles();
    } else if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        // Show alert message if permission denied
        this.permissionAlert();
      } else if (status === "granted") {
        // Permission granted
        this.getAudioFiles();
      } else if (status === "denied" && !canAskAgain) {
        // Permission permanently denied
        this.setState({ permissionError: true });
      }
    } else if (!permission.canAskAgain) {
      // Permission permanently denied
      this.setState({ permissionError: true });
    }
  };

  componentDidMount() {
    const playbackObj = new Audio.Sound();
    this.setState({ playbackObj });
    this.getPermission();
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex, playbackPosition, playbackDuration } = this.state;

    // Show error message if permission is permanently denied
    if (permissionError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, textAlign: 'center', color: 'black' }}>
            Ooops! It looks like you didn't grant the required permissions. Please enable them in your device settings.
          </Text>
        </View>
      );
    }

    return (
      <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObj, soundObj, currentAudio, updateState: this.updateState, isPlaying, playbackPosition, playbackDuration, currentAudioIndex, totalAudioCount: this.totalAudioCount }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
