import React from 'react'
import { View, Platform } from 'react-native'

export default Screen = ({children}, rest) => {
    return(
        <View style={{flex: 1, width: "100%"}}>
            {children}
        </View>
    )
}