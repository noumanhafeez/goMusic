import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const PlayerButton = (props) => {
  const { iconType, size = 30, onPress } = props;

  const getImageSource = (type) => {
    switch (type) {
      case 'PLAY':
        return require('../../assets/play.png'); // Replace with your play image
      case 'PAUSE':
        return require('../../assets/pause.png'); // Replace with your pause image
      case 'NEXT':
        return require('../../assets/next.png'); // Replace with your next image
      case 'PREV':
        return require('../../assets/prev.png'); // Replace with your previous image
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={{ width: size, height: size }}>
      <Image
        source={getImageSource(iconType)}
        style={{ width: size, height: size,}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default PlayerButton;

const styles = StyleSheet.create({});
