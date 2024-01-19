import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../../types/profile';
import axios from 'axios';
import socket from '../../../utils/socket-connect';
import { localhost } from '../../../keys';

export const fetchProfileData = createAsyncThunk(
    'profileData/fetch',
    async (token: string,thunkApi) => {
        try {
            const response = await axios.get(`${localhost}/auth/authorization`, {
                headers: {
                    Authorization: token
                }
            })
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);


const RemoveTokenLocal = async () => {
    try {
        await AsyncStorage.removeItem('token')
    } catch (err) {
        console.log("Error in saving theme from redux async storage", err)
    }
}

export interface Profile_State {
    user?: User | null
    loading?: boolean
    error?: string | null | any
    splashLoading?: boolean
    isLogin?: boolean
}

const initialState: Profile_State = {
    user: null,
    loading: false,
    error: null,
    splashLoading: true,
    isLogin: false
}

export const Profile_Slice = createSlice({
    name: 'Profile',
    initialState,
    reducers: {
        profileUpdate: (state, action: PayloadAction<Profile_State>) => {
            state.user = action.payload.user
        },
        profileSet: (state, action: PayloadAction<Profile_State>) => {
            state.user = action.payload.user
        },
        resetProfileState: (state) => {
            state.user = null
            state.loading = false
            state.error = null
            state.isLogin = false
            RemoveTokenLocal()
        },
        SplashLoading: (state, action: PayloadAction<boolean>) => {
            state.splashLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch authorize profile data
            .addCase(fetchProfileData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.splashLoading = false
                state.isLogin = true
                socket.emit("user_connect", { id: action.payload._id }) // connect to socket
            })
            .addCase(fetchProfileData.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addDefaultCase((state) => {
                state.loading = false;
            });
    },
})

// Action creators are generated for each case reducer function
export const {
    profileUpdate,
    profileSet,
    resetProfileState,
    SplashLoading
} = Profile_Slice.actions

export default Profile_Slice.reducer