import { FC, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../types/theme';
import { Search, Settings2, Sun } from 'lucide-react-native';
import { AnimatedContext } from '../../provider/Animated_Provider';
import SearchList from '../../app/page/home/components/SearchList';
import { ProfileContext } from '../../provider/Profile_Provider';

interface HeaderProps {
    theme: CurrentTheme
    navigation?: any
}
const Header: FC<HeaderProps> = ({
    theme,
    navigation
}) => {
    const AnimatedState = useContext(AnimatedContext)
    const profileState = useContext(ProfileContext) as any

    return (
        <>

            <View style={{
                backgroundColor: theme.background,
                elevation: 0,
                height: 60,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        color: theme.primaryTextColor,
                    }}>
                        Chats
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        {
                            profileState.ThemeState.Theme === "light" ?
                                <TouchableOpacity
                                    onPress={() => {
                                        profileState.changeThemeMode("dark")
                                    }}>
                                    <Sun size={30} color={theme.iconColor} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => {
                                        profileState.changeThemeMode("light")
                                    }}>
                                    <Sun size={30} color={theme.iconColor} />
                                </TouchableOpacity>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                AnimatedState.SearchList_on()
                            }}>
                            <Search size={30} color={theme.iconColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                AnimatedState.SearchList_on()
                            }}>
                           <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Setting")
                            }}>
                            <Settings2 size={30} color={theme.iconColor}/>
                        </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default Header;