
import React, { FC, createContext, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Theme, Theme_Toggle_State, changeTheme } from '../redux/slice/theme';
import { CurrentTheme } from '../types/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnimatedContextType {
    SearchList_on?: () => void,
    SearchList_off?: () => void,
    SearchList_Style?: any,
    themeAnimatedStyles?: any,
    changeThemeMode?: (theme: Theme) => void
    ThemeState?: Theme_Toggle_State
}

const AnimatedContext = createContext<AnimatedContextType>({});

export { AnimatedContext };

interface Animated_ProviderProps {
    children: React.ReactNode
}

const Animated_Provider: FC<Animated_ProviderProps> = ({
    children
}) => {
    const dispatch = useDispatch()
    const ThemeState = useSelector((state: RootState) => state.ThemeMode)


    const SearchList = useSharedValue<SearchListType>({
        width: 0,
        height: 0,
        radius: 0,
    })

    const SearchList_Style = useAnimatedStyle(() => {
        return {
            width: withTiming(SearchList.value.width, SearchList_Config),
            height: withTiming(SearchList.value.height, SearchList_Config),
            borderRadius: withTiming(SearchList.value.radius, SearchList_Config),
        };
    });

    const SearchList_on = useCallback(() => {
        SearchList.value = {
            width: "100%",
            height: 60,
            radius: 0,
        }
    }, [])

    const SearchList_off = useCallback(() => {
        SearchList.value = {
            width: 0,
            height: 0,
            radius: 100,
        }
    }, [])

    // theme mode

    const progress = useSharedValue(0);

    const themeAnimatedStyles = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgb(242, 243, 245)', 'rgb(35, 36, 40)'] // interpolate from red to green
        );
        const SecondaryBackgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgb(35, 36, 40)', 'rgb(242, 243, 245)'] // interpolate from red to green
        );

        return { backgroundColor,
            SecondaryBackgroundColor
        };
    });
    

    const changeThemeMode = useCallback((themeValue: Theme) => {

        switch (themeValue) {
            case "light":
                progress.value = withTiming(0, { duration: 600 });
                dispatch(changeTheme("light"))
                break;
            case "dark":
                progress.value = withTiming(1, { duration: 600 });
                dispatch(changeTheme("dark"))
                break;
            default:
                dispatch(changeTheme("system"))
                break;
        }
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('my-theme').then((value) => {
            changeThemeMode(value as Theme)
        })
    }, [])



    return (
        <AnimatedContext.Provider value={{
            SearchList_on,
            SearchList_off,
            SearchList_Style,
            // theme mode
            themeAnimatedStyles,
            changeThemeMode,
            ThemeState
        }}>
            {children}
        </AnimatedContext.Provider>
    );
};

export default Animated_Provider;


interface SearchListType {
    width: string | number | undefined | any,
    height: string | number | undefined | any,
    radius: string | number | undefined | any,
}
const SearchList_Config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
};