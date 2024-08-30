import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ThemeColors from "@/constants/shadcn.color.v1.json"
export type ThemeSchema = "light" | "dark"
export type ThemeNames = "Blue" | "State" | "Stone" | "Zinc" | "Violet"

type Colors = {
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  popover: string;
  popover_foreground: string;
  primary: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  muted: string;
  muted_foreground: string;
  accent: string;
  accent_foreground: string;
  destructive: string;
  destructive_foreground: string;
  border: string;
  input: string;
  ring: string;
  radius?: string;
  chart_1?: string;
  chart_2?: string;
  chart_3?: string;
  chart_4?: string;
  chart_5?: string;
};

export type ThemeState = {
  themeSchema: ThemeSchema | null,
  themeLoaded?: boolean,
  currentThemeName: ThemeNames | null
  currentTheme: Colors | null
  // onlineThemes: Themes[]
}


const initialState: ThemeState = {
  themeSchema: null,
  themeLoaded: false,
  currentThemeName: null,
  currentTheme: null
}

export const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    changeTheme: (state, { payload }: PayloadAction<ThemeSchema>) => {
      state.themeSchema = payload
    },
    setThemeLoaded: (state, { payload: { userColorScheme, userThemeName } }: PayloadAction<{
      userColorScheme: ThemeSchema,
      userThemeName: ThemeNames
    }>) => {
      // console.log("Setting Theme", userColorScheme, userThemeName)
      state.currentTheme = ThemeColors[userThemeName][userColorScheme]
      state.themeLoaded = true
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  changeTheme,
  setThemeLoaded
} = ThemeSlice.actions

export default ThemeSlice.reducer