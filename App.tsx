import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './redux/store';
import Profile_Provider from './provider/Profile_Provider';
import IntroScreen from './app/page/auth/intro/page';
import Tabs from './app/tabs';
import SettingsScreen from './app/page/setting/page';
import LoginScreen from './app/page/auth/login/page';
import RegisterScreen from './app/page/auth/register/page';
import NewMessageScreen from './app/page/home/newMessage/page';
import ChatScreen from './app/page/[chat]/page';
import Animated_Provider from './provider/Animated_Provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ViewStatusScreen from './app/page/status/ViewStatus/page';
import CameraScreen from './app/page/Camera/page';
import CameraAndMedia_Provider from './provider/CameraAndMedia_Provider';
import PreViewScreen from './app/page/Camera/Preview/page';
import AssetsScreen from './app/page/assets/page';
import ButtonSheet from './provider/ButtomSheet';
import LinkDevice from './app/page/setting/linkDevice/page';
import NewGroup from './app/page/home/newMessage/NewGroup/page';
import GroupChatScreen from './app/page/[group]/page';




function Routes() {
  const { isLogin } = useSelector((state: RootState) => state.authState)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

  const backgroundColor = useTheme.background

  const Options = {
    headerTintColor: useTheme.iconColor,
    headerTitleAlign: 'center',
    animation: "slide_from_right",
    animationDuration: 300,
    headerStyle: {
      backgroundColor: backgroundColor,
    },
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: '800',
      color: useTheme.primaryTextColor,
    },
    contentStyle: {
      backgroundColor: backgroundColor,
      elevation: 0,
      height: 100,
    }
  }

  const Option2 = {
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 300,
    contentStyle: {
      backgroundColor: backgroundColor,
      elevation: 0,
      height: "auto"
    }
  }
  return (
    <Stack.Navigator>
      {/* custom header */}
      <Stack.Screen name="home" component={isLogin ? Tabs : IntroScreen} options={Option2 as any} />
      <Stack.Screen name="login" component={LoginScreen} options={Option2 as any} />
      <Stack.Screen name="register" component={RegisterScreen} options={Option2 as any} />


      <Stack.Screen name="Chat" component={ChatScreen} options={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 300,
        contentStyle: {
          backgroundColor: backgroundColor,
          elevation: 0,
          height: "auto"
        }
      }} />
      <Stack.Screen name="Group_chat" component={GroupChatScreen} options={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 300,
        contentStyle: {
          backgroundColor: backgroundColor,
          elevation: 0,
          height: "auto"
        }
      }} />
      

      {/* header */}
      <Stack.Screen name="linkDevice" component={LinkDevice} options={Options as any} />
      <Stack.Screen name="Message" component={NewMessageScreen} options={Option2 as any} />
      <Stack.Screen name="Setting" component={SettingsScreen} options={Options as any} />
      <Stack.Screen name="ViewStatus" component={ViewStatusScreen} options={Option2 as any} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={Option2 as any} />
      <Stack.Screen name="Preview" component={PreViewScreen} options={Option2 as any} />
      <Stack.Screen name="AssetsScreen" component={AssetsScreen} options={Option2 as any} />
      <Stack.Screen name="NewGroup" component={NewGroup} options={Option2 as any} />
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Provider store={store}>
          <Animated_Provider>
            {/* <CameraAndMedia_Provider> */}
            <Profile_Provider>
              <ButtonSheet>
                <Routes />
              </ButtonSheet>
            </Profile_Provider>
            {/* </CameraAndMedia_Provider> */}
          </Animated_Provider>
        </Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;