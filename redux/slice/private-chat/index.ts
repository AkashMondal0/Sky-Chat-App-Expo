import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PrivateChat, PrivateMessage, PrivateMessageSeen, typingState } from '../../../types/private-chat';
import axios from 'axios';
import socket from '../../../utils/socket-connect';
import { localhost } from '../../../keys';
export type Theme = "light" | "dark" | "system"

export const sendMessagePrivate = createAsyncThunk(
  'sendMessagePrivate/post',
  async ({
    message
  }: {
    message: PrivateMessage
  }, thunkApi) => {
    try {

      // console.log(message)
      thunkApi.dispatch(addToPrivateChatListMessage(message))
      socket.emit('message_sender', message)
      // await axios.post(`${localhost}/PrivateMessage/send`, {
      //   message
      // });
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const sendMessageSeenPrivate = createAsyncThunk(
  'sendMessageSeenPrivate/post',
  async ({
    seen
  }: {
    seen: PrivateMessageSeen
  }, thunkApi) => {
    try {

      // console.log(message)
      socket.emit('message_seen_sender', seen)
      thunkApi.dispatch(addToPrivateChatListMessageSeen(seen))
      // await axios.post(`${localhost}/PrivateMessage/seen`, {
      //   messages: seen
      // });
      // return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const getProfileChatList = createAsyncThunk(
  'chatList/fetch',
  async (token: string, thunkApi) => {
    try {
      const response = await axios.get(`${localhost}/private/chat/list`, {
        headers: {
          token: token
        }
      });
      // console.log(response.data)
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export interface Private_Chat_State {
  List: PrivateChat[]
  loading: boolean
  error: string | null | any
  success: string | null | any
  updateList: "true" | "false" | boolean;
  recentChat: PrivateChat | null
}


const initialState: Private_Chat_State = {
  List: [],
  loading: false,
  error: null,
  success: null,
  updateList: "false",
  recentChat: null,
}

export const Private_Chat_Slice = createSlice({
  name: 'Private_chat',
  initialState,
  reducers: {
    addToPrivateChatList: (state, action: PayloadAction<PrivateChat>) => {
      if (!state.List.find(item => item._id === action.payload._id)) {
        state.List.push(action.payload)
      }
    },
    addToPrivateChatListMessage: (state, action: PayloadAction<PrivateMessage>) => {
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      const duplicateMessage = state.List[index].messages?.find(item => item._id === action.payload._id)
      if (index !== -1 && !duplicateMessage) {
        state.List[index].lastMessageContent = action.payload.content
        state.List[index].updatedAt = action.payload.createdAt
        state.List[index].messages?.push(action.payload)
      }
    },
    addToPrivateChatListMessageSeen: (state, action: PayloadAction<PrivateMessageSeen>) => {
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      if (index !== -1) {
        state.List[index].messages?.forEach(item => {
          action.payload.messageIds.map(messageId => {
            if (item._id === messageId && !item.seenBy.includes(action.payload.memberId)) {
              item.seenBy.push(action.payload.memberId)
            }
          })
        })
      }
    },
    addMoreMessagesToPrivateChatList: (state, action: PayloadAction<PrivateMessage[]>) => {
      const index = state.List.findIndex(item => item._id === action.payload[0].conversationId)
      if (index !== -1) {
        state.List[index].messages = new Array<PrivateMessage>().concat(action.payload, state.List[index].messages!)
      }
    },
    addToPrivateChatListMessageTyping: (state, action: PayloadAction<typingState>) => {
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      if (index !== -1) {
        state.List[index].typing = action.payload.typing
      }
    },
    recentChatSetter: (state, action: PayloadAction<PrivateChat>) => {
      state.recentChat = action.payload
    },
    resetPrivateChatList: (state) => {
      state.List = []
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch profile chat list
      .addCase(getProfileChatList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.List = action.payload;
        state.updateList = "true"
      })
      .addCase(getProfileChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    // send message
  }
})

// Action creators are generated for each case reducer function
export const {
  addToPrivateChatList,
  resetPrivateChatList,
  addToPrivateChatListMessage,
  addToPrivateChatListMessageSeen,
  recentChatSetter,
  addToPrivateChatListMessageTyping,
  addMoreMessagesToPrivateChatList
} = Private_Chat_Slice.actions

export default Private_Chat_Slice.reducer