import { configureStore } from '@reduxjs/toolkit'
import ThemeModeReducer from './slice/theme'
import UsersReducer from './apis/user'
import profileReducer from './slice/profile'
import privateChatReducer from './slice/private-chat'
import AuthReducer from './slice/auth'
import NotificationReducer from './slice/notification'
import StatusReducer from './slice/status'

export const store = configureStore({
  reducer: {
    ThemeMode: ThemeModeReducer,
    users: UsersReducer,
    profile: profileReducer,
    privateChat: privateChatReducer,
    authState: AuthReducer,
    notification: NotificationReducer,
    statusState: StatusReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch