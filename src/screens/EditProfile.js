import React, { useState, useReducer } from 'react';
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

const initialState = {     
    _city: "",
    state: "",
    post: {},
    fName: "",
    lName: "",
    email: "",
    profilePic: ""
};

function reducer(state, action) {
  switch (action.type) {
    case 'fName': return {...state, _fName: action.value};
    case 'lName': return {...state, _lName: action.value};
    case 'city': return {...state, _city: action.value};
    case 'state': return {...state, _state: action.value};
    case 'picture': return {...state, _profilePic: action.value };
    case 'post': return {...state, _post: action.value };
    default: throw new Error();
  }
}

export default EditProfile = ({navigation}) => {

    const [{fName, lName, city, state, profilePic, email, userId}, actions] = useGlobalState()

    const [_state, dispatch] = useReducer(reducer, initialState);
    const background = require('../config/images/psbackground.png')
    const right = require('../config/images/trighticon.png')

    const submitChanges = () => {
        var url = 'http://' + constants.ip + ':3210/data/users/update';
        var fName = _state["_fName"] === undefined ? fName : _state["_fName"]
        var lName = _state["_lName"] === undefined ? lName : _state["_lName"]
        var email = _state["_email"] === undefined ? email : _state["_email"]
        var city = _state["_city"] === undefined ? city : _state["_city"]
        var state = _state["_state"] === undefined ? state : _state["_state"]
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

            if (source != "") {
                dispatch({type: "picture", value: data})
                submitPic()
            }
        }
        });
    }

    const submitPic = async () => {
        var url = 'http://' + constants.ip + ':3210/data/users/profilePic';

        const type = "profilePic"
        var post = Post
        post.append('type', type);

        const config = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            body: post,
        };

        await axios.post(url, post, config).then(async ({data}) => {
        if (data.response == 0) {
            url = 'http://' + constants.ip + ':3210/data/users/profilePic';
            await axios.put(url, {
                value: data.path,
                id: userId
            }).then((res2) => {
            if (res2.data.success) {
                var p = data.path.replace(/\\/g, "/");
                actions.setUserInfo({profilePic: p})
            }
            }).catch((err) => {
            
            })
        }
        }, (err) => {
        })
    }

    const Pic = () => {
        return(
        <ImageButton onPress={openCamera} style={{ flex: 1, margin: 15, justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center' }}>
            <FastImage
            onError={() => {
                dispatch({type: "picture", value: "file/uploads/profilePics/default.jpg"})
            }}
            style={styles.profilePic}
            source={{uri:('http://' + constants.ip + ':3210/' + _state["_profilePic"])}}
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
                maxLength={title === "State" ? 2 : null}
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
            <Image source={right} style={styles.indicator} />
            <View style={[styles.resultContainer, { padding: 10, borderColor: _state[p.type] ? 'green' : colors.PRIMARY_BACKGROUND}]}>
                <Text numberOfLines={1} style={{color: 'white', textAlign: "left"}}>{_state[p.type] || p.old}</Text>
            </View>
        </View>
        )
    }

    return(
      <View style={styles.container}>
        <ScrollView>
          <Image source={background} style={styles.background} />
           <View style={styles.main}>
            <Pic />
            <Field title="First Name" type="fName"/>
            <Field title="Last Name" type="lName"/>
            <Field title="Email" type="email"/>
            <Field title="City" type="city"/>
            <Field title="State" type="state"/>
            <Text style={styles.confirm}>Confirm Changes</Text>
            <ShowChanges title="First Name" old={fName} type="_fName"/>
            <ShowChanges title="Last Name" old={lName}  type="_lName"/>
            <ShowChanges title="Email" old={email}  type="_email"/>
            <ShowChanges title="City" old={city}  type="_city"/>
            <ShowChanges title="State" old={state}  type="_state"/>
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