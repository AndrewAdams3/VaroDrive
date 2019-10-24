import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'

import useStateCallback from '../hooks/useStateCallback'
import Axios from 'axios';
import Polyline from '@mapbox/polyline';
import constants from '../config/constants'

const AppFonts = {
    regular: 'Akkurat-Normal',
    bold: 'Akkurat-Bold',
    light: 'Akkurat-Light'
};

export default function MapScreen(){

    const [pos, setPos] = useState();
    const [sendPos, setSendPos] = useState("")
    const [err, setErr] = useState("")
    const [coords, setCoords] = useState([]) 
    const [foundRoute, setFoundRoute] = useState(0)
    const [userPos, setUserPos] = useState({})

    const mapRef = useRef()

    useEffect(()=>{
        Geolocation.getCurrentPosition(
            ({coords}) => {
                setUserPos(coords)
                setErr("")
            },
            (error) => setErr(error.message ),
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
          );
    },[])

    useEffect(()=>{
        const mergeLot = () => {
            let concatLot = userPos.latitude +","+ userPos.longitude
            setSendPos(concatLot);
            getDirections(concatLot, "fresno+ca");
       }
       if(userPos.latitude) mergeLot()
    }, [userPos])

   const getDirections = async (startLoc, destinationLoc) => {
         try {
            const url = `https://maps.googleapis.com/maps/api/directions/json?key=${constants.GOOGLE_API_KEY}&origin=${ startLoc }&destination=${ destinationLoc }`
            let { data } = await Axios.get(url)
            let coords = data.routes[0].legs.reduce((carry, curr) => {
                let newPts = curr.steps.map((step)=>{
                    let ps = Polyline.decode(step.polyline.points)
                    let cs = ps.map((p) => ({
                        latitude: p[0],
                        longitude: p[1]
                    }))
                    return cs;
                })
                return [
                    ...carry,
                    ...newPts,
                ];
            }, []).flat()
            setCoords(coords)
            setFoundRoute(1)
            return coords
         } catch(error) {
            console.log('err', error)
            setFoundRoute(-1)
            return error
         }
    }

    return userPos.latitude ? (
        <View style={styles.container}>
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
            {foundRoute === 1 && coords &&
                <MapView.Polyline
                    coordinates={coords}
                    strokeWidth={2}
                    strokeColor="red"/>
            }
            </MapView>
        </View>
    ) : null
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill
    },
    map: {
        ...StyleSheet.absoluteFill
    }
})