import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { skyUploadImage } from '../../../utils/upload-file';
export type Theme = "light" | "dark" | "system"
const SaveTokenLocal = async (token: string) => {
    try {
        await AsyncStorage.setItem('token', token)
    } catch (err) {
        console.log("Error in saving theme from redux async storage", err)
    }
}
const getLocalhost = async () => {
    return AsyncStorage.getItem('mainUrl')
}

export const loginApi = createAsyncThunk(
    'loginApi/fetch',
    async (data: {
        email: string,
        password: string
    }, thunkApi) => {
        try {
            const localhost = await getLocalhost()
            const response = await axios.get(`${localhost}/auth/login`, {
                headers: {
                    email: data.email,
                    password: data.password
                }
            });
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response?.data?.message)
        }
    }
);

export const registerApi = createAsyncThunk(
    'registerApi/fetch',
    async (data: {
        email: string,
        password: string,
        username: string,
        image?: string
    }, thunkApi) => {
        try {
            const localhost = await getLocalhost()
            const response = await axios.post(`${localhost}/auth/register`, data);
            if (response.data?._id, data.image) {
                const url = await skyUploadImage([data.image], response.data._id);
                axios.patch(`${localhost}/profile/update`, {
                    _id: response.data._id,
                    profilePicture: url.data[0]
                })
            }
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response?.data?.message)
        }
    }
);


export interface Auth_State {
    token?: string | null,
    isLogin: boolean
    loading: boolean
    error?: string | null | any
    success?: string | null | any
    HostUrl: boolean
}


const initialState: Auth_State = {
    token: null,
    isLogin: false,
    HostUrl: false,
    loading: false,
    error: null,
    success: null,
}

export const Auth_Slice = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        Login: (state, action: PayloadAction<{
            token: string
        }>) => {
            state.isLogin = true
            state.token = action.payload.token
        },
        Logout: (state) => {
            state.isLogin = false
            state.token = null
        },
        StartServer: (state, action: PayloadAction<{
            token: string
        }>) => {
            state.HostUrl = true
            state.token = action.payload.token
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loginApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginApi.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isLogin = true;
                state.token = action.payload.token;
                SaveTokenLocal(action.payload.token);
            })
            .addCase(loginApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.isLogin = false;
            })
            // register
            .addCase(registerApi.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerApi.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isLogin = true;
                state.token = action.payload.token;
                SaveTokenLocal(action.payload.token);
            })
            .addCase(registerApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
                state.isLogin = false;
            })
            // StartApp
            // .addCase(StartApp.pending, (state, action) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(StartApp.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.error = null;
            //     state.isLogin = true;
            //     state.HostUrl = true;
            //     state.token = action.payload;
            // })
            // .addCase(StartApp.rejected, (state, action) => {
            //     state.error = action.payload;
            //     state.loading = false;
            //     state.isLogin = false;
            // })
            .addDefaultCase((state, action) => {
                state.loading = false;
            });
    },
})

// Action creators are generated for each case reducer function
export const {
    Login,
    Logout,
    StartServer
} = Auth_Slice.actions

export default Auth_Slice.reducer