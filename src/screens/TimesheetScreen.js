import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { colors } from '../config/styles'
import constants from '../config/constants'
import Axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker'
import useGlobalState from '../State'
import Images from '../config/images/index'

export default TimeSheetScreen = ({navigation}) => {
    const [times, setTimes] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedEndDate, setSelectedEndDate] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState(false)
    const [{userId}, actions] = useGlobalState()
    const [refresh, setFresh] = useState(false)

    useEffect(()=>{
        var url = 'https://' + constants.ip + ':3210/data/times/byId/' + userId + "/" + "30";
        Axios.get(url).then(({data}) => {
            setTimes(data)
        })
        return ()=> setModalVisible(false);
    }, [])

  const pad = (size, num) => {
    var sign = Math.sign(num) === -1 ? '-' : '';
    return sign + new Array(size).concat([Math.abs(num)]).join('0').slice(-size);
  }

  const getTotal = (total) => {
    var hour, minute, seconds;
    seconds = Math.floor(total / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    return pad(hour > 99 ? 3 : 2, hour) + ":" + pad(2, minute);
  }
  const msToTime = (duration, running) => {
    if (!running) {
      var d = new Date(duration);
      var hours = d.getHours();
      hours = hours > 12 ? hours - 12 : hours;
      var minutes = d.getMinutes();
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      if (!running) hours = hours == 0 ? 12 : hours;
      return hours + ":" + minutes;
    }
    else {
      var minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
     // hours = (hours > 12) ? hours - 12 : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      return hours + ":" + minutes;
    }
  }

  const listItem = ({item}) => {
    if(item)
      return(
        <View style={styles.listItem}>
          <Text style={styles.listText}>
            {(getDate(item))}
          </Text>
          <Text style={styles.listText}>
            {getStart(item)}
          </Text>
          <Text style={styles.listText}>
            {getEnd(item)}
          </Text>
          <Text style={[styles.listText, {flex: .8}]}>
            {getTotal(item.totalTime)}
          </Text>
        </View>
      )
  }
  const getDate = (item) => {
    var date = new Date(item.startTime);
    return (date.getMonth()+1) + "/" + (date.getDate()) + "/" + date.getFullYear();
  }
  const getStart = (item) => {
    var temp = new Date(item.startTime);
    return item.startTime != -1 ? (msToTime(item.startTime, false) + (temp.getHours() > 12 ? "\nPM" : "\nAM")) : "In Progress"
  }
  const getEnd = (item) => {
    var temp = new Date(item.endTime);
    return item.endTime != -1 ? (msToTime(item.endTime, false) + (temp.getHours() > 12 ? "\nPM" : "\nAM")) : "In Progress"
  }

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
        setSelectedEndDate(new Date(date))
    } else {
        setSelectedStartDate(new Date(date))
        setSelectedEndDate(null)
    }
  }

  const showCalendar = () =>{
    return(
    <View style={{flex: 1, paddingTop: 30}}>
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={onDateChange}
      />
      <View style={[styles.buttonsContainer, { position: 'absolute' }]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={modalClose}>
          <Text style={styles.buttonText}>Close Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }
  const sortDates = () => {
    if(selectedEndDate && selectedStartDate){
      var url = 'https://' + constants.ip + ':3210/data/times/byId/' + userId + "/" + selectedStartDate + "/" + selectedEndDate;
      Axios.get(url).then(({data}) => {
          setTimes(data)
          setFresh(!refresh)
      })
    }
  }

    const modalClose = () => {
        setModalVisible(false)
        sortDates();
    }

  const getTotalTime = () => {
    var total = 0;
    if(times.length){
      times.forEach((time) => {
        if (time) {
          total += time.totalTime
        }
      })
      var hour, minute, seconds;
      seconds = Math.floor(total / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      return `${hour}:${minute}`
    } else {
      return "00:00"
    }
  }

    return(
      <View style={styles.container}>
      <View style={styles.iphoneXTop}/>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={modalClose}>
            {showCalendar()}
        </Modal>
        <View style={styles.topContainer}>
          <View style={styles.selectedDate}>
            <Text style={styles.headerText}>
              {selectedStartDate ? (selectedStartDate.getMonth() + 1) + "/" + selectedStartDate.getDate() + "/" + selectedStartDate.getFullYear() : "Start Date"}
            </Text>
          </View>
          <View style={{width: 2, backgroundColor: 'white'}}/>
          <View style={styles.selectedDate}>
            <Text style={[styles.headerText]}>
              {selectedEndDate ? (selectedEndDate.getMonth() + 1) + "/" + selectedEndDate.getDate() + "/" + selectedEndDate.getFullYear() : "End Date"}
            </Text>
          </View>
        </View>
        <View style={styles.totalTimeContainer}>
          <Text style={styles.headerText}>
            {"Hours Worked: " + getTotalTime()}
          </Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Start</Text>
          <Text style={styles.headerText}>End</Text>
          <Text style={styles.headerText}>Total</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={times}
            extraData={refresh}
            renderItem={listItem}
            keyExtractor={(item, index) => {return item ? item._id : index.toString()}}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={[styles.buttonsContainer, {flex: 1.5}]}>
          <TouchableOpacity style={[styles.button, {width: '80%', height: '80%'}]} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Choose Dates</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

TimeSheetScreen.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Time Sheet"
      ),
      headerTransparent: true,
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  topContainer: {
    backgroundColor: colors.SECONDARY_BACKGROUND, 
    flexDirection: 'row',
    opacity: .9, 
    flex: 1, 
    borderBottomWidth: 2, 
    borderBottomColor: 'white',
    justifyContent: 'space-around', 
    alignContent: 'center'
  },
  selectedDate: { 
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  totalTimeContainer: {
    flex: 1, 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    justifyContent: 'space-around', 
    alignContent: 'center'
  },
  tableHeader: {
    flex: 1, 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9
  },
  listContainer: { 
    marginVertical: 10, 
    flex: 6, 
    alignContent: 'center', 
    justifyContent: 'center' 
  },
  listItem: {
    marginHorizontal: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    borderWidth: 1, 
    borderColor: 'white', 
    justifyContent: 'space-between', 
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
    backgroundColor: colors.SECONDARY_BACKGROUND, 
    opacity: .9
  },
  listText: { 
    textAlign: 'center', 
    fontSize: 18,
    color: 'white',
    flex: 1
  },
  headerText: { 
    fontSize: 24, 
    textAlign: 'center',
    fontWeight: '400',
    color: 'white'
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
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
});