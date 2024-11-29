import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import color from '../misc/color'

const Screen = ({children}) => {
  return (
    <View>
      <Text style={styles.container}>{children}</Text>
    </View>
)
}

const  styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: color.APP_BG,
    }
})

export default Screen;
