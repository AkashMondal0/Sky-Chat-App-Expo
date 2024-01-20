import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Keyboard, Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import { Camera, Paperclip, Send, Smile } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CurrentTheme } from '../../../../types/theme';
import { User } from '../../../../types/profile';
import { PrivateChat, PrivateMessage, typingState } from '../../../../types/private-chat';
import { addToPrivateChatListMessage, sendMessagePrivate } from '../../../../redux/slice/private-chat';
import socket from '../../../../utils/socket-connect';
import MyButton from '../../../../components/shared/Button';

interface FooterChatProps {
  theme: CurrentTheme
  profile?: User | null
  conversation?: PrivateChat | null
  user?: User | null
}
const FooterChat: FC<FooterChatProps> = ({
  theme,
  profile,
  conversation,
  user,
}) => {
  const _color = theme.textColor
  const backgroundColor = theme.background
  const dispatch = useDispatch()
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

  const sendMessageHandle = useCallback((data: {
    message: string
  }) => {
    if (data.message.trim().length > 0) {
      const newMessage: PrivateMessage = {
        _id: new Date().getTime().toString(),
        content: data.message,
        memberId: profile?._id as string,
        memberDetails: profile as User,
        conversationId: conversation?._id as string,
        senderId: profile?._id as string,
        receiverId: user?._id as string,
        deleted: false,
        seenBy: [
          profile?._id as string,
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      dispatch(sendMessagePrivate({
        message: newMessage,
      }) as any)
      reset()
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
        height: 45,
        paddingHorizontal: 10,
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          elevation: 5,
        }}>
          <Smile
            size={25}
            color={_color}
          />
          <Controller
            control={control}
            rules={{
              maxLength: 100,
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
                style={{
                  height: 50,
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

export default FooterChat;