import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import color from '../misc/color'
import AudioListItems from './AudioListItems'

const PlayListDetails = ({visible, playList, onClose}) => {
  return (
    <Modal visible={visible} animationType='slide' transparent onRequestClose={onClose}>
        <View style={styles.container}>
            <Text style={styles.title}>{playList.title}</Text>
            <FlatList 
            contentContainerStyle={styles.listContainer}
            data={playList.audios} 
            key={item => item.id.toString()}
            renderItem={({item}) => 
            <View style={{marginBottom: 10}}>
            <AudioListItems 
                title={item.filename}
                duration={item.duration}
            />
            </View>
            }
            />
        </View>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}/>
    </Modal>
  )
}

export default PlayListDetails

const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:0,
        top:300,
        left:10,
        alignSelf:'center',
        height: height-150,
        width: width-15,
        backgroundColor:'black',
        borderTopRightRadius:30,
        borderTopLeftRadius:30
    },
    modalBG:{
        backgroundColor: 'red',
    },
    listContainer: {
        padding: 20
    },
    title:{
        textAlign:'center',
        fontSize:20,
        paddingVertical:5,
        fontWeight:'bold',
        color: color.ACTIVE_BG
    }
})