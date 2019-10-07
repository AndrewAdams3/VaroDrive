import React from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import colors from '../config/styles/colors'
import Images from '../config/images/index'

export default HomeScreen = ({navigation}) => {
    const handlePress = (nav) => {
        navigation.navigate(nav)
    }
    return (
        <View style={styles.container}>
        <Image source={Images.psBackground} style={styles.background}/>
        <View style={[styles.container, {marginTop: 0, paddingHorizontal: 20, paddingVertical: 10}]}>
            <TouchableOpacity style={[styles.buttonsContainer]} onPress={() => {handlePress('Profile')}}>
                <Image style={[styles.image, { transform: [{ scaleX: .7 }, { scaleY: .7 }]}]} source={Images.profile} />
                <Text style={styles.buttonText}>Profile</Text>
                <Image style={styles.imageR} source={Images.arrowRight} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonsContainer]} onPress={() => {handlePress('TimeIn')}}>
                <Image style={styles.image} source={Images.TimeIn} />
                <Text style={styles.buttonText}>Time Clock</Text>
                <Image style={styles.imageR} source={Images.arrowRight} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonsContainer]} onPress={() => {handlePress('NewDB')}}>
                <Image style={[styles.image, {transform: [{scaleX:-1}] }]} source={Images.DriveBy} />
                <Text style={styles.buttonText}>Drive By</Text>
                <Image style={styles.imageR} source={Images.arrowRight} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonsContainer]} onPress={() => {handlePress('TimeSheet')}}>
                <Image style={styles.image} source={Images.TimeSheet} />
                <Text style={styles.buttonText}>Time Sheet</Text>
                <Image style={styles.imageR} source={Images.arrowRight} />
            </TouchableOpacity>
            <View style={{height: Platform.OS === 'ios' ? 20 : 0}}/>
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
        marginTop: Platform.OS === "ios" ? 120 : 80,
    },
    background: {
      position: 'absolute',
      top: 0, left: 0,
      height: '100%',
      width: '100%',
      opacity: 0.9,
    },
    TextHeader: {
        fontSize: 24,
        color: colors.TEXT_COLOR,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonsContainer: {
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        borderWidth: 3,
        borderRadius: 10,
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
      flex: .5, 
      tintColor: 'white', 
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