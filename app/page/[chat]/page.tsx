import React, { useCallback, useContext, useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { Navigation, Route } from '../../../types';
import { RootState } from '../../../redux/store';
import { PrivateChat, typingState } from '../../../types/private-chat';
import socket from '../../../utils/socket-connect';
import Wallpaper_Provider from '../../../provider/Wallpaper_Provider';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import { User } from '../../../types/profile';
import HeaderChat from '../[chat]/components/Header';
import Body from '../[chat]/components/Body';
import Footer from '../[chat]/components/Footer';

interface ChatScreenProps {
    navigation: Navigation
    // route: Route
    route: {
        params: {
            chatId: string
            userId: string
            userDetail: User
            chatDetails: PrivateChat
            newChat: boolean
        }
    } | any
}

export default function ChatScreen({ navigation, route: { params } }: ChatScreenProps) {
    const useThem = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const { List } = useSelector((state: RootState) => state.privateChat)
    const profile = useSelector((state: RootState) => state.profile)
    const connectedUser = useSelector((state: RootState) => state.users.connectedUser)
    const AnimatedState = useContext(AnimatedContext)
    // console.log("params", params)

    let PrivateConversationData = List.find((item) => item._id === params?.chatId) || params.chatDetails

    let userData = connectedUser.find((user) => user._id === params?.userId) || params.userDetail


    const onBlurType = useCallback(() => {
        const message: typingState = {
            conversationId: PrivateConversationData?._id as string,
            senderId: profile?.user?._id as string,
            receiverId: userData?._id as string,
            typing: false
        }
        socket.emit('message_typing_sender', message)
        navigation.goBack()
    }, [])

    const onPressSetting = useCallback(() => {

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            paddingTop: StatusBar.currentHeight,
        }}>
            <HeaderChat
                AnimatedState={AnimatedState}
                primaryOnPress={onPressSetting}
                theme={useThem}
                isOnline={PrivateConversationData?.typing}
                isTyping={PrivateConversationData?.typing}
                onBackPress={onBlurType}
                name={userData?.username || "user"}
                avatarUrl={userData?.profilePicture} />
            <Wallpaper_Provider
                url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQna04gO0p2_R_rVFkUwDIzVv7vUW--j10UWw&usqp=CAU'
                defaultWallpaper
                backgroundColor={useThem.borderColor}>
                <Body
                    conversationId={PrivateConversationData?._id}
                    user={userData}
                    privateChat={PrivateConversationData}
                    profile={profile.user}
                    messages={PrivateConversationData?.messages || []}
                    theme={useThem} />
                <Footer theme={useThem}
                    navigation={navigation}
                    forNewConnection={params?.newChat}
                    conversation={PrivateConversationData}
                    user={userData}
                    userId={params?.userId}
                    profile={profile.user} />
            </Wallpaper_Provider>
            {/* <MyActionSheet
                onPressDismiss={onPressDismiss}
                visible={visible} title={"Chat Setting"} options={options} /> */}
        </SafeAreaView>
    )
}

