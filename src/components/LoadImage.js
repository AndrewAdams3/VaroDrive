import React, { useState } from "react";
import {Image, ActivityIndicator, View} from 'react-native'

export default LoadImage = ({source, style}, rest) => {

    const [show, setShow] = useState(true)


    return(
      <View style={{flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        {show && <ActivityIndicator style={{position: 'absolute'}} />}
        <Image {...rest}
          source={source}
          style={style}
          onLoad={() => setShow(false)}
        />
      </View>
    )
}