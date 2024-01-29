import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../../../types/profile'
import axios from 'axios';
import { localhost } from '../../../keys';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';

export const getFriendStatuses = createAsyncThunk(
  'getFriendStatuses/fetch',
  async (data: {
    profileId: string,
    friendIds: string[],
  }, thunkApi) => {
    try {

      const response = await axios.post(`${localhost}/status/get`, {
        _ids: data.friendIds,
        profileId: data.profileId
      })
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const uploadStatusApi = createAsyncThunk(
  'uploadStatus/fetch',
  async ({
    _id,
    status
  }: {
    _id: string,
    status: Status[]
  }, thunkApi) => {
    try {

      for (let i = 0; i < status.length; i++) {
        if (status[i].type === 'image') {
          status[i].url = await skyUploadImage([status[i].url], _id).then(res => res.data[0])
        } else {
          status[i].url = await skyUploadVideo([status[i].url], _id).then(res => res.data[0])
        }
        status[i].createdAt = new Date().toISOString()
        status[i].seen = []
      }

      const data = {
        _id,
        status
      }
      const response = await axios.post(`${localhost}/status/upload`, data)
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

interface Status_Friends {
  userId: string,
  status: Status[]
}
export interface Status_State {
  friendStatus: Status_Friends[]
  fetchLoading: boolean
  fetchError: string | null
  uploadSuccess: boolean
}


const initialState: Status_State = {
  friendStatus: [],
  fetchLoading: false,
  fetchError: null,
  uploadSuccess: false
}

export const Status_Slice = createSlice({
  name: 'StatusState',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // upload status
      .addCase(uploadStatusApi.pending, (state) => {
        state.fetchLoading = true
        state.fetchError = null
      })
      .addCase(uploadStatusApi.fulfilled, (state, action) => {
        state.uploadSuccess = true
        state.fetchLoading = false
      })
      .addCase(uploadStatusApi.rejected, (state, action) => {
        state.fetchLoading = false
        state.fetchError = action.payload as string
      })
      // fetch profile data
      .addCase(getFriendStatuses.pending, (state) => {
        state.fetchLoading = true
        state.fetchError = null
      })
      .addCase(getFriendStatuses.fulfilled, (state, action) => {
        state.friendStatus = action.payload
        state.fetchLoading = false
      })
      .addCase(getFriendStatuses.rejected, (state, action) => {
        state.fetchLoading = false
        state.fetchError = action.payload as string
      })

  }
})

// Action creators are generated for each case reducer function
export const {

} = Status_Slice.actions

export default Status_Slice.reducer