import { StyleSheet, Text, View, Pressable, } from 'react-native'
import React, { useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const TabBarButton = ({onPress, onLongPress, isFocused, routeName, color, label}: {onPress: Function, onLongPress: Function, isFocused: boolean, routeName: string, color: string, label: string}) => {
    const iconMapping = {
        AudioList: 'music',
        Player: 'play',
        Play: 'heart',
        Mood: 'activity'
      };
    const scale = useSharedValue(0)
    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1: 0) : isFocused, {duration:350})
    }, [scale, isFocused])

    const animatedText = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0,1], [1,0])
        return {opacity}
    })
    const iconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0,1], [1,1.2])
        const top = interpolate(scale.value, [0,1], [0,-2])

        return {
            transform:[{
                scale:scaleValue
            }],
            top
        }
    })
    return (
    <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItems}
          >
            <Animated.View style={iconStyle}>
            <Feather
              name={iconMapping[routeName]}
              size={24}
            //   color={isFocused ? 'black' : 'black'}
            />
            </Animated.View>
            {/* <Animated.Text style={[{ color: isFocused ? 'black' : 'blue', fontSize:10 }, animatedText]}>
              {label}
            </Animated.Text> */}
          </Pressable>
  )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabItems: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        gap:5
    }
})