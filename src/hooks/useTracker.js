import React, { useEffect } from 'react'
import BackgroundGeolocation from "react-native-background-geolocation";
import useGlobal from '../State'
import constants from '../config/constants';

export default function useTracker(){
  const { userId, onClock } = useGlobal()[0];

  useEffect(()=>{
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(onLocation, onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);

    BackgroundGeolocation.requestPermission((status)=>{
      console.log("status", status);
    })
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 30,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      //debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      activityType:BackgroundGeolocation.ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      //startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: constants.ip + '/data/tracks/',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
    });
    return BackgroundGeolocation.removeListeners;
  }, [])

  useEffect(()=>{
    if(userId.length && onClock){
      console.log("testing", userId)
      BackgroundGeolocation.setConfig({
        params: {
          userId: userId
        }
      }).then(()=>{
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      })
    } else {
      BackgroundGeolocation.stop()
    }
  },[userId, onClock])

  const onLocation = React.useCallback((location) => {
    console.log('[location] -', location);
  })
  const onError = (error) => {
    console.warn('[location] ERROR -', error);
  }
  const onActivityChange = (event) => {
    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
  }
  const onProviderChange = (provider) => {
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  const onMotionChange = (event) => {
    console.log('[motionchange] -', event.isMoving, event.location);
  }
  
}