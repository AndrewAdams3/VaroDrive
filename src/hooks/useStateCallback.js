import React, { useState } from 'react'

export default function useStateCallback (initialValue = null) {
    const [state, setState] = useState(initialValue);

    const isFunction = (f) => {
        return f && {}.toString.call(f) === '[object Function]';
    }
    const setStateWithCB = (value, cb) => {
        setState(value)
        isFunction(cb) ? cb() : () => {}
    }
    return [state, setStateWithCB];
}