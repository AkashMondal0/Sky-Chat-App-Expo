
import React, { FC, createContext, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme, Theme_Toggle_State, changeTheme } from '../redux/slice/theme';
import MyStatusBar from '../components/shared/status-bar';
import { RootState } from '../redux/store';
import { Profile_State, fetchProfileData } from '../redux/slice/profile';
import { Private_Chat_State, addToPrivateChatListMessage, addToPrivateChatListMessageSeen, addToPrivateChatListMessageTyping, getProfileChatList } from '../redux/slice/private-chat';
import { Users_State } from '../redux/apis/user';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import socket from '../utils/socket-connect';
import { PrivateMessage } from '../types/private-chat';
import { Login, Logout } from '../redux/slice/auth';
interface ProfileContextType {
    fetchUserData?: () => void
}

const ProfileContext = createContext<ProfileContextType>({});
export { ProfileContext };

const themeSaveLocal = async (theme: Theme) => {
    try {
        await AsyncStorage.setItem('my-theme', theme)
    } catch (err) {
        console.log("Error in saving theme from redux async storage", err)
    }
}
interface Profile_ProviderProps {
    children: React.ReactNode
}
const Profile_Provider: FC<Profile_ProviderProps> = ({
    children
}) => {
    // const navigation = React.useContext(NavigationContext);
    // const notificationContext = useContext(NotificationContext)
    const dispatch = useDispatch()
    const ThemeState = useSelector((state: RootState) => state.ThemeMode)
    const PrivateChatState = useSelector((state: RootState) => state.privateChat)
    const { isLogin } = useSelector((state: RootState) => state.authState)
    const UsersState = useSelector((state: RootState) => state.users)



    const fetchUserData = useCallback(async () => {
        AsyncStorage.getItem("token")
            .then((token) => {
                if (token && !isLogin) {
                    dispatch(Login({token: token}))
                    dispatch(fetchProfileData(token) as any)
                    dispatch(getProfileChatList(token) as any)
                }
            })
            .catch(() => {
                dispatch(Logout())
            })
            .finally(() => {
                
            })
    }, [])



    const Current_theme = async () => {
        try {
            const value = await AsyncStorage.getItem('my-theme')
            if (value) {
                dispatch(changeTheme(value as Theme))
            }
        } catch (err) {
            console.log("Error in getting theme from redux async storage", err)
        }
    }
    useEffect(() => {
        SplashScreen.hideAsync()
        Current_theme()
        fetchUserData()

        Appearance.addChangeListener(({ colorScheme }) => {
            if (ThemeState.Theme === "system") {
                dispatch(changeTheme(colorScheme as Theme))
                themeSaveLocal(colorScheme as Theme)
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

        socket.on("message_seen_receiver", (data) => {
            dispatch(addToPrivateChatListMessageSeen(data))
        })
        socket.on("message_typing_receiver", (data) => {
            dispatch(addToPrivateChatListMessageTyping(data))
        })

        return () => {
            socket.off("update_Chat_List_Receiver")
            socket.off("message_receiver")
            socket.off("message_seen_receiver")
        }
    }, [])

    return (
        <ProfileContext.Provider value={{
            fetchUserData,
        }}>
            <MyStatusBar translucent />

            {children}
        </ProfileContext.Provider>
    );
};

export default Profile_Provider;