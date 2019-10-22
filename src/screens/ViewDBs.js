import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Picker,
  Dimensions,
  TouchableOpacity, StatusBar,
  StyleSheet, Image,
  ActivityIndicator, Modal,
  FlatList, Platform, ActionSheetIOS
} from 'react-native';
import { colors } from '../config/styles'

import Axios from 'axios';

import constants from '../config/constants'

import LoadImage from '../components/LoadImage';
import Images from '../config/images/index'
import useGlobalState from '../State'

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const SORTS = [
  "cancel",
  "-date",
  "type",
];
SORTNames = [
  "Cancel",
  "Date",
  "Type"
]
const LIMIT = [
  "Cancel",
  "10",
  "20",
  "30",
  "50"
];

export default ViewDBs = ({navigation}) => {

    const [data, setData] = useState([])
    const [refresh, setFresh] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("-data")
    const [sortType, setSortType] = useState("Date")
    const [showing, setShowing] = useState("")
    const [number, setNumber] = useState(20)
    const [modal2Visible, setModal2Visible] = useState(false)

    const [{userId}, actions] = useGlobalState()

    useEffect(()=> {
        getDriveBys()
    },[])

    const getDriveBys = () => {
        var url = constants.ip + ':3210/data/drivebys/byUserId';
        if(userId){ 
            Axios.post(url, {
                id: userId,
                limit: Number(number),
                sort: sort
            }).then(({data}) => {
                if(data.response == 0){
                    setData(data.docs)
                    setFresh(!refresh)
                    setLoading(false)
                } else {
                    console.log("err", data);
                }
            })
        }
    }

    const showPic = () => {
        if (modal2Visible) {
        var pic = showing;
        return (
            <TouchableOpacity style={{ flex: 1, width: WIDTH, height: HEIGHT, justifyContent: 'space-around', alignContent: 'space-around', marginTop: 0 }} onPress={() => setModal2Visible(false)}>
            <View style={[styles.container, { marginTop: 0, alignContent: 'space-around', alignItems: 'center' }]}>
                <LoadImage style={{ height: HEIGHT * .8, width: WIDTH * .8, resizeMode: 'contain' }} source={{ uri: pic }} />
            </View>
            </TouchableOpacity>
        )
        }
    }
    const listItem = ({ item }) => {
        if(item){
        const d = new Date(item.date)
        return (
            <View style={{ flex: 1, borderBottomColor: 'white', borderBottomWidth: 1, width: WIDTH }}>
            <View style={{ flex: 1, flexDirection: 'row', margin: 5 }}>
                <TouchableOpacity
                    style={{ flex: 1, marginTop: 10, justifyContent: 'space-around', alignItems: 'center', borderWidth: 3, borderRadius: 10, borderColor: colors.SECONDARY_BACKGROUND }}
                    onPress={() => {
                        setShowing(item.picturePath)
                        setModal2Visible(true)
                    }}
                >
                <Text style={{ textAlign: 'center', color: 'white' }}>Press to See Picture</Text>
                </TouchableOpacity>
                <View style={{ flex: .5 }} />
                <View style={{ marginTop: 10, flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text style={{ textAlign: 'left', color: 'white' }}>
                    {"Date Found: " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear()}
                </Text>
                <Text style={{ textAlign: 'left', color: 'white' }}>
                    {"Type: " + item.type}
                </Text>
                <Text style={{ textAlign: 'left', color: 'white' }}>
                    {"Vacant? " + (item.vacant == true ? "Yes" : "No")}
                </Text>
                <Text style={{ textAlign: 'left', color: 'white' }}>
                    {"Burned? " + (item.burned == true ? "Yes" : "No")}
                </Text>
                <Text style={{ textAlign: 'left', color: 'white' }}>
                    {"Boarded? " + (item.boarded == true ? "Yes" : "No")}
                </Text>
                </View>
            </View>
            <Text style={{ textAlign: 'center', padding: 10, fontSize: 18, color: 'white' }}>{item.address}</Text>
            </View>
        )
        }
    }

    const dateSort = async () => {
        setSort("-date")
        setSortType("Date")
        getDriveBys()
    }

    const typeSort = async () => {
        setSort("type")
        setSortType("Type")
        getDriveBys()
    }

    const onSelectSort = () => {
        ActionSheetIOS.showActionSheetWithOptions({ 
            options: SORTNames,
            cancelButtonIndex: 0,
        },
        (index) => {
            if(index != 0){
                setSort(SORTS[index])
                setSortType(SORTNames[index])
                getDriveBys()
            }
        });
    } 

    const onSelectLimit = () => {
        ActionSheetIOS.showActionSheetWithOptions({ 
            options: LIMIT,
            cancelButtonIndex: 0,
        },
        (index) => {
            if(index != 0){
                setNumber(LIMIT[index])
                getDriveBys()
            }
        });
    } 

    const HeaderBar = () => {
        if(Platform.OS === "android"){
        return(
            <View style={{ width: '100%', height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.SECONDARY_BACKGROUND }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>{"Sort By: "}</Text>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>{sortType}</Text>
            <Picker
                selectedValue={sort}
                style={{ height: 50, width: 50 }}
                onValueChange={(item, index) => {
                switch (item) {
                    case "Date":
                    dateSort()
                    break;
                    case "Type":
                    typeSort()
                    break;
                    default:
                    break;
                }
                }}
            >
                <Picker.Item label="None" value="" />
                <Picker.Item label="Date" value="Date" />
                <Picker.Item label="Type" value="Type" />
            </Picker>
            <View style={{ flex: .5 }} />
            <Text style={{ color: 'white', textAlign: 'right', fontSize: 18 }}>{"Show: " + number}</Text>
            <Picker
                selectedValue={number}
                style={{ height: 50, width: 50 }}
                onValueChange={(item, index) => {
                    setNumber(item)
                    getDriveBys()
                }}
            >
                <Picker.Item label="10" value={10} />
                <Picker.Item label="20" value={20} />
                <Picker.Item label="30" value={30} />
                <Picker.Item label="50" value={50} />
            </Picker>
            </View>
        )
        } else if(Platform.OS === "ios") { 
        return(
            <View style={{ width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.SECONDARY_BACKGROUND }}>
            <TouchableOpacity onPress={onSelectSort}>
                <Text style={{color: 'white', textAlign: 'right', fontSize: 18 }}>
                {"Sort By: " + sortType}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSelectLimit}>
                <Text style={{color: 'white', textAlign: 'right', fontSize: 18 }}>
                {"Showing: " + number}
                </Text>
            </TouchableOpacity>
            </View>    
        )
        }
    }

    return loading ? (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='dark-content' />
      </View >
    ) : (
      <View style={[styles.container, modal2Visible ? { opacity: .8 } : {}]}>
        <Modal
          animationType='fade'
          transparent={true}
          presentationStyle="overFullScreen"
          visible={modal2Visible}
          onRequestClose={() => { () => setModal2Visible(false) }}>
          {showPic()}
        </Modal>
        <Image source={Images.psBackground} style={styles.background} />
        <HeaderBar/>
        <View style={{ flex: 3, alignContent: 'center', justifyContent: 'space-around' }}>
          <FlatList
            data={data}
            extraData={refresh}
            renderItem={listItem}
            keyExtractor={(item, index) => {return item ? item._id : index.toString() }}
            showsVerticalScrollIndicator={false}
            windowSize={31}
            removeClippedSubviews={true}
            initialNumToRender={number / 2}
          />
        </View>
        <View style={{ marginBottom: Platform.OS === "ios" ? 25 : 0 }} />
      </View>
    )
}

ViewDBs.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Drivebys"
      ),
      headerTransparent: true,
    }
  };

const styles=StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  button: {
    width: '50%',
    height: 100,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
})