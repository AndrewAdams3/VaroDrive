import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useGlobal from '../State'
import colors from '../config/styles/colors'
import constants from '../config/constants'
import useInterval from '../hooks/useInterval'

import Axios from 'axios';

export default TimeInScreen = ({navigation}) => {

    const [now, setNow] = useState("")
    const [hasClocked, setHasClocked] = useState(false)
    const [onTime, setOnTime] = useState(-1)
    const [offTime, setOffTime] = useState(-1)
    const [{onClock, userId, location}, actions] = useGlobal()
    const [fresh, refresh] = useState(false);

    const newTime = require('../config/images/TimeIn.png');
    const background = require('../config/images/psbackground.png');

    useInterval(() => {
        if(onClock)
            setNow(new Date().getTime() - onTime)
    }, 100);

    useEffect(()=>{
        getOnTime()
        getCurrentLocation()
    },[])
  
    const getCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
        (position) => {
            geoSuccess(position);
        },
        (error) => {
            console.log("error getting location", error);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    }
    const geoSuccess = async ({coords}) => {
        Axios.get('https://' + constants.ip + ':3210/location/' + coords.latitude + "/" + coords.longitude).then(({data}) => {
              actions.setLocation(data.address);
              refresh(!fresh)
          }).catch((err)=>console.log("failed to get loc", err))
    }

    const msToTime = (duration, running) => {
        if(!running){
        var d = new Date(duration);
        var hours = d.getHours();
        hours = hours > 12 ? hours - 12 : hours;
        var minutes = d.getMinutes();
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        if (!running) hours = hours == 0 ? 12 : hours;
        return hours + ":" + minutes;
        }
        else{
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);
        seconds = milliseconds > 5 ? (seconds + 1) : seconds;
        hours = (hours < 10) ? "0" + hours : hours;
        hours = (hours > 12) ? hours - 12 : hours;
        if (!running) hours = hours == 0 ? 12 : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
        }
    }

    const setUserOnClock = (on) => {
        var url = 'https://' + constants.ip + ':3210/data/users/onclock';
        Axios.put(url, {
            id: userId,
            value: on
        })
    }

    const confirm = () => {
        onClock ? 
        Alert.alert(
        'End Shift?',
        '',
        [
            {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
            },
            { text: 'Yes', onPress: () => handleOffShift(false) },
        ],
        { cancelable: false },
        )
        :
        Alert.alert(
        'Start Shift?',
        '',
        [
            {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
            },
            { text: 'Yes', onPress: () => handleOnShift() },
        ],
        { cancelable: false },
        );
    }

    const createNewTimeClock = async (time) => {
        var url = 'https://' + constants.ip + ':3210/data/times/newTime';
        await Axios.post(url, {
            id: userId,
            sLocation: location,
            sTime: time.getTime()
        }).catch((err)=>{
            console.log("err creating timeclock", err);
        })
    }

    const finishTimeClock = async () => {
        var url = 'https://' + constants.ip + ':3210/data/times/endTime';
        getCurrentLocation().then(
            Axios.put(url, {
                eLocation: location,
                sTime: new Date(onTime).getTime(),
                id: userId,
                eTime: new Date().getTime()
            })
        )
    }

    const handleOnShift = () => {
        getCurrentLocation().then( (res) => {
            const date = new Date()
            setOnTime(date)
            setHasClocked(true)
            setOffTime(-1)
            createNewTimeClock(date);
            actions.setOnClock(true); //sets onclock prop global
            setUserOnClock(true); //set user to onclock in db
        }).catch( (err) => {
            console.log("err getting location or handling new clock", err);
        });
    }
    const handleOffShift = (onC) => {
        setOffTime(new Date());
        finishTimeClock();
        actions.setOnClock(false); //sets onclock prop global
        setUserOnClock(false); //set user to onclock in db
    }

    const locAlert = () => {
        Alert.alert(
            'No Location Found',
            'Please let your location load',
            [
            {
                text: 'ok',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'retry',
                onPress: getCurrentLocation,
                style: 'default',
            },
            ],
        )
    }

    const clockPress = () => {
        if (location != "")
            confirm();
        else
            locAlert()
    }

    const getOnTime = async () => {
        var url = 'https://' + constants.ip + ':3210/data/times';
        await Axios.post(url, {
            id: userId
        }).then(({data}) => {
            if(data.found){
                setOnTime(data.sTime)
                actions.setOnClock(true)
                setHasClocked(true)
            }
            else{
                actions.setOnClock(false);
            }
        })
    }

    return (
      <View style={styles.container}>
        <Image style={styles.background} source={ background } />
        <View style={{ height: '5%' }} />
        <View style={[styles.container, {paddingLeft: 10, paddingRight: 10}]}>
          <View style={[styles.locationView, {paddingTop: Platform.OS === "ios" ? 80 : 0}]} >
            <Text numberOfLines = {2} style={{ flex: 1, height: 100, flexWrap: 'wrap', color: location ? 'white' : 'transparent', fontSize: 24, textAlign: 'center' }}>
              {location || "\n\n"}
            </Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity 
            style={styles.newTime}
              onPress={ clockPress.bind(this)}
            >
              <Image source={newTime} style={{height: 200, width: 200, resizeMode:'stretch', tintColor: 'white'}} />
            </TouchableOpacity>
            <View style={styles.timeTableContainer}>
              <Text style={[styles.timeTable, {borderRightColor: 'white'}]}>Time In</Text>
              <Text style={styles.timeTable}>Total Time</Text>
              <Text style={[styles.timeTable, {borderLeftColor: 'white'}]}>Time Out</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20}}>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{onTime != -1 ? msToTime(onTime) + (new Date(onTime).getHours() > 11 ? "\nPM" : "\nAM") : "-- : --"} </Text>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{hasClocked == false ? "-- : -- : --" : msToTime(now, true)}</Text>
              <Text style={[styles.timeTableContent, {marginHorizontal: 30}]}>{offTime != -1 ? msToTime(offTime) + (new Date(offTime).getHours() > 11 ? "\nPM" : "\nAM"): "-- : --"}</Text>
            </View>
          </View>
          <View style={[styles.buttonsContainer, { position: 'absolute' }]}>
            <TouchableOpacity style={{ flex: 1, marginBottom: 10, height: 80, alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.PRIMARY_BACKGROUND, borderRadius: 20 }} onPress={() => { navigation.navigate("TimeSheet") }}>
              <Text style={{ color: 'white', fontSize: 20 }}>
                Timesheet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: Platform.OS === "ios" ? 25 : 0}}/>
      </View>
    );
}
TimeInScreen.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Time Clock"
      ),
      headerTransparent: true,
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Platform.OS === "ios" ? 20 : 40
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  locationView: {
    flex: .4,
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '80%',
    
  },
  newTime: {
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    paddingBottom: 20
  },
  timeTableContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    borderRadius: 5 
  },
  timeTable: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 20
  },
  timeTableContent: {
    color: 'white', 
    fontSize: 20, 
    textAlign: 'center'
  },
  TimeButtonContainer: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    justifyContent: 'space-around',
    marginTop: 10,
  }, 
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 30,
    paddingHorizontal: 20
  },
  button: {
    width: '50%',
    height: 100,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center'
  },
});