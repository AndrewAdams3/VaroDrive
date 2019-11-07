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
  onClock: false
};
 
const actions = {
  login: (store, {user}) => {
    const { _id, fName, lName, loggedIn, profilePic, email, city, state, onClock } = user;
    store.setState({      
      ...store, 
      loggedIn: true,
      userId: _id ? _id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      State: state ? state : store.state.State,
      onClock: onClock || false
    })
  },
  logout: (store) => {
    store.setState(initialState);
  },
  setUserId: (store, id) => {
      store.setState({...store, userId: id})
  },
  setUserInfo: (store, values) => {
    const { id, fName, lName, loggedIn, profilePic, email, city, State, onClock } = values;
    store.setState({      
      ...store, 
      userId: id ? id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      State: State ? State : store.state.State,
      onClock: onClock || false
    })
  },
  setLocation: (store, loc) => {
    store.setState({...store, location: loc});
  },
  setOnClock: (store, val) => {
    Axios.put(`${constants.ip}/data/users/onclock`, {
      id: store.state.userId,
      value: val
    }).catch((err)=>{
      console.log('err', err)
    })
    store.setState({...store, onClock: val})
  }
};
 
export default useGlobal = useGlobalHook(React, initialState, actions);