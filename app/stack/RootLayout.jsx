import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from './IndexScreen';
import HomeScreen from './HomeScreen';
import CameraScreen from './CameraScreen';
import SavedMediaPreviewScreen from './SavedMediaPreviewScreen';


const Stack = createNativeStackNavigator();

const RootLayout = () => {
  return (
       <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='Index' component={IndexScreen} />
        <Stack.Screen name='Camera' component={CameraScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='SavedMediaPreview' component={SavedMediaPreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootLayout;
