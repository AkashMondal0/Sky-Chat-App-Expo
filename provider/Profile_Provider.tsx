
import React, { FC, createContext, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme, Theme_Toggle_State, changeTheme } from '../redux/slice/theme';
import MyStatusBar from '../components/shared/status-bar';
import { RootState } from '../redux/store';
import { Profile_State, fetchProfileData } from '../redux/slice/profile';
import {
    Private_Chat_State, addToPrivateChatListMessage,
    addToPrivateChatListMessageSeen, addToPrivateChatListMessageTyping,
    getProfileChatList
} from '../redux/slice/private-chat';
import { Users_State } from '../redux/apis/user';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ToastAndroid } from 'react-native';
import socket from '../utils/socket-connect';
import { PrivateMessage, PrivateMessageSeen } from '../types/private-chat';
import { Login, Logout } from '../redux/slice/auth';
import NetInfo from '@react-native-community/netinfo'

SplashScreen.preventAutoHideAsync();

interface ProfileContextType {
    fetchUserData?: () => void
    ThemeState?: Theme_Toggle_State
    changeThemeMode?: () => void
}

const ProfileContext = createContext<ProfileContextType>({});
export { ProfileContext };


interface Profile_ProviderProps {
    children: React.ReactNode
}
const Profile_Provider: FC<Profile_ProviderProps> = ({
    children
}) => {
    const dispatch = useDispatch()
    const ThemeState = useSelector((state: RootState) => state.ThemeMode)
    const { isLogin } = useSelector((state: RootState) => state.authState)



    const fetchUserData = useCallback(async () => {
        AsyncStorage.getItem("token")
            .then((token) => {
                if (token && !isLogin) {
                    dispatch(Login({ token }))
                    dispatch(fetchProfileData(token) as any)
                    dispatch(getProfileChatList(token) as any)
                }
            })
            .catch(() => {
                dispatch(Logout())
            })
            .finally(() => {
                SplashScreen.hideAsync()
            })
    }, [])



    const changeThemeMode = useCallback(async (value?:Theme) => {
        try {
            switch (value) {
                case "light":
                    dispatch(changeTheme("light"))
                    break;
                case "dark":
                    dispatch(changeTheme("dark"))
                    break;
                case "system":
                    dispatch(changeTheme("system"))
                    break;
                default:
                    dispatch(changeTheme("system"))
                    break;
            }
        } catch (err) {
            console.log("Error in getting theme from redux async storage", err)
        }
    }, [])

    useEffect(() => {
        changeThemeMode().then(() => {
            fetchUserData()
        })
        // const unsubscribe = NetInfo.addEventListener(state => {
        //     console.log('Connection type', state.type);
        //     console.log('Is connected?', state.isConnected);
        // });

        Appearance.addChangeListener(({ colorScheme }) => {
            if (ThemeState.Theme === "system") {
                dispatch(changeTheme(colorScheme as Theme))
            }
        })
        socket.on("update_Chat_List_Receiver", async () => {
            const token = await AsyncStorage.getItem("token")
            if (token) {
                dispatch(getProfileChatList(token) as any)
            }
        })

        socket.on("message_receiver", (data: PrivateMessage) => {
            // console.log("message_receiver update")
            // if (AppState.currentState === "background") {
            //     // @ts-ignore
            //     notificationContext.onDisplayNotification(data)
            // }
            dispatch(addToPrivateChatListMessage(data))
        })

        socket.on("message_seen_receiver", (data: PrivateMessageSeen) => {
            dispatch(addToPrivateChatListMessageSeen(data))
        })
        socket.on("message_typing_receiver", (data) => {
            dispatch(addToPrivateChatListMessageTyping(data))
        })

        return () => {
            socket.off("update_Chat_List_Receiver")
            socket.off("message_receiver")
            socket.off("message_seen_receiver")
            // unsubscribe();
        }
    }, [])

    return (
        <ProfileContext.Provider value={{
            fetchUserData,
            ThemeState,
            changeThemeMode
        }}>
            <MyStatusBar translucent />

            {children}
        </ProfileContext.Provider>
    );
};

export default Profile_Provider;