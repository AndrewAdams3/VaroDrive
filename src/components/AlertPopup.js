import React from 'react';
import { View, Alert } from 'react-native';

export default AlertPopup = (title, stitle) => {
    Alert.alert(
        title,
        stitle,
        [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            { text: 'OK', onPress: () => {}},
        ],
        { cancelable: false },
    ) 
}