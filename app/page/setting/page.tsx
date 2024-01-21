import React, { useCallback, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
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
import { AnimatedContext } from '../../../provider/Animated_Provider';

export default function SettingsScreen({ navigation }: any) {
    const useTheme = useSelector((state: RootState) => state.ThemeMode)
    const AnimatedState = useContext(AnimatedContext) as any
    const dispatch = useDispatch()
    const iconColor = useTheme.currentTheme.iconColor;


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
                {/* <SingleCard
                    icon={<Palette color={iconColor} />}
                    label={"Theme System"}
                    onPress={handleLogOut}
                    secondaryIcon={
                        <View style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                        }}>
                            
                        </View>
                    }
                    textColor={useTheme.currentTheme.textColor}
                    iconBackgroundColor={useTheme.currentTheme.background}
                    theme={useTheme.currentTheme} /> */}
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


