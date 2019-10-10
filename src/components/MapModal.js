import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import Axios from 'axios'
import colors from '../config/styles/colors'
import useGlobalState from '../State'
import useRotate from '../hooks/useRotate'
import Images from '../config/images'

export default MapModal = ({setLocation, onClose}) => {

    const [pos, setPos] = useState()
    const [lat, setLat] = useState()
    const [lon, setLon] = useState()
    const [markerText, setMarkerText] = useState(true)
    const [addr, setAddr] = useState("Loading address...")
    const [state, globalActions] = useGlobalState()
    const rotate = useRotate(500);

    useEffect(()=>{
        getCurrentLocation()
        return () =>{
            Geolocation.stopObserving();
        }
    },[])
    
    useEffect(()=>{
        if(lat && lon)
            setLocationByCoords(lat, lon)
    },[lat, lon])

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            ({coords}) => {
                setPos(coords)
                setLat(coords.latitude)
                setLon(coords.longitude)
            },
            (error) => {
                // See error code charts below.
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    }

    const setLocationByCoords = (lat, lon) => {
        Axios.get('https://' + constants.ip + ':3210/location/' + lat + "/" + lon)
        .then( ({data}) => {
            setLocation({
                    county: data.state,
                    state: data.county,
                    city: data.city,
                    postal: data.postal,
                    street: data.street,
                    address: data.address,
                    lat: lat,
                    lon: lon
                })
            setAddr(data.address)
            globalActions.setLocation(data.address)
        })
    }

    const longPress = (e) => {
        setLat(e.nativeEvent.coordinate.latitude)
        setLon(e.nativeEvent.coordinate.longitude)
    }

    return pos && lat && lon ? (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onLongPress={longPress}
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
            >
                <Marker coordinate={{longitude: lon, latitude: lat}} onPress={(e)=>setMarkerText(!markerText)}>
                    <View style={{width: 100, heigth: 100, justifyContent: "center", alignItems: "center"}}>
                        {markerText && <Text style={{textAlign: "center", width: "100%"}}>{addr}</Text> }
                        <Image source={Platform.OS === "ios" ? Images.markerI : Images.markerA} style={{height: 50, width: 50}} resizeMode="contain" key={"image-marker-key"}/>
                    </View>
                </Marker>
            </MapView>
            <View style={{position: "absolute", top: 30, width: "100%", height: 60, justifyContent: "center", alignItems: "center"}}>
                <View style={{width: "70%", flex: 1, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: colors.SECONDARY_BACKGROUND, borderRadius: 5}}>
                    <Text style={{width: "100%", textAlign: "center", color: "black", fontSize: 16}}>Long press to choose a location</Text>
                </View>
            </View>
            <View style={{width: "100%", height: 80, position: "absolute", bottom: 30, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={onClose} style={styles.close}>
                    <Text style={{width:"100%", textAlign:"center", color: "white", fontSize: 16}}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
                :
    (
        <View style={{flex: 1, width: "100%", justifyContent: "center", alignItems:"center"}}>
            <Text style={{position: "absolute", width: "100%", top: 50, textAlign: "center", color: "black"}}>Loading location...</Text>
            <Animated.Image source={Images.VaroLogo} style={{width: 200, height: 200, transform:[{rotateZ: rotate}]}} resizeMode="contain" />
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFill
    },
    close: {
        flex: 1,
        width: '50%',
        backgroundColor: colors.PRIMARY_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.SECONDARY_BACKGROUND,
        opacity: .9,
        borderRadius: 10
    },
})