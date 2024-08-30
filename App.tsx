import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { HomeScreen, MessageScreen } from '@/app/screens';
import ThemeProvider from '@/provider/ThemeProvider'

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();


function Routes() {
  // const { isLogin } = useSelector((state: RootState) => state.authState)

  // const backgroundColor = useTheme.background

  // const Options = {
  //   headerTintColor: useTheme.iconColor,
  //   headerTitleAlign: 'center',
  //   animation: "slide_from_right",
  //   animationDuration: 300,
  //   headerStyle: {
  //     backgroundColor: backgroundColor,
  //   },
  //   headerTitleStyle: {
  //     fontSize: 20,
  //     fontWeight: '800',
  //     color: useTheme.primaryTextColor,
  //   },
  //   contentStyle: {
  //     backgroundColor: backgroundColor,
  //     elevation: 0,
  //     height: 100,
  //   }
  // }

  // const Option2 = {
  //   headerShown: false,
  //   animation: "slide_from_right",
  //   animationDuration: 300,
  //   contentStyle: {
  //     backgroundColor: backgroundColor,
  //     elevation: 0,
  //     height: "auto"
  //   }
  // }
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="message" component={MessageScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Root() {
  const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
  // console.log(currentTheme?.accent)
  return (<GestureHandlerRootView style={{ flex: 1, backgroundColor: `hsl(${currentTheme?.destructive})` }}>
    <NavigationContainer>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </NavigationContainer>
  </GestureHandlerRootView>)

}


function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;