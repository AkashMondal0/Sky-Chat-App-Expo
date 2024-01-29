import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../../../types/profile'
import axios from 'axios';
import { localhost } from '../../../keys';
import { skyUploadImage } from '../../../utils/upload-file';

export const fetchProfileData = createAsyncThunk(
  'profileData/fetch',
  async (token: string, thunkApi) => {
    try {
      const response = await axios.post(`${localhost}/auth/authorization`, {
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
        status[i].url = await skyUploadImage([status[i].url], _id).then(res => res.data[0])
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

export interface Status_State {
  friendStatus: Status[]
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
      .addCase(uploadStatusApi.pending, (state) => { })
      .addCase(uploadStatusApi.fulfilled, (state, action) => {
        state.uploadSuccess = true
      })
      .addCase(uploadStatusApi.rejected, (state, action) => {
        state.fetchLoading = false
        state.fetchError = action.payload as string
      })
  }
})

// Action creators are generated for each case reducer function
export const {

} = Status_Slice.actions

export default Status_Slice.reducer