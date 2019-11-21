import React from 'react';
import useGlobalHook from 'use-global-hook';
import Axios from 'axios';
import constants from './config/constants';
 
const initialState = {
  fName: "",
  lName: "",
  city: "",
  State: "",
  email: "",
  profilePic: "file/uploads/profilePics/default.png",
  loggedIn: false,
  userId: "",
  location: "",
  onClock: false,
  tracker: ""
};
 
const actions = {
  login: (store, {user}) => {
    const { _id, fName, lName, loggedIn, profilePic, email, city, state, onClock, tracker } = user;
    store.setState({      
      ...store.state, 
      loggedIn: true,
      userId: _id ? _id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      State: state ? state : store.state.State,
      tracker: tracker ? tracker : store.state.tracker,
      onClock: onClock || false,
    })
  },
  logout: (store) => {
    store.setState(initialState);
  },
  setUserId: (store, id) => {
      store.setState({...store.state, userId: id})
  },
  setUserInfo: (store, values) => {
    const { id, fName, lName, loggedIn, profilePic, email, city, State, onClock, tracker } = values;
    store.setState({      
      ...store.state, 
      userId: id ? id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      State: State ? State : store.state.State,
      tracker: tracker ? tracker : store.state.tracker,
      onClock: !!onClock
    })
  },
  setLocation: (store, loc) => {
    store.setState({...store.state, location: loc});
  },
  setOnClock: (store, val) => {
    Axios.put(`${constants.ip}/data/users/onclock`, {
      id: store.state.userId,
      value: val
    }).then(()=>{
      if(val){ // logging in
        Axios.post(`${constants.ip}/data/tracks/init`, {
          userId: store.state.userId,
          date: new Date().toLocaleDateString(),
          tracker: store.state.tracker
        }).then(({data})=>{
          store.setState({...store.state, onClock: val, tracker: data.tracker})
        })
      } else { // logging out
        Axios.put(`${constants.ip}/data/tracks/end`, {
          userId: store.state.userId,
          tracker: store.state.tracker
        }).then(()=>{
          store.setState({...store.state, onClock: val, tracker: ""})
        })
      }

    }).catch((err)=>{
      console.log("err clocking", err)
    })
  },
  setTracker: (store, tracker) => {
    store.setState({...store.state, tracker: tracker})
  }
};
 
export default useGlobal = useGlobalHook(React, initialState, actions);