import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { colors } from '../config/styles'
import Axios from 'axios';
import useGlobalState from '../State'
import constants from '../config/constants'
import Images from '../config/images/index'


export default ViewAssignments = ({navigation}) => {
    const [{userId}, actions] = useGlobalState()
    const [assignments, setAssignments] = useState([])
    const [task, setTask] = useState({})
    const [activeSections, setActiveSections] = useState([])

    useEffect(()=>{
        populate()
    },[])

    const populate = () => {
        Axios.get('https://' + constants.ip + ':3210/data/assignments/byId/' + userId)
        .then(({ data }) => {
            setAssignments(data)
        })
        Axios.get('https://' + constants.ip + ':3210/data/assignments/target/byId/' + userId)
        .then(({data})=>{
            setTask({...data, length: data.length})
        })
    }

    const openAll = () => {
        let sections = []
        for(var i = 0; i < assignments.length; i++){
            sections.push(i);
        }
        setActiveSections(sections)
    }

    const renderHeader = (ass, _, isActive) => {
        return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{new Date(ass.Date).toLocaleDateString()}</Text>
            <Text style={styles.headerText}>{ass.completed ? "Complete" : "Incomplete"}</Text>
        </View>
        );
    };

  const renderContent = (ass, _, isActive) => {
    return (
      <View
        style={[styles.content]}
      >
      {
        ass.Addresses.map(({address, completed}, index) => {
          return (
            <View key={ass._id + address + index} style={{flex: 1, flexDirection:"row", width: "100%", borderBottomWidth: 2, borderBottomColor: colors.PRIMARY_BACKGROUND}}>
              <Text style={styles.contentStyle}>
                {address}
              </Text>
              <Text style={[styles.contentStyle, {textAlign: "right", color: completed ? "green" : "red"}]}>
                {completed ? "Complete!" : "Incomplete"}
              </Text>
            </View>
          )
        })
      }
      <Text style={[styles.contentStyle, {width: "100%"}]}>{ass.notes}</Text>
      </View>
    )
  }

    return (
      <View style={styles.container}>
        <Image source={Images.psBackground} style={styles.background} />
        <View style={{flex: 1, padding: 5}}>
        { task &&
          <View style={{flex: .3, width: "100%", justifyContent: "flex-start", padding: 5, marginBottom: 10}}>      
                <Text style={{color: "white", fontSize: 20}}>-Current Target: {"\n\t"}<Text style={{fontSize: 22}} adjustsFontSizeToFit={true}>{task.area}</Text></Text>
                <Text style={{color: "white", fontSize: 20}}>-Date Assigned: {"\n\t"}<Text style={{fontSize: 22}}>{new Date(task.date).toLocaleDateString()}</Text></Text>
          </View>
        }
          <View style={{flex: 1}}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={openAll}>
              <Text style={{ textAlign: "center", color: "white" }}>Open All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>setActiveSections([])}>
              <Text style={{ textAlign: "center", color: "white" }}>Close All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            <View style={{height: "100%", flex: 1, marginBottom: 80}}>
              <Accordion
                activeSections={activeSections}
                sections={assignments}
                touchableComponent={TouchableOpacity}
                expandMultiple={true}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={(sections)=> setActiveSections(sections.includes(undefined) ? [] : sections)}
                sectionContainerStyle={{backgroundColor:colors.PRIMARY_BACKGROUND, marginVertical:2, padding:5, borderRadius:5}}
              />
            </View>
          </ScrollView>
          </View>
        </View>
      </View>
    );
}

ViewAssignments.navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "All Assignments"
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
  header: {
    backgroundColor: colors.PRIMARY_BACKGROUND,
    margin: 10,
    width: "100%",
    flexDirection: "row"
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    color: "white",
    width: "50%"
  },
  content: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8
  },
  contentStyle: {
    color: "black",
    width: "50%",
    fontSize: 16
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 50,
    width: '40%',
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});