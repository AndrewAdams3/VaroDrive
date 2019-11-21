import React, { useEffect, useState, useRef, useReducer } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Modal, Text, Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

import { StackActions, NavigationActions } from 'react-navigation';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import useGlobal from '../../State'

import Axios from 'axios';
import Polyline from '@mapbox/polyline';
import constants from '../../config/constants'
import colors from '../../config/styles/colors'
import Images from '../../config/images';
import {useDbContext} from './context/context'

const initialState = {
    pos: {},
    sendPos: "",
    err: "",
    coords: [],
    foundRoute: 0,
    userPos: {},
}

function reducer(state, action) {
    switch(action.type){
        case 'pos':
            return {...state, pos: action.value};
        case 'sendPos':
            return {...state, sendPos: action.value};
        case 'err':
            return {...state, err: action.value};
        case 'coords':
            return {...state, coords: action.value.coords, foundRoute: action.value.found};
        case 'foundRoute':
            return {...state, foundRoute: action.value};
        case 'userPos':
            return {...state, userPos: action.value};
        case 'reset':
            return initialState;
        default:
            throw new Error("action not found")
    }
}

export default function MapScreen({navigation}){

    const [{ pos, sendPos, err, coords, foundRoute, userPos }, dispatch] = useReducer(reducer, initialState)
    const [dbState, dbDispatch] = useDbContext();
    const [showMap, setShowMap] = useState(false)
    const [{onClock}, actions] = useGlobal()
    const mapRef = useRef()

    useEffect(()=>{
        console.log("testing")
        dbDispatch({type: "refresh"})
        const watcher = Geolocation.watchPosition(
            ({coords}) => {
                dispatch({type: "userPos", value: coords})
            },
            (error) => dispatch({type: "err", value: error}),
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 0, distanceFilter: 5 },
          );
        return () => Geolocation.clearWatch(watcher)
    },[])

//     useEffect(()=>{
//         console.log("pos", userPos)
//         const mergeLot = () => {
//             let concatLot = userPos.latitude +","+ userPos.longitude
//             dispatch({type: "sendPos", value: concatLot})
//             getDirections(concatLot, "fresno+ca");
//        }
// //       if(userPos.latitude) mergeLot()
//     }, [userPos])

    // useEffect(()=>{
    //     console.log("onclock", onClock)
    // },[onClock])

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
            dispatch({type: "coords", value: {coords: coords, found: 1}})
            return coords
         } catch(error) {
            dispatch({type: "foundRoute", value: -1})
            return error
         }
    }

    const noShift = () => {
        actions.setOnClock(false)
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        dbDispatch({type: "refresh"})
        navigation.dispatch(resetAction);
    }

    const yesShift = () => {
        setShowMap(true)
        actions.setOnClock(true)
    }

    const onLongPress = React.useCallback((e) => {
        const setLocationByCoords = (lat, lon) => {
            Axios.get(constants.ip + '/location/' + lat + "/" + lon)
            .then( ({data}) => {
                dbDispatch({type: "place", value: {
                    county: data.county,
                    State: data.state,
                    city: data.city,
                    postal: data.postal,
                    street: data.street,
                    address: data.address,
                }})
            })
        }
        if(!!e.nativeEvent.coordinate){
            setLocationByCoords(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
        }
        dbDispatch({type: "coords", value: [e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]})
    },[])

    const regionChange = (e) => {
        console.log("change", e)
    }

    useEffect(()=>{
        if(mapRef.current && !!userPos){
            var camera = {
                center: {
                   latitude: userPos.latitude,
                   longitude: userPos.longitude,
                },
               pitch: 0,
               altitude: userPos.altitude,
               heading: userPos.heading,
               zoom: mapRef.current.zoom
            }
            mapRef.current.animateCamera(camera, {duration: 500})
        }
    }, [userPos])

    return userPos.latitude ? (
        <View style={styles.container}>
            <Modal visible={!onClock} transparent={true} presentationStyle="overFullScreen">
                <View style={{flex: 1, width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <View style={{height: 200, width: "80%", padding: 20, backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20, borderColor: colors.PRIMARY_BACKGROUND, borderWidth:2, shadowColor: colors.SECONDARY_BACKGROUND, shadowRadius:2, shadowOpacity:.8, shadowOffset: {width: 2, height: 2}}}>
                        <View style={{flex: .5, justifyContent: "space-between", width: "100%"}}>
                           <Text style={{fontSize: 20, textAlign:"center", width: "100%"}}>Do you want to start a shift?</Text>
                           <Text style={{fontSize: 12, textAlign: "center", width: "100%"}}>VaroDrive will track your location</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:"row", justifyContent: "space-around", alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={yesShift} style={{flex: 1, height: "50%", backgroundColor: colors.PRIMARY_BACKGROUND, marginRight:10, justifyContent: "center", alignItems:"center", borderRadius:15}}> 
                                <Text style={{color: "white"}} onPress={yesShift}>
                                    Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={noShift} style={{flex: 1, height: "50%", backgroundColor: colors.PRIMARY_BACKGROUND, marginLeft:10, justifyContent: "center", alignItems:"center", borderRadius:15}}> 
                                <Text style={{color: "white"}}>
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {onClock &&
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    onLongPress={onLongPress}
                    provider={PROVIDER_GOOGLE}
                    initialCamera={{
                        center: {
                            latitude: userPos.latitude,
                            longitude: userPos.longitude,
                        },
                        pitch: 20,
                        altitude: userPos.altitude,
                        heading: userPos.heading,
                        zoom: 18,
                    }}
                    onRegionChangeComplete={regionChange}
                    pitchEnabled={false}
                    showsBuildings={true}
                    toolbarEnabled={false}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    showsPointsOfInterest={false}
                    showsIndoors={false}
                    showsIndoorLevelPicker={false}
                >
                 { !!dbState.coords.length &&
                    <Marker coordinate={{latitude: dbState.coords[0], longitude: dbState.coords[1]}}>
                        <View style={{width: 100, heigth: 100, justifyContent: "center", alignItems: "center"}}>
                            {<Text style={{textAlign: "center", width: "100%"}}>{dbState.address}</Text> }
                            <Image source={Platform.OS === "ios" ? Images.markerI : Images.markerA} style={{height: 50, width: 50}} resizeMode="contain" key={"image-marker-key"}/>
                        </View>
                    </Marker>
                }
                {foundRoute === 1 && coords &&
                    <MapView.Polyline
                        coordinates={coords}
                        strokeWidth={2}
                        strokeColor="red"/>
                }
                </MapView>
            }
            <TouchableOpacity onPress={noShift} style={{position:"absolute", top: 20, right: Platform.OS === "android" ? 20 : null, left: Platform.OS === "ios" ? 20 : null, height: 50, width: 100, borderRadius: 25, backgroundColor: colors.PRIMARY_BACKGROUND, justifyContent: "center", alignItems: "center" }}>
                <Text style={{color: "white"}}>End Shift</Text>
            </TouchableOpacity>
            { !!dbState.coords.length &&
                <TouchableOpacity onPress={()=>navigation.navigate("NewDB")} style={{position: "absolute", bottom: 50, left: "50%", marginLeft: -80, width: 160, height: 80, borderRadius: 10, backgroundColor: colors.PRIMARY_BACKGROUND, justifyContent: "center", alignItems: "center"}}>
                    {/* <Image source={Images.plus} style={{height: "50%", width: "50%", tintColor: "white"}} resizeMode={"contain"}/> */}
                    <Text style={{color: "white"}}>Confirm?</Text>
                </TouchableOpacity>
            }
        </View>
    ) : null
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    },
    map: {
        ...StyleSheet.absoluteFill
    }
})