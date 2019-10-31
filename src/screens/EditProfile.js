import React, { useReducer, useEffect } from 'react';
import {
  View, Text,
  Platform,
  StyleSheet, Image,
  ScrollView, TextInput,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker'
import axios from 'axios';

import colors from '../config/styles/colors'
import ImageButton from '../components/ImageButton.js';
import useGlobalState from '../State'
import Images from '../config/images'

const initialState = {     
    _city: "",
    _state: "",
    _post: {},
    _fName: "",
    _lName: "",
    _email: "",
    _profilePic: ""
};

function reducer(state, action) {
  switch (action.type) {
    case '_fName': return {...state, _fName: action.value};
    case '_lName': return {...state, _lName: action.value};
    case '_city': return {...state, _city: action.value};
    case '_email': return {...state, _email: action.value};
    case '_state': return {...state, _state: action.value};
    case '_picture': return {...state, _profilePic: action.value };
    case '_post': return {...state, _post: action.value };
    default: throw new Error();
  }
}

export default EditProfile = ({navigation}) => {

    const [{fName, lName, city, State, profilePic, email, userId}, actions] = useGlobalState()
    useEffect(()=>{
        dispatch({type: "_picture", value: profilePic})
    },[profilePic])

    const [_state, dispatch] = useReducer(reducer, initialState);

    const submitChanges = () => {
        var url = constants.ip + ':3210/data/users/update';
        var fName = _state["_fName"] === undefined ? fName : _state["_fName"]
        var lName = _state["_lName"] === undefined ? lName : _state["_lName"]
        var email = _state["_email"] === undefined ? email : _state["_email"]
        var city = _state["_city"] === undefined ? city : _state["_city"]
        var state = _state["_state"] === undefined ? State : _state["_state"]
        axios.put(url, {
            id: userId,
            fName: fName,
            lName: lName,
            email: email,
            city: city,
            state: state,
        }).then((res) => {
            actions.setUserInfo({ 
                fName: fName, 
                lName: lName, 
                email: email, 
                city: city, 
                state: state 
            })
        })
        submitPic()
        navigation.navigate("Profile")
    }

    const openCamera = () => {
        ImagePicker.launchImageLibrary({}, async (response) => {

        if (response.didCancel) {
            return
        } else if (response.error) {
            return
        } else if (response.customButton) {
        } else {
            //const source = { uri: response.uri };
            // You can also display the image using data:
            const source = { uri: 'data:image/jpeg;base64,' + response.data };

            const data = new FormData();
            data.append('name', 'avatar');
            data.append('image', {
                uri: response.uri,
                type: response.type,
                name: response.fileName
            });
            data.append('type', "profilPic");
            if (source != "") {
                dispatch({type: "_post", value: data})
            }
        }
        });
    }

    const submitPic = async () => {
        var url = constants.ip + ':3210/data/users/profilePic';

        const config = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            body: _state._post,
        };
        console.log("config", config)
        await axios.post(url, _state._post, config).then(async ({data}) => {
        if (data.response == 0) {
            url = constants.ip + ':3210/data/users/profilePic';
            await axios.put(url, {
                value: data.path,
                id: userId
            }).then((res2) => {
            if (res2.data.success) {
                var p = data.path.replace(/\\/g, "/");
                dispatch({type: "_picture", value: p})
                actions.setUserInfo({profilePic: p})
            }
            }).catch((err) => {
            
            })
        }
        }, (err) => {
            console.log("err posting", err)
        })
    }

    const Pic = () => {
        return(
        <ImageButton onPress={openCamera} style={{ flex: 1, margin: 15, justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center' }}>
            <FastImage
            onError={() => {
                dispatch({type: "_picture", value: "file/uploads/profilePics/default.png"})
            }}
            style={styles.profilePic}
            source={{uri:(constants.ip + ':3210/' + _state._profilePic)}}
            resizeMode="cover"
            />
        </ImageButton>
        )
    }

    const Field = ({title, type}) => {
        return (
            <View style={[styles.inputContainer, {width: '80%'}]}>
                <TextInput
                    style={styles.tInput}
                    placeholder={title + "..."}
                    returnKeyType={"done"}
                    placeholderTextColor={"white"}
                    onChangeText={(text) => dispatch({type: type, value: text})}
                    value={_state[type]}
                    maxLength={type === "_state" ? 2 : null}
                />
            </View>
        )
    }

    const ShowChanges = (p) => {
        return(
        <View style={styles.field}>
            <View style={styles.resultContainer}>
                <Text numberOfLines={1} style={{ color: 'white', textAlign: "left" }}>{p.old || (p.title + "...")}</Text>
            </View>
            <Image source={Images.trighticon} style={styles.indicator} />
            <View style={[styles.resultContainer, { padding: 10, borderColor: _state[p.type] ? 'green' : colors.PRIMARY_BACKGROUND}]}>
                <Text numberOfLines={1} style={{color: 'white', textAlign: "left"}}>{_state[p.type] || p.old}</Text>
            </View>
        </View>
        )
    }

    return(
      <View style={styles.container}>
        <ScrollView>
           <View style={styles.main}>
            <Pic />
            {Field({title: "First Name", type: "_fName"})}
            {Field({title: "Last Name", type: "_lName"})}
            {Field({title: "Email", type: "_email"})}
            {Field({title: "City", type: "_city"})}
            {Field({title: "State", type: "_state"})}
            <Text style={styles.confirm}>Confirm Changes</Text>
            <ShowChanges title="First Name" old={fName} type="_fName"/>
            <ShowChanges title="Last Name" old={lName}  type="_lName"/>
            <ShowChanges title="Email" old={email}  type="_email"/>
            <ShowChanges title="City" old={city}  type="_city"/>
            <ShowChanges title="State" old={State}  type="_state"/>
          </View>
          <View style={[styles.buttonsContainer, { margin: 0 }]}>
            <TouchableOpacity style={styles.button} onPress={submitChanges}>
              <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: Platform.OS === "ios" ? 25 : 0}}/>
        </ScrollView>
      </View>
    )
}

EditProfile.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Edit Profile"
      ),
      //headerTransparent: true,
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
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  main: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  field: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  inputContainer: {
    margin: 5,
    padding: 10,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  resultContainer: {
    flex: .5,
    margin: 5,
    width: '40%',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tInput: {
    height: 50,
    color: 'white',
    width: "100%"
  },
  indicator: {
    height: 30,
    width: 30,
    tintColor: 'white',
    alignSelf: 'center',
  },
  confirm: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    padding: 15
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
  profilePic: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    alignSelf: 'center'
  },
})