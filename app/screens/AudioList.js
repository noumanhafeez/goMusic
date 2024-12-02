import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Platform,
  AppState,
  Alert,
} from "react-native";
import { AudioContext } from "../context/AudioProivder";
import { Audio } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioController";
import AudioListItems from "../components/AudioListItems";
import debounce from "lodash.debounce";

// Memoized Audio List Item Component
const MemoizedAudioListItems = React.memo(AudioListItems);

const AudioList = () => {
  const context = useContext(AudioContext);
  const [searchText, setSearchText] = useState("");
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const setupAudioMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });
    };

    setupAudioMode();

    const handleAppStateChange = (nextAppState) => {
      // Handle app state changes if necessary
    };

    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const filterAudioFiles = (audioFiles, searchText) => {
    return audioFiles.filter((audio) =>
      audio.filename.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleSearchChange = debounce((text) => {
    setSearchText(text);
  }, 300);

  const handleDelete = () => {
    if (currentItem) {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete ${currentItem.filename}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => {
              const updatedAudioFiles = context.audioFiles.filter(
                (audio) => audio.id !== currentItem.id
              );
              context.updateState(context, { audioFiles: updatedAudioFiles });
              setOptionModalVisible(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleAudioPress = async (audio) => {
    const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
      context;

    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);

      return updateState(context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }

    if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(context, { soundObj: status, isPlaying: true });
    }

    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      return updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const { isPlaying, currentAudioIndex } = context;
    return (
      <MemoizedAudioListItems
        title={item.filename}
        duration={item.duration}
        isPlaying={isPlaying}
        activeListItem={currentAudioIndex === index}
        onAudioPress={() => handleAudioPress(item)}
        onOptionPress={() => {
          setCurrentItem(item);
          setOptionModalVisible(true);
        }}
      />
    );
  };

  const filteredAudioFiles = useMemo(
    () => filterAudioFiles(context.audioFiles, searchText),
    [context.audioFiles, searchText]
  );

  return (
    <ImageBackground
      source={require("../../assets/Backgrounds/shad.jpg")}
      style={styles.container}
    >
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search audio..."
          onChangeText={handleSearchChange}
        />
      </View>

      <FlatList
        data={filteredAudioFiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {optionModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentItem ? currentItem.filename : "No song selected"}
            </Text>

            <Text style={styles.modalOption} onPress={handleDelete}>
              Delete
            </Text>

            <Text
              style={styles.modalOption}
              onPress={() => setOptionModalVisible(false)}
            >
              Cancel
            </Text>
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  searchInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    width: "100%",
    color: "#333",
  },
  searchBarContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
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
    color: "#333",
    textAlign: "center",
  },
  modalOption: {
    fontSize: 16,
    color: "#007BFF",
    marginBottom: 12,
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#F1F1F1",
    elevation: 2,
  },
  // Styles remain the same
});

export default AudioList;
