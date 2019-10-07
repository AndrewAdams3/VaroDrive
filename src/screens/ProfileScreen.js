import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, Image, Platform
} from 'react-native';
import { colors } from '../config/styles'

import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image'

import constants from '../config/constants' 
import useGlobalState from '../State'
import Images from '../config/images/index'

const ACCESS_TOKEN = 'access_token';

export default ProfileScreen = ({navigation}) => {
    const [{profilePic, fName, userId}, actions] = useGlobalState()
    const [profilepic, setprofilepic] = useState("")

    useEffect(()=>{
        var path = ''
        if(profilePic){
            path = profilePic.split('\\')
            path = path.join('/')
            setprofilepic('https://' + constants.ip + ':3210/' + path)
          }
        else{
          path = 'file/uploads/profilePics/default.png'
          setprofilepic('https://' + constants.ip + ':3210/' + path)
        }
    },[])
    

    const removeToken = async () => {
        try {
            AsyncStorage.setItem(ACCESS_TOKEN, "");
            var url = 'https://' + constants.ip + ':3210/data/users/logout';
            Axios.put(url, {id: userId, value: ""} )
            actions.logout()
            navigation.navigate("Auth")
        } catch (error) {
            console.log(error)
        }
    }
    const capitalize = (string) => {
        return string[0].toUpperCase() + string.slice(1); 
    }

    return (
      <View style={styles.container}>
        <Image source={Images.psBackground} style={styles.background}/>
        <View style={{flex: Platform.OS === 'ios' ? .8 : .5, width: '100%', alignContent: 'center', justifyContent: 'center'}}>          
          <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>{(fName === "") ? ("Welcome!") : ("Hi " + capitalize(fName) + "!")}</Text>
        </View>      
        <View style={styles.mainView}>
          <View style={{ flex: 2, alignContent: 'flex-start', justifyContent: 'flex-start' }}>
            <FastImage
              onError={() => {
                  setprofilepic('https://' + constants.ip + ':3210/' + "file/uploads/profilePics/default.png")
              }}
              style={styles.profilePic}
              source={{ uri: 'https://' + constants.ip + ':3210/' + profilePic }}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity style={{flex: .7, marginBottom: 10, width: '90%', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.PRIMARY_BACKGROUND, borderRadius: 20}} onPress={() => {navigation.navigate("ViewAssignments")}}>
           <Text style={{color: 'white', fontSize: 20}}>
              View Assignments
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: .5, width: '100%'}}>
          <View style={{ flex: .75, marginHorizontal: 5, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: "space-around", alignItems: "center"}}>
            <TouchableOpacity style={styles.bottomButtons} onPress={() => navigation.navigate("ViewDBs")}>
              <Text style={{ color: 'white', fontSize: 20 }}>View Properties</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButtons} onPress={() => navigation.navigate("Edit")}>
              <Text style={{ color: 'white', fontSize: 20 }}>Edit Profile</Text> 
            </TouchableOpacity>
          </View>
          <View style={{ flex: .5, width: '100%'}}>
            <TouchableOpacity onPress={removeToken} style={styles.logoutButton}>
              <Text style={{ color: 'white', fontSize: 15}}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: Platform.OS === 'ios' ? 25 : 0}}/>
      </View>
    );
}

ProfileScreen.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Profile"
      ),
      headerTransparent: true,
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    marginTop: 80,
  },
  background: { 
    position: 'absolute', 
    height: '100%', 
    width: '100%', 
    opacity: .9, 
    overlayColor: 'grey'
  },
  mainView: {
    flex: 1.5, 
    width: '100%', 
    alignContent: 'space-around', 
    justifyContent: 'space-around', 
    alignItems: 'center',
  },
  TextContainer: {
    position: 'absolute',
    bottom: 300,
    width: '100%'
  },
  TextHeader: {
    fontSize: 24,
    color: colors.TEXT_COLOR,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bottomButtons:{
    flex: 1,
    height: "100%",
    margin: 3,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: .9,
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    borderRadius: 10
  }, 
  profilePic: {
    height: 195, 
    width: 195, 
    borderRadius: 101, 
    borderWidth: 3, 
    borderColor: colors.PRIMARY_BACKGROUND,
  },
  logoutButton: { 
    flex: 1, 
    borderWidth: 3, 
    margin: 5, 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    justifyContent: 'space-around', 
    alignContent: 'center', 
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 5
  }
});