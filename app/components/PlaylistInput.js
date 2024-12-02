import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const PlaylistInput = ({ visible, onClose, onSubmit }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleSubmit = () => {
    if (!playlistName.trim()) {
      return onClose(); // Close modal without action if input is empty
    }
    onSubmit(playlistName); // Send playlist name to parent component
    setPlaylistName(''); // Clear input field
    onClose(); // Close modal
  };

  return (
    <View style={{top:100, left:30, height:200, width:320, backgroundColor:'red'}}>
        <Text style={{textAlign:'center', fontSize:20, fontWeight:'600', color:'white'}}>Create Playlist</Text>
        <TextInput placeholder='Enter your name' style={{height:50, width:200, borderRadius:10, borderColor:'black'}}></TextInput>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 inputContainer: {
  width: width - 40,
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
  elevation: 10, // Android shadow
  shadowOpacity: 0.3,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 }, // iOS shadow
},
  modalBG: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: 'black',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontSize: 16,
    paddingVertical: 5,
    color: 'black',
  },
  submit: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 50,
    opacity: 0.8,
  },
});

export default PlaylistInput;
