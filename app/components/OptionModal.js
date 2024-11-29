import { StyleSheet, Text, View, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import color from '../misc/color'

const OptionModal = ({visible, currentItem, onClose, onPlayPress, onPlaylistPress }) => {
    const {filename} = currentItem
  return (
    <>
    <StatusBar hidden/>
    <Modal 
    visible={visible}
    animationType='slide'
    transparent
    
    >
        <View style={styles.modal}>
            <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
                <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlaylistPress}>
                <Text style={styles.option}>Add to playlist</Text>
            </TouchableWithoutFeedback>
            </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBG}/>
        </TouchableWithoutFeedback> 
    </Modal>
    </>
  )
}

export default OptionModal

const styles = StyleSheet.create({
    modal:{
        position: 'absolute',
        bottom:0,
        right:0,
        opacity:0.9,
        left:0,
        backgroundColor:'black',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        zIndex:9999
    },
    optionContainer:{
        padding:30,
        backgroundColor: 'white',
    },
    title:{
        fontSize:18,
        left:60,
        top:40,
        fontWeight:'bold',
        paddingBottom: 40,
        color: color.FONT_MEDIUM
    },
    option:{
        fontSize:16,
        fontWeight:'bold',
        paddingVertical:10,
        color:'white',
        opacity:0.4,
        textAlign:'center',
        letterSpacing:1
    },
    modalBG:{
        position:'absolute',
        top:0,
        right:0,
        left:0,
        bottom:0,
        color:color.MODAL_BG

    }
})