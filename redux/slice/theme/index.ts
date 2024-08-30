import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Colors, ColorsProp, ThemeNames, ThemeSchema } from '@/components/skysolo-ui/colors'


export type ThemeState = {
  themeSchema: ThemeSchema | null,
  themeName: ThemeNames,
  themeLoaded?: boolean,
  currentTheme: ColorsProp | null
  // onlineThemes: Themes[]
}


const initialState: ThemeState = {
  themeSchema: null,
  themeLoaded: false,
  currentTheme: null,
  themeName: "Zinc",
}

export const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    changeTheme: (state, { payload }: PayloadAction<ThemeSchema>) => {
      if (!state.currentTheme) return state
      state.currentTheme = Colors[state.themeName][payload]
      state.themeLoaded = true
    },
    setThemeLoaded: (state, { payload: { userColorScheme, userThemeName } }: PayloadAction<{
      userColorScheme: ThemeSchema,
      userThemeName: ThemeNames
    }>) => {
      // console.log("Setting Theme", userColorScheme, userThemeName)
      state.currentTheme = Colors[userThemeName][userColorScheme]
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