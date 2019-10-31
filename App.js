import React, { useEffect } from 'react';
import { View } from 'react-native';
import Navigator from './src/navigation/Navigator';
import useTracker from './src/hooks/useTracker';

const App = () => {
  useTracker();
  return (
    <View style={{flex: 1}}>
      <Navigator />
    </View>
  );
};

export default App;
