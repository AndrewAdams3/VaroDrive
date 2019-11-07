import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, StyleSheet, Image, Modal, TouchableOpacity, Keyboard, ScrollView, TextInput, Dimensions } from 'react-native';
import axios from 'axios'
import colors from '../config/styles/colors'
import constants from '../config/constants'
import useGlobal from '../State';
import Images from '../config/images/index'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export default UserInfoScreen = ({navigation}) => {

    const [{userId}, actions] = useGlobal();
    const [has_fname, setfname] = useState(false)
    const [has_lname, setlname] = useState(false)
    const [has_city, setCity] = useState(false)
    const [has_state, setState] = useState(false)
    const [formComplete, setFormComplete] = useState(false);
    const [incomplete, setIncomplete] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [temp1, setTemp1] = useState()
    const [temp2, setTemp2] = useState()
    const [temp3, setTemp3] = useState()
    const [temp4, setTemp4] = useState()
    const inputs = useRef({})

    useEffect(()=>{
      setFormComplete(has_fname && has_lname && has_city && has_state)
    }, [has_fname, has_lname, has_city, has_state])

    const submitChanges = () => {
      if(formComplete){
        setIncomplete(false);
        setModalVisible(!modalVisible);
      }else{
        setIncomplete(true);
      }
    }

    const postChanges = () => {
      var url = constants.ip + '/data/users/update';
      axios.put(url, {
        id: userId,
        fName: temp1,
        lName: temp2,
        city: temp3,
        state: temp4,
        complete: true
      }).then((res) => {
        actions.setUserInfo({
          fName: temp1,
          lName: temp2,
          city: temp3,
          state: temp4
        })
        navigation.navigate('App');
      })
    }
    const tryFormComplete = async () => {
      setFormComplete(has_fname && has_lname && has_city && has_state)
    }

    const validateAndSet = async (id) => {
      // Ideally these should be declared in constants.js file
      //const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/;
      const twocharRegex = /^(\w[A-Za-z ]{1,57})/;
      switch (id) {
        case "fname":
          if (temp1 != undefined && temp1 != ""){
            if(twocharRegex.test(temp1)){
              setfname(true)
              await tryFormComplete();
              focusTheField(1)
            }
          }
          else {
            setfname(false)
          }
          break;
        case "lname":
          if (temp2 != undefined && temp2 != ""){
            if (twocharRegex.test(temp2)){
              setlname(true)
              await tryFormComplete();
              focusTheField(2)
            }
          }
          else setlname(false)
          break;
        case "city":
          if (temp3 != undefined && temp3 != ""){
            if (twocharRegex.test(temp3)){
              setCity(true)
              await tryFormComplete();
              focusTheField(3)
            }
          }
          else setCity(false)
          break;
        case "state":
          if (temp4 != undefined && temp4 != ""){
            if (twocharRegex.test(temp4)){
              setState(true)
              await tryFormComplete();
            }
          }
          else setState(false)
          break;
        default:
          break;
      }
    }

    const confirmInfo = () => {
      return(
        <View style={[styles.container, {justifyContent: 'space-around', alignItems: 'center'}]}>
          <View style={{flex: 3, justifyContent: 'space-around'}}>
            <Text style={{color: 'white', fontSize: 18}}>Is the information correct?</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 3}}>
            <Text style={{ color: 'white', fontSize: 18 }}>{"Name: " + temp1 + " " + temp2}</Text>
            <Text style={{ color: 'white', fontSize: 18 }}>{"Location: " + temp3 + ", " + temp4}</Text>
          </View>
          <View style={{flexDirection: 'row', flex: 3}}>
            <View style={{ flex: .4, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
              <TouchableOpacity style={[styles.modalButton, { width: '80%', height: '60%' }]} onPress={postChanges}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: .4, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
              <TouchableOpacity style={[styles.modalButton, { width: '80%', height: '60%' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    // function to focus the field
    focusTheField = (id) => {
      inputs.current[id].focus();
    }

    var allDone = has_fname && has_lname  && has_city && has_state;

    return (
      <View style={styles.container}>
        <Modal
          animationType='fade'
          transparent={true}
          presentationStyle="overFullScreen"
          visible={modalVisible}
          onRequestClose={() => { () => setModalVisible(false)}}>
          {confirmInfo()}
        </Modal>
        <ScrollView 
            scrollEnabled={true}
            contentContainerStyle={{ opacity: modalVisible ? 0 : 1 }}
        >
          <View style={{flex: .3}}>
            <Image source={Images.VaroLogo} style={styles.logo}/>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
            <Text style={{ fontSize: 16, color: incomplete && !allDone ? 'red' : 'white'}}>
              {incomplete && !allDone ? "Please fill in all forms" : "Please fill in your information below"}
            </Text>
          </View>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 16, color: 'white' }}>First Name</Text>
            <View style={[styles.inputContainer, { borderColor: (!has_fname && incomplete) ? 'red' : colors.PRIMARY_BACKGROUND}]}>
              <TextInput
                ref={input => { inputs.current[0] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"First Name"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setTemp1(text)}
                onSubmitEditing={() => validateAndSet("fname")}
                onBlur={() => validateAndSet("fname")}
                autoCorrect={false}
              />
            </View>
            <Text style={{ fontSize: 16, color: 'white' }}>Last Name</Text>
            <View style={[styles.inputContainer, { borderColor: (!has_lname && incomplete) ? 'red' : colors.PRIMARY_BACKGROUND }]}>
              <TextInput
                ref={input => { inputs.current[1] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"Last name"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setTemp2(text)}
                onSubmitEditing={() => validateAndSet("lname")}
                onBlur={() => validateAndSet("lname")}
                autoCorrect={false}
              />
            </View>
            <Text style={{ fontSize: 16, color: 'white' }}>City</Text>
            <View style={[styles.inputContainer, { paddingHorizontal: 10, borderColor: (!has_city && incomplete) ? 'red' : colors.PRIMARY_BACKGROUND }]}>
              <TextInput
                ref={input => { inputs.current[2] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"city"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setTemp3(text)}
                onSubmitEditing={() => validateAndSet("city")}
                onBlur={() => validateAndSet("city")}
                autoCorrect={false}
              />
            </View>
            <Text style={{ fontSize: 16, color: 'white' }}>State (2 Letter Abbreviation)</Text>
            <View style={[styles.inputContainer, { paddingHorizontal: 10, borderColor: (!has_state && incomplete) ? 'red' : colors.PRIMARY_BACKGROUND}]}>
              <TextInput
                ref={input => { inputs.current[3] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"state"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setTemp4(text)}
                onSubmitEditing={() => validateAndSet("state")}
                onBlur={() => validateAndSet("state")}
                maxLength={2}
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={[styles.buttonsContainer, { opacity: formComplete ? 1 : .5}]}>
            <TouchableOpacity style={styles.button} onPress={submitChanges}>
              <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: Platform.OS === "ios" ? 25 : 0}}/>
        </ScrollView>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: HEIGHT
  },
  background: {
    position: 'absolute',
    height: HEIGHT,
    width: WIDTH,
    opacity: .9,
    overlayColor: 'grey'
  },
  logo: {
    height: HEIGHT * .2,
    width: WIDTH * .4,
    opacity: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'white',
  },
  inputContainer: {
    margin: 10,
    width: '80%',
    marginHorizontal: 10,
    borderWidth: 3,
    borderRadius: 5
  },
  inputs: {
    flex: 1,
    width: WIDTH,
//    height: HEIGHT * .45,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonsContainer: {
    height: HEIGHT * .1,
    width: "100%",
    marginTop: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  button: {
    width: "60%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: colors.SECONDARY_BACKGROUND,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10,
    paddingBottom: 30
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
})