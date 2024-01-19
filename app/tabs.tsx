import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CircleDashed, CircleUserRound, MessageSquareText, Phone, Settings2, Users } from "lucide-react-native"
import StatusScreen from './page/status';
import CallsScreen from './page/calls';
import ProfileScreen from './page/profile/page';
import HomeScreen from './page/home/page';
import { PrivateMessage } from '../types/private-chat';

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation }: any) => {
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const privateChat = useSelector((state: RootState) => state.privateChat)
    const profile = useSelector((state: RootState) => state.profile)

    const seenCount = (messages?: PrivateMessage[]) => {
        return messages?.map(item => {
            if (!item.seenBy.includes(profile?.user?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined).length
    }

    // @ts-ignore
    const totalUnseen = privateChat.List?.filter((item) => seenCount(item?.messages) > 0).length


    return (
        <Tab.Navigator
            sceneContainerStyle={{
                backgroundColor: useTheme.background,
            }}
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: useTheme.primaryTextColor,
                tabBarInactiveTintColor: useTheme.iconColor,
                headerStyle: {
                    backgroundColor: useTheme.background,
                    elevation: 0,
                    height: 100,
                },
                headerTitleStyle: {
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: useTheme.primaryTextColor,
                },
                headerRight: () => {
                    return <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Setting")
                        }}
                        style={{ marginRight: 10 }}>
                        <Settings2 size={30} color={useTheme.iconColor} style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                },
                // tab bar style
                tabBarStyle: {
                    height: 70,
                    elevation: 0,
                    borderTopWidth: 0,
                    backgroundColor: useTheme.primaryBackground,
                },
                tabBarIcon: ({ focused }) => {
                    let iconSize;
                    let iconColor;
                    if (focused) {
                        iconSize = 30;
                        iconColor = useTheme.iconActiveColor;
                    } else {
                        iconSize = 25;
                        iconColor = useTheme.iconColor;
                    }
                    if (route.name === 'Chats') {
                        return <MessageSquareText size={iconSize} color={iconColor} />
                    }
                    else if (route.name === 'Status') {
                        return <CircleDashed size={iconSize} color={iconColor} />
                    }
                    else if (route.name === 'Calls') {
                        return <Phone size={iconSize} color={iconColor} />
                    }
                    else if (route.name === 'Profile') {
                        return <CircleUserRound size={iconSize} color={iconColor} />
                    }
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    paddingBottom: 8,
                },
                // notification badge
            })}>
            <Tab.Screen name="Chats" component={HomeScreen} options={{
                tabBarBadge: totalUnseen,
                tabBarBadgeStyle: {
                    opacity: totalUnseen > 0 ? 1 : 0,
                    fontSize: 14,
                    backgroundColor: useTheme.badge,
                    color: useTheme.color,
                    borderRadius: 50,
                },
            }} />
            <Tab.Screen name="Status" component={StatusScreen} />
            <Tab.Screen name="Calls" component={CallsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarBadge: "new" }} />

        </Tab.Navigator>
    )
}

export default Tabs