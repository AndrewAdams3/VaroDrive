import React, { useEffect, useRef} from 'react'
import { Animated, Easing } from 'react-native'

export default useRotate = (delay) => {
    const rotate = useRef(new Animated.Value(0)).current;

    const spin = () => {
        Animated.timing(rotate, {toValue: 1, easing: Easing.linear, duration: 1500 }).start(()=>{
            rotate.setValue(0)
            spin()
        })
    }
    useEffect(()=>{
        const timeout = setTimeout(() => spin(), delay);
        return () => clearTimeout(timeout)
    },[])

    return rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })
}