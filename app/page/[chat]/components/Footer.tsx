import React, { FC, memo, useCallback, useContext, useEffect, useRef } from 'react';
import { Keyboard, TextInput, ToastAndroid, View } from 'react-native';
import { Camera, Paperclip, Send, Smile } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CurrentTheme } from '../../../../types/theme';
import { User } from '../../../../types/profile';
import { PrivateChat, PrivateMessage, typingState } from '../../../../types/private-chat';
import { addToPrivateChatList, createPrivateChatConversation, sendMessagePrivate } from '../../../../redux/slice/private-chat';
import socket from '../../../../utils/socket-connect';
import MyButton from '../../../../components/shared/Button';
import { RootState } from '../../../../redux/store';
import { localhost } from '../../../../keys';
import axios from 'axios';
import { ProfileContext } from '../../../../provider/Profile_Provider';

interface FooterChatProps {
  theme: CurrentTheme
  profile?: User | null
  conversation?: PrivateChat | null
  user?: User | null
  forNewConnection?: boolean
  navigation?: any
}
const FooterChat: FC<FooterChatProps> = ({
  theme,
  profile,
  conversation,
  user,
  forNewConnection,
  navigation,
}) => {
  const _color = theme.textColor
  const backgroundColor = theme.background
  const dispatch = useDispatch()
  const inputRef = useRef<any>(null);
  const profileState = useContext(ProfileContext) as any

  const { control, handleSubmit, reset,
    formState: { errors } } = useForm({
      defaultValues: {
        message: "",
      }
    });

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
      receiverId: user?._id as string,
      typing: true
    }
    socket.emit('message_typing_sender', message)
  }, [])

  const onBlurType = useCallback(() => {
    const message: typingState = {
      conversationId: conversation?._id as string,
      senderId: profile?._id as string,
      receiverId: user?._id as string,
      typing: false
    }
    socket.emit('message_typing_sender', message)
  }, [])

  const sendMessageHandle = useCallback(async (data: { message: string }) => {
    if (data.message.trim().length > 0) {
      // for new connection
      if (forNewConnection && profile && user) {
        const res = await axios.post(`${localhost}/private/chat/connection`, {
          users: [
            profile._id, user._id
          ]
        })
        if (res.data) {
          dispatch(createPrivateChatConversation({
            users: [profile, user],
            content: data.message,
            conversation: res.data,
          }) as any)
          profileState.fetchUserData()
          navigation.replace("Chat", {
            chatId: res.data._id,
            userId: user?._id,
            newChat: false,
            userDetail: user,
            chatDetails: res.data,
          })
        }else{
          ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        }
        reset()
      }
      else {
        if (conversation && profile && user) {
          dispatch(sendMessagePrivate({
            conversationId: conversation?._id as string,
            content: data.message,
            member: profile,
            receiver: user,
          }) as any)
          reset()
        }else{
          ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        }
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