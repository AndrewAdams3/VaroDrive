// src/count-context.js
import React from 'react'

const DbStateContext = React.createContext()
const DbDispatchContext = React.createContext()


const initialState = {  
    coords: [],   
    city: "",
    State: "",
    county: "",
    postal: "",
    type: "",
    vacant: false,
    burned: false,
    boarded: false,
    refresh: false,
    avatar: "",
    hasPic : false,
    post: {},
    sending: false,
    address: ""
};

function dbReducer(state, action) {
    switch (action.type) {
      case 'refresh': return initialState;
      case 'coords':return { ...state, coords: action.value}
      case 'city': return {...state, city: action.value};
      case 'state': return {...state, State: action.value};
      case 'county': return {...state, county: action.value};
      case 'postal': return {...state, postal: action.value};
      case 'sending': return action.value ? {...state, sending: action.value} : initialState;
      case 'place':
          const {county, State, city, postal, street, address} = action.value;
          return {
              ...state, 
              city: city,
              street: address,
              State: State,
              county: county,
              postal: postal,
              street: street,
              address: address
          };
      case 'avatar': return {...state, avatar: action.value };
      case 'hasPic': return {...state, hasPic: action.value };
      case 'finishPic': return { ...state, hasPic: action.value.hasPic, post: action.value.post, avatar: action.value.source}
      case 'post': return {...state, post: action.value };
      case 'vacant': return {...state, vacant: action.value };
      case 'burned': return {...state, burned: action.value };
      case 'boarded': return {...state, boarded: action.value };
      case 'type': return {...state, type: action.value };
      case 'street': return { ...state, street: action.value };
      default: throw new Error("Error creating dispatch");
    }
  }  

function DbProvider({children}) {
  const [state, dispatch] = React.useReducer(dbReducer, initialState)
  return (
    <DbStateContext.Provider value={state}>
      <DbDispatchContext.Provider value={dispatch}>
        {children}
      </DbDispatchContext.Provider>
    </DbStateContext.Provider>
  )
}

function useDbState() {
    const context = React.useContext(DbStateContext)
    if (context === undefined) {
      throw new Error('useCountState must be used within a CountProvider')
    }
    return context
  }
  function useDbDispatch() {
    const context = React.useContext(DbDispatchContext)
    if (context === undefined) {
      throw new Error('useCountDispatch must be used within a CountProvider')
    }
    return context
  }

  function useDbContext() {
    return [useDbState(), useDbDispatch()]
  }

export {DbProvider, useDbState, useDbDispatch, useDbContext}