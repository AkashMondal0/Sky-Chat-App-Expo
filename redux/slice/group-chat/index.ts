import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { localhost } from '../../../keys';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';
import { GroupConversation } from '../../../types/private-chat';

export const createGroup = createAsyncThunk(
    'createGroup/fetch',
    async (data: {
        name: string
        description: string,
        picture: string,
        members: string[],
        authorId: string[0]
    }, thunkApi) => {
        try {
            const image = data?.picture ? await skyUploadImage([data.picture], data.authorId).then(res => res.data[0]) : null
            const _data = {
                users: [...data.members, data.authorId],
                name: data.name,
                description: data.description,
                authorId: data.authorId,
                picture: image
            }
            const response = await axios.post(`${localhost}/groupConversation/chat/connection`, _data);
            return response.data
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const getGroupChatList = createAsyncThunk(
    'getGroupChatList/fetch',
    async (token: string | null, thunkApi) => {
        try {

            const response = await axios.get(`${localhost}/groupConversation/chat/list/`, {
                headers: {
                    token: token ? token : await AsyncStorage.getItem("token")
                }
            });
            return response.data?.groupChatList || []
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);


export interface Profile_State {
    loading: boolean
    error: string | null
    groupChatList: GroupConversation[]
}

const initialState: Profile_State = {
    loading: false,
    error: null,
    groupChatList: []
}

export const Profile_Slice = createSlice({
    name: 'Profile',
    initialState,
    reducers: {
        setAllGroupChatList: (state, action: PayloadAction<GroupConversation[]>) => {
            state.groupChatList = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroup.pending, (state) => {
                state.loading = true
            })
            .addCase(createGroup.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(createGroup.rejected, (state) => {
                state.loading = false
            })
            .addCase(getGroupChatList.pending, (state) => {
                state.loading = true
            })
            .addCase(getGroupChatList.fulfilled, (state, action) => {
                state.loading = false
                state.groupChatList = action.payload
            })
            .addCase(getGroupChatList.rejected, (state) => {
                state.loading = false
            })
    },
})

// Action creators are generated for each case reducer function
export const {
    setAllGroupChatList
} = Profile_Slice.actions

export default Profile_Slice.reducer