import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OptionModal = ({ visible, onClose, currentItem, onPlayPress, onPlaylistPress, onDeletePress }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {currentItem?.filename || "No Song Selected"}
        </Text>

        <TouchableOpacity style={styles.optionButton} onPress={onPlayPress}>
          <Text style={styles.optionText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={onPlaylistPress}>
          <Text style={styles.optionText}>Add to Playlist</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.optionButton} onPress={onDeletePress}>
          <Text style={styles.optionText}>Delete</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dimmed background for focus
  },
  modalContainer: {
    height: 400,
    top: 200,
    width: 300, // Adjust to fit the screen
    backgroundColor: "#fff",
    borderRadius: 10,
    left: 60,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow effect
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    width: "100%", // Full width of the modal
    paddingVertical: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OptionModal;
