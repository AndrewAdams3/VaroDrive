import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import images from '../config/images'

const { height, width } = Dimensions.get("screen")
export default Screen = ({children, bg}) => {
    return(
        <View style={{flex: 1, width: "100%"}}>
            { bg && <Image source={images.psBackground} style={{position: "absolute", top: 0, left: 0, height: "100%", width: width}}/> }
            {children}
        </View>
    )
}