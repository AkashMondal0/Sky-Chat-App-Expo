import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from '@/components/skysolo-ui';
import { HomeScreen, MessageScreen, CameraScreen } from '@/app/screens';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation }: any) => {

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName='home'
                overScrollMode={'never'}
                screenOptions={{ tabBarStyle: { height: 0 } }}>
                <Tab.Screen name="camera" component={CameraScreen} />
                <Tab.Screen name="home" component={HomeScreen} />
                <Tab.Screen name="message" component={MessageScreen} />
            </Tab.Navigator>
        </View>
    )
}

export default Tabs