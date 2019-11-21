import React, { useEffect } from 'react'
import BackgroundGeolocation from "react-native-background-geolocation";
import useGlobal from '../State'
import constants from '../config/constants';
import Axios from 'axios';

export default function useTracker(){
  const [{ userId, tracker, onClock }, actions] = useGlobal();

  useEffect(()=>{
    BackgroundGeolocation.requestPermission((status)=>{
      console.log("status", status);
    })
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 30,
      stopTimeout: 1,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      activityType:BackgroundGeolocation.ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION,
      stopOnTerminate: false,
      url: constants.ip + '/data/tracks/',
      batchSync: false,     
      autoSync: true,        
    });
    return BackgroundGeolocation.removeListeners;
  }, [])

  useEffect(()=>{
    if(userId.length && onClock){
      BackgroundGeolocation.setConfig({
        params: {
          userId: userId,
          tracker: tracker
        }
      }).then(()=>{
        BackgroundGeolocation.start();
      }).catch((err)=>console.log('err starting loc', err))
    } else {
      BackgroundGeolocation.stop()
    }
  },[userId, onClock])
}