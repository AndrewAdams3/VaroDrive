import React from 'react';
import useGlobalHook from 'use-global-hook';
 
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
    const { _id, fName, lName, loggedIn, profilePic, email, city, State } = user;
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
      State: State ? State : store.state.State
    })
  },
  logout: (store) => {
    store.setState(initialState);
  },
  setUserId: (store, id) => {
      store.setState({...store, userId: id})
  },
  setUserInfo: (store, values) => {
    const { id, fName, lName, loggedIn, profilePic, email, city, State } = values;
    store.setState({      
      ...store, 
      userId: id ? id : store.state.userId,
      fName: fName ? fName : store.state.fName,
      lName: lName ? lName : store.state.fName,
      loggedIn: loggedIn ? loggedIn : store.state.loggedIn,
      profilePic: profilePic ? profilePic : store.state.profilePic,
      email: email ? email : store.state.email,
      city: city ? city : store.state.city,
      State: State ? State : store.state.State
    })
  },
  setLocation: (store, loc) => {
    store.setState({...store, location: loc});
  },
  setOnClock: (store, val) => {
    store.setState({...store, onClock: val})
  }
};
 
export default useGlobal = useGlobalHook(React, initialState, actions);