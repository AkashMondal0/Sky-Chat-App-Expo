export type Theme = "light" | "dark" | "system";
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setThemeLoaded } from "@/redux/slice/theme";
import { useColorScheme } from 'react-native';
import { localStorage } from '@/lib/LocalStorage';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const deviceThemeSchema = useColorScheme()
    const dispatch = useDispatch()
    const themeLoaded = useSelector((state: RootState) => state.ThemeState.themeLoaded)


    const GetLocalStorageThemeValue = useCallback(async () => {
        const localValueSchema = await localStorage("get", "skysolo-theme")
        const localValueTheme = await localStorage("get", "skysolo-theme-name")
        dispatch(setThemeLoaded({
            userThemeName: "Violet",
            userColorScheme: "light"
        }))
    }, [])

    useEffect(() => {
        if (themeLoaded) {
            console.log("Theme Loaded", themeLoaded)
            SplashScreen.hideAsync()
        }
    }, [themeLoaded])

    useEffect(() => {
        console.log("Theme Provider")
        GetLocalStorageThemeValue()
    }, [])


    return <>
        {children}
    </>
}


export default ThemeProvider;