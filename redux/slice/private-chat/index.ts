import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PrivateChat, PrivateMessage, PrivateMessageSeen, typingState } from '../../../types/private-chat';
import axios from 'axios';
import socket from '../../../utils/socket-connect';
import { localhost } from '../../../keys';
export type Theme = "light" | "dark" | "system"

export const getMoreMessagePrivate = createAsyncThunk(
  'sendMessagePrivate/post',
  async ({
    conversationId,
    page
  }: {
    conversationId: string,
    page: number,
  }, thunkApi) => {
    try {
      const res = await axios.get(`${localhost}/private/chat/list/messages/${conversationId}?page=${page}&size=${20}`)

      if (res.data?.length === 0) {
        return {
          AllMessagesLoaded: true,
          messages: [],
          conversationId: conversationId,
          pageCount: page
        }
      } else {
        return {
          AllMessagesLoaded: false,
          messages: res.data,
          conversationId: conversationId,
          pageCount: page + 1
        }
      }
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);


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
  messageLoading: boolean
}


const initialState: Private_Chat_State = {
  List: [],
  loading: false,
  error: null,
  success: null,
  updateList: "false",
  recentChat: null,
  messageLoading: false
}

export const Private_Chat_Slice = createSlice({
  name: 'Private_chat',
  initialState,
  reducers: {
    addToPrivateChatList: (state, action: PayloadAction<PrivateChat>) => {
      // console.log(action.payload)
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
    // addMoreMessagesToPrivateChatList: (state, action: PayloadAction<{
    //   AllMessagesLoaded: boolean,
    //   messages: PrivateMessage[],
    //   conversationId: string,
    //   pageCount?: number
    // }>) => {
    //   const index = state.List.findIndex(item => item._id === action.payload.conversationId) || 0

    //   Object.assign(state.List[index], {
    //     loadAllMessages: action.payload.AllMessagesLoaded,
    //     page: state.List[index].page && !action.payload.AllMessagesLoaded ? state.List[index].page! + 1 : 2
    //   });

    //   if (index !== -1 && action.payload.AllMessagesLoaded === false) {
    //     state.List[index].messages = new Array<PrivateMessage>().concat(action.payload.messages, state.List[index].messages!)
    //   }
    //   return state
    // },
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
      // get more message
      .addCase(getMoreMessagePrivate.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(getMoreMessagePrivate.fulfilled, (state, action) => {
        state.messageLoading = false;
        const index = state.List.findIndex(item => item._id === action.payload.conversationId) || 0

        Object.assign(state.List[index], {
          loadAllMessages: action.payload.AllMessagesLoaded,
          page: action.payload.pageCount
        });

        if (index !== -1 && action.payload.AllMessagesLoaded === false) {
          state.List[index].messages = new Array<PrivateMessage>().concat(action.payload.messages, state.List[index].messages!)
        }
        return state
      })
      .addCase(getMoreMessagePrivate.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload;
      })
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
  // addMoreMessagesToPrivateChatList
} = Private_Chat_Slice.actions

export default Private_Chat_Slice.reducer