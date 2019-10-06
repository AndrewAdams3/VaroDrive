import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Dimensions, Image, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import useGlobal from '../State'
import colors from '../config/styles/colors'
import constants from '../config/constants'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height; 
const ACCESS_TOKEN = 'access_token';

export default SignUpScreen = ({navigation}) => {

    const [state, actions] = useGlobal();
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [err, setErr] = useState("")

    logo = require("../config/images/VaroLogo.png");
    bg = require('../config/images/psbackground.png');
    usernameIcon = require('../config/images/usernameIcon.png');
    passwordIcon = require('../config/images/passwordIcon.png');

    const storeToken = async (accessToken) => {
        try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
        } catch (error) {
        }
    }

    const signup = async () => {
      var url = 'https://' + constants.ip + ':3210/data/users/signup';
      if(email != '' && password != ''){
          const expression = /\S+@\S+/
          const valid = expression.test(String(email).toLowerCase())
          if(!valid){
              setErr("Invalid email")
              return;
          }
          await Axios.post(url, {
            email: email,
            password: password
          }).then(({data}) => {
            console.log("su", data)
              if (data.created === true) {
                  storeToken(data.seshId)
                  actions.login(data)
                  navigation.navigate('NotVerified')
              }
              else{
                signup = false
                setErr("Unable to sign up")
              }
            }).catch(function (error) {
              console.log("err", error);
              setErr("Error signing up")
            })
      }
  };
    
  return (
    <View style={styles.container}>
    <Image style={styles.background} source={bg}></Image>
    <View style={{ flex: 1, paddingBottom: 10, width: "100%" }}>
      <View style={{ height: 20 }} />
      <View style={{ flex: 1, width: "100%", justifyContent: 'center' }}>
        <ScrollView scrollEnabled={false} style={{ flex: 1, width: "100%" }}>
          <KeyboardAvoidingView keyboardVerticalOffset={10} behavior="padding" style={{ flex: 1, width: "100%", marginBottom: 60 }}>
            <Image style={[styles.logo, { height: 150 }]} source={logo} />
            <View style={{ flex: 1, paddingTop: 60, width: "100%" }}>
              <View style={{ paddingBottom: 10, width: "100%" }}>
                <Text style={{ alignSelf: 'center', color: "red", paddingBottom: 10 }}>
                  {err}
                </Text>
                <View style={styles.inputContainer}>
                    <Image source={usernameIcon} style={styles.inlineImage} resizeMode="center"/>
                    <TextInput
                        keyboardType="email-address"
                        placeholder="email..."
                        autoCapitalize="none"
                        autoCorrect={false}
                        scale={22}
                        onChangeText={(e)=>setEmail(e)}
                        style={styles.input}
                        placeholderTextColor="rgba(255,255,255,.7)"
                        returnKeyType="done"
                    />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Image source={passwordIcon} style={styles.inlineImage} resizeMode="center"/>
                <TextInput
                    placeholder="password..."
                    autoCapitalize="none"
                    returnKeyType="done"
                    autoCorrect={false}
                    scale={22}
                    secureTextEntry={true}
                    onChangeText={(e)=>setPass(e)}
                    style={styles.input}
                    placeholderTextColor="rgba(255,255,255,.7)"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={signup}>
              <Text style={[styles.buttonText, { fontSize: 18 }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.buttonText, { fontSize: 16 }]}>Already have an accout? Login here</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 35 }} />
        </ScrollView>
      </View>
    </View>
  </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      paddingHorizontal: 15
    },
    background: {
      position: 'absolute',
      height: DEVICE_HEIGHT,
      width: DEVICE_WIDTH,
      opacity: .9,
      overlayColor: 'grey'
    },
    TextContainer: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      paddingTop: 20,
    },
    inputContainer: {
        backgroundColor: colors.SECONDARY_BACKGROUND,
        width: "100%",
        height: 50,
        paddingLeft: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    inlineImage: {
        width: 25, 
        height: 25,
    },
    input: {
        flex: 1,
        color: "white",
        borderLeftWidth: 1,
        borderLeftColor: "rgba(1,1,1,.6)",
        marginLeft: 10,
        paddingLeft: 10
    },
    buttonsContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    button: {
      width: DEVICE_WIDTH - 40,
      height: 50,
      borderRadius: 10,
      backgroundColor: colors.SECONDARY_BACKGROUND,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    ForgotPassbutton: {
      height: 45,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      marginTop: '10%',
      opacity: 1,
      resizeMode: 'contain',
      justifyContent: 'center',
      alignSelf: 'center',
      tintColor: 'white'
    }
  });