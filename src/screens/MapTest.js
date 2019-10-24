import React, { useState, useEffect, useRef } from "react";
import { AppRegistry, StyleSheet, Dimensions, Image, View, StatusBar, TouchableOpacity } from "react-native";
import Geolocation from 'react-native-geolocation-service'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';


export default function MapTest() {

    const [pos, setPos] = useState();
    const [sendPos, setSendPos] = useState("")
    const [err, setErr] = useState("")
    const [coords, setCoords] = useState([]) 
    const [x, setX] = useState("false")
    const [userPos, setUserPos] = useState({
        lat: 0, lng: 0
    })

    const mapRef = useRef()

    useEffect(()=>{
        Geolocation.getCurrentPosition(
            ({coords}) => {
                setUserPos(coords)
                setErr("")
                mergeLot();
            },
            (error) => setErr(error.message ),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
    },[])

  const mergeLot = () => {
        if (pos.latitude != null && pos.longitude!=null){
            let concatLot = pos.latitude +","+pos.longitude
            setSendPos(concatLot);
            getDirections(concatLot, "fresno+ca");
        }
   }

   const getDirections = async (startLoc, destinationLoc) => {
         try {
             let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${"AIzaSyDkhaLu2W41SraVkn3Y8vANHCsrWAwMmdk"}&origin=${ startLoc }&destination=${ destinationLoc }`)
             let respJson = await resp.json();
             console.log(respJson)
             let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
             let coords = points.map((point, index) => {
                 console.log("point", {
                    latitude : point[0],
                    longitude : point[1] 
                 })
                 return  {
                     latitude : point[0],
                     longitude : point[1]
                 }
             })
             setCoords(coords)
             setX("true")
             return coords
         } catch(error) {
           console.log('masuk fungsi', error)
             setX("error")
             return error
         }
    }

    return userPos.lat && (
      <MapView
        ref={mapRef}
        style={styles.map}
    //                onLongPress={longPress}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
            center: {
                latitude: userPos.latitude,
                longitude: userPos.longitude,
            },
            pitch: 0,
            altitude: userPos.altitude,
            heading: 0,
            zoom: 20,
        }}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
      >

      {/* {!!pos.latitude && !!pos.longitude && <MapView.Marker
         coordinate={{"latitude":pos.latitude,"longitude":pos.longitude}}
         title={"Your Location"}
       />}

       {!!userPos.lat && !!userPos.lng && <MapView.Marker
          coordinate={{"latitude":userPos.lat,"longitude":userPos.lng}}
          title={"Your Destination"}
        />}

       {!!pos.latitude && !!pos.longitude && x == 'true' && <MapView.Polyline
            coordinates={coords}
            strokeWidth={2}
            strokeColor="red"/>
        }

        {!!pos.latitude && !!pos.longitude && x == 'error' && <MapView.Polyline
          coordinates={[
              {latitude: pos.latitude, longitude: pos.longitude},
              {latitude: pos.cordLatitude, longitude: pos.cordLongitude},
          ]}
          strokeWidth={2}
          strokeColor="red"/>
         } */}
      </MapView>
    )
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});