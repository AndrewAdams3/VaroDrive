import React, { useEffect } from 'react';
import { View } from 'react-native';
import Navigator from './src/navigation/Navigator';
import useTracker from './src/hooks/useTracker';
import {DbProvider} from './src/screens/Main/context/context'

const App = () => {
  useTracker();
  return (
    <View style={{flex: 1}}>
      <DbProvider>
        <Navigator />
      </DbProvider>
    </View>
  );
};

export default App;
