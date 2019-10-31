import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from 'axios'
import useGlobal from '../State'
import Images from '../config/images/index'

export default NotVerifiedScreen = ({navigation}) => {
    const [verified, setVerified] = useState(true);
    const [{userId}, actions] = useGlobal();

    const isVerified = () => {
      var url = constants.ip + ':3210/data/users/signup/isVerified/' + userId;
      axios.get(url)
        .then( ({data}) => {
          if(data.ok) {
            navigation.navigate('UserInfo');
          }
          else{
            setVerified(false);
          }
        }, (err) => {
          console.log("err verifying", err);
        })
    }

    return(
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity style={{flex: .6}} onPress={isVerified}>
            <Image source={Images.VaroLogo} style={styles.logo} />
          </TouchableOpacity>
          <View style={[styles.container, {flex: .4}]}>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Text style={{ fontSize: 16, textAlign: 'center', color: verified ? 'transparent' : 'red' }}>
                Account has not yet been verified
              </Text>
              <Text style={{ justifyContent: 'space-around', fontSize: 20, textAlign: 'center', color: 'white'}}>
                Please check your email to finish registering your account
              </Text>
              <Text style={{ justifyContent: 'space-around', fontSize: 14, textAlign: 'center', color: 'white', paddingTop: 5, width: "60%" }}>
                (or press the icon if you haven't filled out your personal information)
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{ justifyContent: 'space-around', fontSize: 16, textAlign: 'center', color: 'white' }}>
                Tap the icon once you have verified you email
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  }, 
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  logo: {
    marginTop: '10%',
    opacity: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'white',
    height: '80%'
  },
})