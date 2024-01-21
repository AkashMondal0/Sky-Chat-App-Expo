import React, { useEffect } from 'react'
import { Button, FlatList, SafeAreaView, ToastAndroid } from 'react-native'
import PrivateChatCard from './components/card';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react-native';
import NoItem from './components/No_Item';
import LoadingUserCard from './components/LoadingUserCard';
import { RootState } from '../../../redux/store';
import { fetchUsers } from '../../../redux/apis/user';
import { PrivateMessage } from '../../../types/private-chat';
import FloatingButton from '../../../components/shared/Floating';


export default function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch()
    const [update, setUpdate] = React.useState(0)
    const useAuth = useSelector((state: RootState) => state.authState)
    const useProfile = useSelector((state: RootState) => state.profile)
    const usePrivateChat = useSelector((state: RootState) => state.privateChat)
    const useUsers = useSelector((state: RootState) => state.users.connectedUser)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)


    let usersIds = usePrivateChat.List?.map((item) => item.users?.filter((userId) => userId !== useProfile?.user?._id)[0]) || []

    useEffect(() => {
        if (useAuth.token && usePrivateChat.List.length !== update) {
            if (usersIds.length > 0 && useUsers.length >= 0 && usersIds !== undefined) {
                dispatch(fetchUsers({ users: usersIds, authorId: useProfile.user?._id } as any) as any)
                setUpdate(usePrivateChat.List.length)
            }
        }
    }, [usePrivateChat.List])

    const seenCount = (messages?: PrivateMessage[]) => {
        return messages?.map(item => {
            if (!item.seenBy.includes(useProfile?.user?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined).length
    }
    const sortedListArray = [...usePrivateChat.List].sort((a, b) => {
        // @ts-ignore
        const A = a.messages?.length > 0 && a.messages[a.messages.length - 1]?.createdAt
        // @ts-ignore
        const B = b.messages?.length > 0 && b.messages[b.messages.length - 1]?.createdAt

        return new Date(B).getTime() - new Date(A).getTime()
    })

    return (
        <SafeAreaView style={{
            flex: 1,
            paddingHorizontal: 2,
        }}>
            {!usePrivateChat.List && usePrivateChat.loading ? <LoadingUserCard theme={useTheme} />
                :
                <>
                    {sortedListArray.length <= 0 && !usePrivateChat.loading ? <NoItem them={useTheme} /> :
                        <FlatList
                            data={sortedListArray}
                            renderItem={({ item }) => {
                                const userId = item.users?.filter((userId) => userId !== useProfile.user?._id)[0]
                                // console.log("user", item)
                                const user = useUsers.find((user) => user._id === userId)
                                return user ? <PrivateChatCard
                                    indicator={seenCount(item.messages) || 0}
                                    avatarUrl={user.profilePicture} // TODO: add avatar url
                                    them={useTheme}
                                    profile={useProfile?.user}
                                    title={user?.username || "user"}
                                    // @ts-ignore
                                    date={item?.messages[item?.messages?.length - 1]?.createdAt || item.updatedAt as string}
                                    isTyping={item.typing}
                                    onPress={() => navigation.navigate('Chat', { chatId: item._id, userId: userId })}
                                    lastMessage={item.lastMessageContent} /> :
                                    <LoadingUserCard theme={useTheme} />
                            }}
                            keyExtractor={(item) => item._id as any} />}
                </>}

            <FloatingButton
                onPress={() => {
                    navigation.navigate('Message')
                }}
                theme={useTheme}
                icon={<UserPlus color={useTheme.color}
                    size={35} />} />

        </SafeAreaView>
    )
}