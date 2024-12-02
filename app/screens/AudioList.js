import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Platform,
  AppState,
  Alert,
} from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProivder";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import AudioListItems from "../components/AudioListItems";
import { Audio } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioController";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
      searchText: '',
      appState: AppState.currentState,
    };
    this.currentItem = {};
  }

  setupAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true, // Allow audio to play in background
      playsInSilentModeIOS: true,
    });
  };

  handleDelete = () => {
    const { currentItem } = this.state;
    const { audioFiles, updateState } = this.context;

    if (currentItem) {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete ${currentItem.filename}?`,
        [
          { text: "Cancel", onPress: () => {}, style: "cancel" },
          {
            text: "Delete",
            onPress: () => {
              const updatedAudioFiles = audioFiles.filter(
                (audio) => audio.id !== currentItem.id
              );
              updateState(this.context, { audioFiles: updatedAudioFiles });
              this.setState({ OptionModalVisible: false });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  async componentDidMount() {
    // Set up audio mode to allow background playback
    await this.setupAudioMode();

    // Listen for app state changes
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 80;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

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
    const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
      this.context;

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

    if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

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
          // Set the selected song in the state
          this.setState({ currentItem: item, OptionModalVisible: true });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ audioFiles, dataProvider, isPlaying }) => {
          const filteredAudioFiles = this.filterAudioFiles(audioFiles, this.state.searchText);
          const filteredDataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filteredAudioFiles);

          return (
            <ImageBackground
              source={require("../../assets/Backgrounds/shad.jpg")}
              style={styles.container}
            >
              <View style={styles.searchBarContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search audio..."
                  value={this.state.searchText}
                  onChangeText={this.handleSearchChange} // Correct function reference
                />
              </View>

              <RecyclerListView
                dataProvider={filteredDataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
              />

              {this.state.OptionModalVisible && (
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {/* Show the title of the selected song */}
                    <Text style={styles.modalTitle}>
                      {this.state.currentItem ? this.state.currentItem.filename : "No song selected"}
                    </Text>

                    <Text style={styles.modalOption} onPress={this.handleDelete}>
                      Delete
                    </Text>

                    <Text
                      style={styles.modalOption}
                      onPress={() => this.setState({ OptionModalVisible: false })}
                    >
                      Cancel
                    </Text>
                  </View>
                </View>
              )}

            </ImageBackground>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  searchInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    width: 360,
    color: "#333",  // Dark text for readability
  },
  searchBarContainer: {
    marginTop: 7,
    marginBottom: 5,
    marginHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",  // Make the search input and icon align horizontally
    alignItems: "center",  // Center the elements vertically
    backgroundColor: "#f7f7f7",  // Light background color for the search bar area
    borderRadius: 25,
    paddingLeft: 10,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333", // Dark color for the title
    textAlign: "center", // Center the title
  },
  modalOption: {
    fontSize: 16,
    color: "#007BFF", // Blue color for options
    marginBottom: 12,
    textAlign: "center", // Center the option text
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#F1F1F1", // Light background for the option
    elevation: 2, // Slight shadow to make the button stand out
  },
  modalOptionDelete: {
    fontSize: 16,
    color: "#FF6347", // Red color for delete option
    marginBottom: 12,
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#F1F1F1",
    elevation: 2,
  },
});

export default AudioList;
