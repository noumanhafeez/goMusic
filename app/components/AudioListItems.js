import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Feather from '@expo/vector-icons/Feather';

const renderPlayPauseIcon = (isPlaying) => {
    if (isPlaying) return <AntDesign name="pause" size={24} color="black" />;
    return <Entypo name="controller-play" size={24} color="black" />;
};

const AudioListItems = ({ title, duration, onOptionPress, onAudioPress, isPlaying, activeListItem, imageUrl, index }) => {
    // Shared values for scale and translateX (only use if activeListItem is true)
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);

    // Trigger spring animations for scale and translateX only when activeListItem is true
    React.useEffect(() => {
        if (activeListItem) {
            scale.value = withSpring(isPlaying ? 1.0 : 1, { damping: 1, stiffness: 10 });
            translateX.value = withSpring(isPlaying ? 20 : 0, { damping: 20, stiffness: 600 });
        } else {
            scale.value = 1; // Reset scale if not active
            translateX.value = 0; // Reset translateX if not active
        }
    }, [isPlaying, activeListItem]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value }, // Apply scale if active
                { translateX: translateX.value }, // Apply translateX if active
            ],
        };
    });

    const getThumbnailText = (filename = '') => (filename.length > 0 ? filename[0] : '?');

    const convertTime = (minutes = 0) => {
        if (minutes) {
            const hrs = minutes / 60;
            const [min, percentPart] = hrs.toFixed(2).toString().split('.');
            const percent = parseInt(percentPart || '0', 10);
            const sec = Math.ceil((60 * percent) / 100);

            const formattedMin = parseInt(min) < 10 ? `0${min}` : min;
            const formattedSec = sec < 10 ? `0${sec}` : sec;

            return `${formattedMin}:${formattedSec}`;
        }
        return '00:00'; // Default time if duration is invalid or 0
    };


    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={onAudioPress}>
                <View style={styles.leftContainer}>
                    <Animated.View
                        style={[
                            styles.leftContainerAnimated,
                            animatedStyle,
                            { backgroundColor: activeListItem ? 'transparent' : 'transparent' }, // Conditionally set background color here
                        ]}
                    >
                        <View style={styles.titleContainer}>

                        <Text
                             numberOfLines={1}
    style={[
        styles.title,
        { 
            color: activeListItem ? 'black' : 'gray',
            opacity: activeListItem ? 0.7 : 1,  // Conditionally set opacity here
        },
    ]}
>
    {title}
</Text>
                            <Text style={styles.timeText}>{convertTime(duration)}</Text>
                            <TouchableOpacity onPress={onOptionPress} style={{height:50, width:50,  position:'absolute', bottom:5,left:290}}>
                            <Feather name="more-vertical" size={24} color="black" style={styles.optionsIcon}/>
        </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
            
        </View>
    );
};

export default AudioListItems;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        top: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 60,
        borderRadius: 20,
        marginBottom: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 5,
        opacity: 0.7,
        height: 65,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        elevation: 10,
        borderRadius: 10,
    },
    leftContainerAnimated: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsIcon: {
    color: 'gray',
    top:20
    // marginLeft: 220,
    // zIndex:100,
    // position:'absolute'
  },
    thumbnail: {
        height: 50,
        backgroundColor: 'lightgray',
        flexBasis: 50,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21,
    },
    thumbnailImage: {
        width: 30, // Set the image size to fit within the thumbnail
        height: 30,
        borderRadius: 15, // Make the image round
    },
    titleContainer: {
        width: width - 170,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        color: 'white', // Default color for title when not active
        opacity: 0.6,
    },
    separator: {
        width: '90%', // Ensures the separator spans the entire width of the container
        borderWidth: 0.3,
        borderColor: 'white',
        opacity: 0.3,
        position:'absolute',
        alignSelf: 'center',
        bottom:30,
    },
    timeText: {
        fontSize: 14,
        color: 'black',
        opacity: 0.3,

    },
});
