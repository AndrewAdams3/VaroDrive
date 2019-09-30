import React from 'react';
import useGlobalHook from 'use-global-hook';
 
const initialState = {
  fName: "",
  lName: "",
  city: "",
  state: "",
  email: "",
  profilePic: "",
  loggedIn: false,
  userId: "",
  location: "",
  onClock: false
};
 
const actions = {
  login: (store) => {
      store.setState({loggedIn: true});
  },
  logout: (store) => {
    store.setState({loggedIn: false});
  },
  setUserId: (store, id) => {
      store.setState({userId: id})
  },
  setUserInfo: (store, values) => {
    const { id, fName, lName, loggedIn, profilePic, email, city, state } = values;
    store.setState({      
      userId: id ? id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      state: state ? state : store.state.state
    })
  },
  setLocation: (store, loc) => {
    store.setState({location: loc});
  },
  setOnClock: (store, val) => {
    store.setState({onClock: val})
  }
};
 
export default useGlobal = useGlobalHook(React, initialState, actions);