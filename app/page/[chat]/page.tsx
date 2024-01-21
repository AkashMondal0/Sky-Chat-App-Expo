import React, { useCallback, useContext, useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import HeaderChat from './components/Header';
import Footer from './components/Footer';
import { useSelector } from 'react-redux';
import Body from './components/Body';
import { Navigation, Route } from '../../../types';
import { RootState } from '../../../redux/store';
import { typingState } from '../../../types/private-chat';
import socket from '../../../utils/socket-connect';
import Wallpaper_Provider from '../../../provider/Wallpaper_Provider';
import { AnimatedContext } from '../../../provider/Animated_Provider';

export default function ChatScreen({ navigation, route }: {
    navigation: Navigation | any,
    route: Route | any
}) {
    // const notificationContext = React.useContext(NotificationContext)
    const [visible, setVisible] = React.useState(false);
    const useThem = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const { List } = useSelector((state: RootState) => state.privateChat)
    const profile = useSelector((state: RootState) => state.profile)
    const connectedUser = useSelector((state: RootState) => state.users.connectedUser)
    const AnimatedState = useContext(AnimatedContext)



    let PrivateConversationData = List.find((item) => item._id === route?.params?.chatId)

    let userData = connectedUser.find((user) => user._id === route?.params?.userId)

    const onPressSetting = useCallback(() => {
        setVisible(true)
    }, [])
    const onPressDismiss = useCallback(() => {
        setVisible(false)
    }, [])

    const options = [
        { label: 'Open', onPress: () => console.log('open') },
        { label: 'Cancel09', onPress: () => console.log('cancel09') },
        { label: 'Cancel', onPress: () => console.log('cancel') },
    ]


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
                    conversation={PrivateConversationData}
                    user={userData}
                    profile={profile.user} />
            </Wallpaper_Provider>
            {/* <MyActionSheet
                onPressDismiss={onPressDismiss}
                visible={visible} title={"Chat Setting"} options={options} /> */}
        </SafeAreaView>
    )
}

