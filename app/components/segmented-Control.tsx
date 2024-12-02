import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ViewToken } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Palette } from '../../constants/palette'

type SegmentedControlProps = {
    options: string[],
    selectedOptions: string,
    onOptionPress?: (option: string) => void
}



const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(({ options, selectedOptions, onOptionPress }) => {
    const {width: windowWidth} = useWindowDimensions()
    const segWidth = windowWidth - 40;
    const itemWidth = (segWidth - 25) / options.length
    const rstyle = useAnimatedStyle(() => {
        return {
            left: withTiming(itemWidth * options.indexOf(selectedOptions) + 18)
        }
    }, [selectedOptions, options, itemWidth])
    return (
        <View style={[styles.container, { paddingHorizontal: 20, paddingLeft:20, width: segWidth}]}>
            <Animated.View style={[{
                width: itemWidth- 10,
            }, rstyle, styles.activeBox]}/>
            {options.map((option) => {
                return (
                    <TouchableOpacity onPress={() => {onOptionPress?.(option) }}key={option} style={[{
                        width: itemWidth,
                    }, styles.labelContainer]}>
                        <Text style={{
                            fontSize:16,

                        }}>{option}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignSelf:'center',
        flexDirection:'row',
        top:400,
        backgroundColor:Palette.baseGray05,
        height:60,
        borderRadius:20
    },
    option: {
        // flexDirection:'row',
        backgroundColor:Palette.baseGray05,
        height:60,
    },
    activeBox: {
        height: '80%',
                position:'absolute',
                borderRadius:10,
                top: '10%',
                shadowColor:'black',
                shadowOffset: {
                    width:0,
                    height:10
                },
                shadowOpacity:0.1,
                backgroundColor: Palette.background
    },
    labelContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export { SegmentedControl }