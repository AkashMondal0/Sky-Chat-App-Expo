import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { Camera, Paperclip, Send, Smile } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CurrentTheme } from '../../../../types/theme';
import { User } from '../../../../types/profile';
import { PrivateChat, PrivateMessage, typingState } from '../../../../types/private-chat';
import { addToPrivateChatList, sendMessagePrivate } from '../../../../redux/slice/private-chat';
import socket from '../../../../utils/socket-connect';
import MyButton from '../../../../components/shared/Button';
import { RootState } from '../../../../redux/store';
import { localhost } from '../../../../keys';
import axios from 'axios';

interface FooterChatProps {
  theme: CurrentTheme
  profile?: User | null
  conversation?: PrivateChat | null
  user?: User | null
  forNewConnection?: boolean
  navigation?: any
  userId?: string
}
const FooterChat: FC<FooterChatProps> = ({
  theme,
  profile,
  conversation,
  user,
  forNewConnection,
  navigation,
  userId
}) => {
  const _color = theme.textColor
  const backgroundColor = theme.background
  const dispatch = useDispatch()
  const { List } = useSelector((state: RootState) => state.privateChat)
  const [newChatId, setNewChatId] = React.useState<string>("x")

  const { control, handleSubmit, reset,
    formState: { errors } } = useForm({
      defaultValues: {
        message: "",
      }
    });
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const onFocus = useCallback(() => {
    const message: typingState = {
      conversationId: conversation?._id as string,
      senderId: profile?._id as string,
      receiverId: user?._id || userId as string,
      typing: true
    }
    socket.emit('message_typing_sender', message)
  }, [])

  const onBlurType = useCallback(() => {
    const message: typingState = {
      conversationId: conversation?._id as string,
      senderId: profile?._id as string,
      receiverId: user?._id || userId as string,
      typing: false
    }
    socket.emit('message_typing_sender', message)
  }, [])

  const sendMessageHandle = useCallback((data: { message: string }) => {

    // @ts-ignore
    if (forNewConnection && !List.includes({ _id: newChatId })) {
      axios.post(`${localhost}/private/chat/connection`, { users: [profile?._id, user?._id] })
        .then((res) => {
          reset()
          const newMessage2: PrivateMessage = {
            _id: new Date().getTime().toString(),
            content: data.message,
            memberId: profile?._id as string,
            memberDetails: profile as User,
            conversationId: res.data._id as string,
            senderId: profile?._id as string,
            receiverId: user?._id || userId as string,
            deleted: false,
            seenBy: [
              profile?._id as string,
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const conversation = {
            _id: res.data._id,
            users: [profile?._id, user?._id] as any,
            lastMessageContent: data.message,
            messages: [newMessage2],
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            typing: false,
          }
          dispatch(addToPrivateChatList(conversation))
          navigation.replace("Chat", {
            chatId: conversation._id,
            userId: user?._id,
          })
          setNewChatId(res.data._id)
          socket.emit('update_Chat_List_Sender', {
            receiverId: user?._id || userId,
            senderId: profile?._id,
            chatData: conversation
          });
          socket.emit('message_sender', newMessage2)
        })
    }

    else {
      const newMessage: PrivateMessage = {
        _id: new Date().getTime().toString(),
        content: data.message,
        memberId: profile?._id as string,
        memberDetails: profile as User,
        conversationId: conversation?._id as string,
        senderId: profile?._id as string,
        receiverId: userId as string,
        deleted: false,
        seenBy: [
          profile?._id as string,
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (data.message.trim().length > 0) {
        reset()
        dispatch(sendMessagePrivate({
          message: newMessage,
        }) as any)
      }
    }
  }, [])

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      gap: 10,
    }}>
      <View style={{
        backgroundColor: backgroundColor,
        // width: "85%",
        flex: 1,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 100,
        paddingHorizontal: 10,
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          elevation: 5,
          gap: 5,
        }}>
          <Smile
            size={25}
            color={_color}
          />
          <Controller
            control={control}
            rules={{
              // maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={() => {
                  onBlur()
                  Keyboard.dismiss()
                  onBlurType()
                }}
                onFocus={onFocus}
                onChangeText={onChange}
                ref={inputRef}
                value={value}
                multiline={true}
                style={{
                  minHeight: 45,
                  width: "85%",
                  borderRadius: 100,
                  color: _color,
                  fontSize: 18,
                  flex: 1,
                }}
                placeholder="Message"
                placeholderTextColor={_color} />)}
            name="message" />
          <Paperclip
            // size={25}
            color={_color}
          />
          {/* <Camera
            // size={25}
            color={_color}
          /> */}
        </View>
      </View>
      <MyButton theme={theme}
        onPress={handleSubmit(sendMessageHandle)}
        variant="primary"
        radius={100}
        padding={8}
        width={55}
        elevation={5}
        icon={<Send size={30} color={theme.color} />} />

    </View>
  );
};

export default memo(FooterChat);