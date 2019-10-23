import React from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../config/styles/colors'
import Images from '../config/images/index'

const {height, width} = Dimensions.get("screen")
export default HomeScreen = ({navigation}) => {
    const handlePress = (nav) => {
        navigation.navigate(nav)
    }
    return (
        <View style={styles.container}>
        <Image source={Images.psBackground} style={styles.background}/>
        <View style={[styles.container, {marginTop: 0, paddingHorizontal: 20, paddingVertical: 10}]}>
            <TouchableOpacity style={styles.buttonsContainer} onPress={() => {handlePress('NewDB')}}>
                <Image style={styles.image} source={Images.car} />
                {/* <Text style={styles.buttonText}>Drive By</Text>
                <Image style={styles.imageR} source={Images.arrowRight} /> */}
            </TouchableOpacity>
            <TouchableOpacity style={{width: "80%", height: height*.1, backgroundColor: colors.PRIMARY_BACKGROUND, borderRadius: 20, justifyContent: "center", alignItems: "center"}} onPress={()=>navigation.navigate("Map")}>
                <Text style={{color: "white", fontSize: 16}}>Open Map</Text>
            </TouchableOpacity>
        </View>
        </View>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    background: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      width: width,
      height: height,
      opacity: 0.9,
    },
    TextHeader: {
        fontSize: 24,
        color: colors.TEXT_COLOR,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonsContainer: {
        width: width*.8,
        height: width*.8,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        borderWidth: 3,
        borderRadius: width*.4,
        borderColor: colors.SECONDARY_BACKGROUND,
        backgroundColor: colors.PRIMARY_BACKGROUND,
        marginVertical: 3,
    },
    buttonText: {
      color: 'white', 
      fontSize: 26,
      flex: 2,
      textAlign: 'center'
    },
    image: {
      width: "50%",
      height: "50%", 
//      tintColor: 'white', 
      resizeMode: 'contain'
    },
    imageR: {
      flex: .5,
      height: 30,
      resizeMode: 'contain',
      tintColor: 'white'
    }
});

HomeScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: (
            "Home"
        ),
        headerTransparent: true,
    }
};