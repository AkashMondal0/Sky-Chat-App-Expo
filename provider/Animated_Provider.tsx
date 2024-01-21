
import React, { FC, createContext, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface AnimatedContextType {
    SearchList_on: () => void,
    SearchList_off: () => void,
    SearchList_Style: any,
}

const AnimatedContext = createContext<AnimatedContextType>({
    SearchList_on: () => { },
    SearchList_off: () => { },
    SearchList_Style: {},
});

export { AnimatedContext };

interface Animated_ProviderProps {
    children: React.ReactNode
}

const Animated_Provider: FC<Animated_ProviderProps> = ({
    children
}) => {
    const dispatch = useDispatch()
    const ThemeState = useSelector((state: RootState) => state.ThemeMode.currentTheme)
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



    return (
        <AnimatedContext.Provider value={{
            SearchList_on,
            SearchList_off,
            SearchList_Style,
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