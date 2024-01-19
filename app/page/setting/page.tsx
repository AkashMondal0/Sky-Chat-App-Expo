import React, { useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, CircleDashed, LogOut, Palette, Pencil } from 'lucide-react-native';
import { RootState } from '../../../redux/store';
import Padding from '../../../components/shared/Padding';
import SingleCard from '../../../components/shared/Single-Card';
import MultipleCard from '../../../components/shared/Multiple-card';
import ItemCard from './components/Item-Card';
import { resetProfileState } from '../../../redux/slice/profile';
import { resetPrivateChatList } from '../../../redux/slice/private-chat';
import { resetUsersState } from '../../../redux/apis/user';
import { Logout } from '../../../redux/slice/auth';

export default function SettingsScreen({ navigation }: any) {
    const useTheme = useSelector((state: RootState) => state.ThemeMode)
    const dispatch = useDispatch()
    const textColor = useTheme.currentTheme.textColor;
    const iconColor = useTheme.currentTheme.iconColor;
    const titleTextSize = 16;
    const textWeight = "500";


    const handleLogOut = useCallback(() => {
        dispatch(resetProfileState())
        dispatch(resetPrivateChatList())
        dispatch(resetUsersState())
        dispatch(Logout())
        navigation.navigate('home')
    }, [])

    const settings = [
        {
            id: 1,
            typeName: "Account Settings",
            settings: [
                {
                    id: 1,
                    name: "Account",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 3,
                    name: "Privacy and Safety",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 4,
                    name: "Notifications",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 5,
                    name: "Data Usage",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 6,
                    name: "Accessibility",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 7,
                    name: "About",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }
            ]
        },
        {
            id: 2,
            typeName: "App Settings",
            settings: [
                {
                    id: 1,
                    name: "Account",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 3,
                    name: "Privacy and Safety",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 4,
                    name: "Notifications",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 5,
                    name: "Data Usage",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 6,
                    name: "Accessibility",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 7,
                    name: "About",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }
            ]
        },
        {
            id: 3,
            typeName: "Support",
            settings: [
                {
                    id: 1,
                    name: "Account",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 3,
                    name: "Privacy and Safety",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 4,
                    name: "Notifications",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 5,
                    name: "Data Usage",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 6,
                    name: "Accessibility",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 7,
                    name: "About",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }
            ]
        },
        {
            id: 4,
            typeName: "What's New",
            settings: [
                {
                    id: 1,
                    name: "Account",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 3,
                    name: "Privacy and Safety",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 4,
                    name: "Notifications",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                },
                {
                    id: 5,
                    name: "Data Usage",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 6,
                    name: "Accessibility",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }, {
                    id: 7,
                    name: "About",
                    icon: <Palette color={iconColor} />,
                    secondaryIcon: <ChevronRight color={iconColor} />,
                }
            ]
        }
    ]



    return (
        <ScrollView>
            <Padding size={10} />
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginHorizontal: 10,
            }}>
                {/* <MyInput
                    placeholder='Search'
                    icon
                    theme={useTheme.currentTheme} /> */}
                {/* {settings.map((item, index) => (
                    <>
                        <View style={{ width: "100%" }}>
                            <Text style={{
                                fontSize: titleTextSize,
                                fontWeight: textWeight,
                                color: textColor,
                                marginVertical: 10,
                            }}>
                                {item.typeName}
                            </Text>
                        </View>
                        <MultipleCard theme={useTheme.currentTheme}>
                            {item.settings.map((item, index) => (
                                <ItemCard
                                    theme={useTheme.currentTheme}
                                    icon={item.icon}
                                    secondaryIcon={item.secondaryIcon}
                                    name={item.name} />
                            ))}
                        </MultipleCard>
                    </>
                ))
                } */}
                <SingleCard
                    icon={<LogOut color={iconColor} />}
                    label={"Log Out"}
                    onPress={handleLogOut}
                    textColor={useTheme.currentTheme.DangerButtonColor}
                    iconBackgroundColor={useTheme.currentTheme.background}
                    theme={useTheme.currentTheme} />
            </View>
            <Padding size={10} />
        </ScrollView>
    )
}


