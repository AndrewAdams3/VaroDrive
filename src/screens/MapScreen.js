import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'


export default function MapScreen(){

    const [pos, setPos] = useState({})
    const mapRef = useRef()

    useEffect(()=>{

        const getCurrentLocation = () => {
            const watcher = Geolocation.watchPosition(
                ({coords}) => {
                    setPos(coords)
                },
                (error) => {
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
            return watcher
        }

        const watcher = getCurrentLocation()
        return () => Geolocation.clearWatch(watcher);

    },[])

    return pos.latitude ? (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
//                onLongPress={longPress}
                provider={PROVIDER_GOOGLE}
                initialCamera={{
                    center: {
                       latitude: pos.latitude,
                       longitude: pos.longitude,
                    },
                   pitch: 0,
                   altitude: pos.altitude,
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