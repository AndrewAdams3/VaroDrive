import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  PermissionsAndroid,
  Platform, Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { colors } from '../config/styles';
import constants from '../config/constants'
import useGlobal from '../State'

const ACCESS_TOKEN = 'access_token';

export default LandingScreen = ({navigation}) => {
    const [, actions] = useGlobal();
    const [err, setErr] = useState()
    useEffect(()=>{
        _bootstrapAsync()
        if(Platform.OS === "android") requestLocationPermission()
    },[])

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Cool Location Permission',
            message:
              'Location needs access to your Location ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          setErr("permission not granted")
        }
      } catch (err) {
        setErr("error setting permission")
        console.warn(err);
      }
    }

    const getUser = async (token, returner) => {
      var url = 'https://' + constants.ip + ':3210/data/users/id';
      var res = {
        found: false,
        complete: false,
        verified: false
      }
      await axios.post(url, { seshId: token }).then(({data}) => {
        if(data.ok === 1){
          if(data.userId){
            res.found = true;
            actions.setUserInfo({
              id: data.userId,
              fName: data.fName || "",
              lName: data.lName || "",
              loggedIn: returner,
              profilePic: data.pic.replace(/\\/g, "/") || "",
              email: data.email || "",
              city: data.city || "",
              State: data.state || ""
            })
          }
          if(data.infoComplete){
            res.complete = true
          }
          if(data.isVerified) {
            res.verified = true
          };
        } else {
          console.log("user not found")
        }
      }).catch((err)=>{
        setErr("error getting user")
      })
      return res;
    }
  
    const _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      const returner = userToken ? true : false;
      if(returner){
        const res  = await getUser(userToken, returner)
        if (!res.found) {
          navigation.navigate('Auth');
          return;
        } else if(!res.complete) {
          navigation.navigate("Setup");
          return;
        } else if(!res.verified){
          navigation.navigate("Setup");
        } else navigation.navigate("App");
      }else{
        navigation.navigate('Auth');
      }
    };

    return (
      <View style={{flex: 1,justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.PRIMARY_BACKGROUND}}>
        {err && <Text>{err}</Text> }
        <ActivityIndicator/>
        <StatusBar barStyle='dark-content' />
      </View>
    );
}