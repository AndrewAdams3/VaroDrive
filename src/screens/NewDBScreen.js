import React, { useState, useReducer } from 'react';
import { View, Text, Alert, ScrollView, ActivityIndicator, Platform, TouchableOpacity, StyleSheet, Image, TextInput, TouchableHighlight } from 'react-native';
import { colors } from '../config/styles'
import ImagePicker from 'react-native-image-picker'

import axios from 'axios'
import constants from '../config/constants'
import AlertPopup from '../components/AlertPopup.js'
import useGlobal from '../State'
 
import Geolocation from 'react-native-geolocation-service';


const initialState = {     
    city: "",
    State: "",
    county: "",
    postal: "",
    type: "",
    vacant: false,
    burned: false,
    boarded: false,
    refresh: false,
    avatar: "",
    hasPic : false,
    post: {},
    sending: false,
    address: ""
};

function reducer(state, action) {
  switch (action.type) {
    case 'city': return {...state, city: action.value};
    case 'state': return {...state, State: action.value};
    case 'county': return {...state, county: action.value};
    case 'postal': return {...state, postal: action.value};
    case 'sending': return {...state, sending: action.value};
    case 'place':
        const {county, State, city, postal, street, hasPic, address} = action.value;
        return {
            ...state, 
            city: city,
            State: State,
            county: county,
            postal: postal,
            street: street,
            hasPic: hasPic,
            address: address
        };
    case 'avatar': return {...state, avatar: action.value };
    case 'post': return {...state, post: action.value };
    case 'vacant': return {...state, vacant: action.value };
    case 'burned': return {...state, burned: action.value };
    case 'boarded': return {...state, boarded: action.value };
    case 'type': return {...state, type: action.value };
    case 'street': return { ...state, street: action.value };
    default: throw new Error();
  }
}

export default NewDBScreen = ({navigation}) => {
    const prompts = [
        "House Address",
        "Date Property Was Found",
        "Type of Property",
        "Was the Property Visibly Vacant?",
        "Was it Burned?",
        "Was it Boarded?"
    ]
    const enums = [
        "address",
        "date",
        "type",
        "vacant",
        "burned",
        "boarded" 
    ]
    const [state, dispatch] = useReducer(reducer, initialState)
    const [{userId}, globalActions] = useGlobal();
    const [lat, setLat] = useState()
    const [lon, setLon] = useState()
    const circle = require('../config/images/circle.png');
    const bg = require('../config/images/psbackground.png');
    const addImage = require('../config/images/plus.png');

    const formItem = (num) => {
        var placeholder
        switch(num){
            case 0:
                placeholder = state.hasPic ? state.street : "Address will load after image is taken..."
                break;
            case 1:
                placeholder = new Date().toDateString() + " " + new Date().toTimeString()
                break;
            default:
                placeholder = ""
                break;
        }
        return (
            <View style={{ flex: 1, width: '100%', borderBottomWidth: 2, borderBottomColor: colors.PRIMARY_BACKGROUND, padding: 10 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>{" - " + prompts[num]}</Text>
                <View style={{ marginHorizontal: 10, borderWidth: 3, borderColor: colors.PRIMARY_BACKGROUND, borderRadius: 5 }}>
                    <TextInput
                        style={[{color: 'white', paddingHorizontal: 10}, Platform.OS === "ios" ? {height: 30} : {}] }
                        editable={(placeholder === "Address will load after image is taken..." || num === 1 ) ? false : true}
                        returnKeyType={"next"}
                        placeholder={placeholder}
                        value={num === 0 ? state.street : placeholder}
                        placeholderTextColor={"white"}
                        underlineColorAndroid="transparent"
                        onChangeText={(change) => { dispatch({type: "street", value: change}) }}
                    />
                </View>
            </View>
        )
    }

    const boolItem = (num) => {
        return(
            <View style={{ flex: 1, width: '100%', padding: 10 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>{" - " + prompts[num]}</Text>
                <View style={{ paddingTop: 5, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', marginHorizontal: 10, borderRadius: 5 }}>
                    <TouchableOpacity onPress={() => dispatch({type: enums[num], value: true})} style={[state[enums[num]] ? {backgroundColor: 'green'} : {backgroundColor: colors.PRIMARY_BACKGROUND, opacity: .9}, { paddingVertical: 7, flex: 1, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, borderWidth: 1, borderColor: colors.SECONDARY_BACKGROUND }]}>
                        <Text style={styles.boolText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch({type: enums[num], value: false})} style={[!state[enums[num]] ? { backgroundColor: 'red', opacity: .9 } : { backgroundColor: colors.PRIMARY_BACKGROUND, opacity: .9 }, { paddingVertical: 7, flex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: 1, borderColor: colors.SECONDARY_BACKGROUND, borderLeftWidth: 0 }]}>
                        <Text style={styles.boolText}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    pType = (num) => {
        return(
        <View style={{ flex: 1, width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: colors.PRIMARY_BACKGROUND }}>
            <Text style={{ fontSize: 20, color: 'white' }}>- Type</Text>
            <View style={{ paddingTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginHorizontal: 10, borderRadius: 5 }}>
            <TouchableOpacity onPress={() => dispatch({type: "type", value: "LOT"})} style={{ paddingVertical: 7, flex: 1, width: "100%", flexDirection: 'row' }}>
                <Image source={circle} style={{ height: 20, width: 20, tintColor: state.type === "LOT" ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: Platform.OS === "ios" ? 10 : 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }}/>
                <Text style={styles.formText}>Lot</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch({type: "type", value: "SFR"})} style={{ paddingVertical: 7, flex: 1, width: "100%", flexDirection: 'row' }}>
                <Image source={circle} style={{ height: 20, width: 20, tintColor: state.type === "SFR" ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: Platform.OS === "ios" ? 10 : 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND}} />
                <Text style={styles.formText}>Single-Family Residence</Text>
            </TouchableOpacity>  
            <TouchableOpacity onPress={() => dispatch({type: "type", value: "MFR"})} style={{ paddingVertical: 7, flex: 1, width: "100%", flexDirection: 'row' }}>
                <Image source={circle} style={{ height: 20, width: 20, tintColor: state.type === "MFR" ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: Platform.OS === "ios" ? 10 : 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }} />
                <Text style={styles.formText}>Multi-Family Residence</Text>
            </TouchableOpacity> 
            <TouchableOpacity onPress={() => dispatch({type: "type", value: "COM"})} style={{ paddingVertical: 7, flex: 1, width: "100%", flexDirection: 'row' }}>
                <Image source={circle} style={{ height: 20, width: 20, tintColor: state.type === "COM" ? colors.PRIMARY_BACKGROUND : 'transparent', borderRadius: Platform.OS === "ios" ? 10 : 15, borderWidth: 2, borderColor: colors.PRIMARY_BACKGROUND }} />
                <Text style={styles.formText}>Commercial</Text>
            </TouchableOpacity>          
            </View>
        </View>
        )
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                geoSuccess(position);
            },
            (error) => {
                // See error code charts below.
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    }
    const geoSuccess = ({coords}) => {
        axios.get('http://' + constants.ip + ':3210/location/' + coords.latitude + "/" + coords.longitude)
        .then( ({data}) => {
            dispatch({type: "place", value: {
                county: data.county,
                State: data.state,
                city: data.city,
                postal: data.postal,
                street: data.street,
                hasPic: true,
                address: data.address
            }})
            globalActions.setLocation(data.address)
        })
        setLat(coords.latitude)
        setLon(coords.longitude)
    }

    const openCamera = () => {
        const options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchCamera( options, async (response) => {
            if (response.didCancel) {
                return
            } else if (response.error) {
                return
            } else if (response.customButton) {
            } else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data }
                let imgName = response.fileName;
                if(typeof imgName === "undefined"){
                    var getFileName = response.uri.split('/');
                    imgName = getFileName[getFileName.length - 1];
                }
                const data = new FormData();
                data.append('name', 'avatar');
                data.append('image', {
                    uri: response.uri,
                    type: response.type,
                    name: imgName
                });

                if(source != ""){
                    getCurrentLocation();
                    dispatch({type: "avatar", value: source})
                    dispatch({type: "post", value: data})
                }  
            }
        });
    }

    const showAlreadyAlert = () => {
        Alert.alert(
        'Driveby you entered may already be in our system',
        'Finder\'s bonus can only be given to the original finder of a property',
        [
            {
            text: 'Cancel',
            //onPress: () => props.navigation.navigate("Home"),
            style: 'cancel',
            },
            { text: 'OK'} //onPress: () => props.navigation.navigate("Home") },
        ],
        { cancelable: false },
        );

    }
    const handleSubmit = async () => {
        var url = 'http://' + constants.ip + ':3210/data/drivebys/upload';
        const post = state.post
        const config = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            body: state.post,
        };
        dispatch({type: "sending", value: true})
        if(state.State && state.city && state.street){
            await axios.post(url, post, config ).then( async ({data}) => {
            if (data.response == 0){
                url = 'http://' + constants.ip + ':3210/data/drivebys/newDB';
                await axios.post(url,{
                    path: data.path,
                    id: userId,
                    street: state.address, //user address
                    address: state.street,  //google address
                    date: new Date().getTime(),
                    offset: new Date().getTimezoneOffset(),
                    type: state.type,
                    vacant: state.vacant,
                    burned: state.burned,
                    boarded: state.boarded,
                    lat: lat,
                    lon: lon,
                    city: state.city,
                    state: state.State,
                    county: state.county,
                    post: state.postal,
                }).then( ({data}) => {
                    console.log("res", data)
                if(data.response == 0){
                    if(data.already){
                        showAlreadyAlert();
                    } else navigation.navigate('Home');
                }
                else{
                    AlertPopup("Error Submitting", "Please ensure all fields are filled out and Location Services are turned on");
                }}).catch((err) => { })
            } else{
                AlertPopup("Error Submitting", "Please ensure all fields are filled out and Location Services are turned on");
            } }).catch((err) => {
                AlertPopup("Error Submitting", "Please ensure all fields are filled out and Location Services are turned on");
            })
        }
        dispatch({type: "sending", value: false})
    }

    const MainView = () => {
        return(
            state.sending ?
                <ActivityIndicator 
                style={{flex: 1, width: '100%', height: '100%'}} 
                size='large'/>
            :
            <ScrollView style={{marginTop: 50}}>
                <TouchableOpacity style={{ marginHorizontal: '30%', marginVertical: '10%' }} onPress={openCamera}>
                    <Image source={state.hasPic ? state.avatar : addImage} resizeMode="center" style={{alignSelf: 'center', height: 70, width: 70}} />
                    <Text style={{ marginTop: 20, alignSelf: 'center', fontSize: 20, color: 'white', height: 25 }}>{state.avatar ? "Change Image" : "Add Image"}</Text>
                </TouchableOpacity>
                {formItem(0)}
                {formItem(1)}
                {pType(2)}
                {boolItem(3)}
                {boolItem(4)}
                {boolItem(5)}
                <View style={[styles.buttonsContainer]}>
                <TouchableOpacity style={styles.button} onPress={() => { handleSubmit() }}>
                    <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
                </TouchableOpacity>
                </View>
                <View style={{marginBottom: Platform.OS === "ios" ? 25 : 0}}/>
            </ScrollView>
        )
    }

    return (
      <View style={styles.container}>
        <Image source={bg} style={styles.background} />
        {MainView()}
      </View>
    );
}

NewDBScreen.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "New Drive By"
      ),
      headerTransparent: true,
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  background: {
    position: 'absolute',
    /* height: HEIGHT,
    width: WIDTH, */
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  buttonsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 50,
    width: '50%',
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    opacity: .9,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formText: {
    marginLeft: 20, 
    textAlign: 'center', 
    fontSize: 15, 
    color: 'white',
  },
  boolText: { 
    textAlign: 'center', 
    fontSize: 15, 
    color: 'white' }
});