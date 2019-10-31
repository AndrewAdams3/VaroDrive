import React, { useEffect } from 'react';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import constants from '../config/constants'
import useGlobal from '../State'

const useTracker = () => {
  const [{userId, onClock},] = useGlobal()

    useEffect(()=>{
      const date = new Date();
      const url_date = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 25,
            distanceFilter: 25,
            debug:false,
            notificationTitle: 'Tracking Location',
            notificationText: 'Enabled',
            startOnBoot: false,
            stopOnTerminate: false,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            pauseLocationUpdates: false,
            activityType: "AutomotiveNavigation",
            saveBatteryOnBackground: true,
            url: `${constants.ip}:3210/location/tracking/${userId}/${url_date}`,
            httpHeaders: {
              'X-FOO': 'bar'
            },
            postTemplate: {
              lat: '@latitude',
              lon: '@longitude',
              speed: '@speed',
            }
          });
       
          BackgroundGeolocation.on('location', (location) => {
              console.log("loc", location)
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
              // execute long running task
              // eg. ajax post location
              // IMPORTANT: task has to be ended by endTask
              BackgroundGeolocation.endTask(taskKey);
            });
          });
       
          BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
          });
       
          BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
          });
       
          BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
          });
       
          BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
          });
//          return () => BackgroundGeolocation.removeAllListeners()
    },[])  

    useEffect(()=>{
      console.log("checking to start")
      if(userId.length && onClock){
        console.log("starting background")
        BackgroundGeolocation.start();
      } else {
        BackgroundGeolocation.stop();
      }
    },[userId, onClock])
}
 
export default useTracker;