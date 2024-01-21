import React, { useCallback, useContext, useEffect } from 'react'
import { Button, FlatList, SafeAreaView, ToastAndroid, View } from 'react-native'
import PrivateChatCard from './components/card';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react-native';
import NoItem from './components/No_Item';
import LoadingUserCard from './components/LoadingUserCard';
import { RootState } from '../../../redux/store';
import { fetchUsers } from '../../../redux/apis/user';
import { PrivateMessage } from '../../../types/private-chat';
import FloatingButton from '../../../components/shared/Floating';
import SearchList from './components/SearchList';
import Header from '../../../components/shared/Header';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import Animated from 'react-native-reanimated';


export default function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch()
    const [update, setUpdate] = React.useState(0)
    const useAuth = useSelector((state: RootState) => state.authState)
    const useProfile = useSelector((state: RootState) => state.profile)
    const usePrivateChat = useSelector((state: RootState) => state.privateChat)
    const useUsers = useSelector((state: RootState) => state.users.connectedUser)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const AnimatedState = useContext(AnimatedContext)
    // search form
    const { control, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            search: '',
        }
    });

    // get users id
    let usersIds = usePrivateChat.List?.map((item) => item.users?.filter((userId) => userId !== useProfile?.user?._id)[0]) || []

    useEffect(() => {
        if (useAuth.token && usePrivateChat.List.length !== update) {
            if (usersIds.length > 0 && useUsers.length >= 0 && usersIds !== undefined) {
                dispatch(fetchUsers({ users: usersIds, authorId: useProfile.user?._id } as any) as any)
                setUpdate(usePrivateChat.List.length)
            }
        }
    }, [usePrivateChat.List])

    // count unseen messages
    const seenCount = (messages?: PrivateMessage[]) => {
        return messages?.map(item => {
            if (!item.seenBy.includes(useProfile?.user?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined).length
    }

    // chat list sorted by last message
    const sortedListArray = [...usePrivateChat.List].sort((a, b) => {
        // @ts-ignore
        const A = a.messages?.length > 0 && a.messages[a.messages.length - 1]?.createdAt
        // @ts-ignore
        const B = b.messages?.length > 0 && b.messages[b.messages.length - 1]?.createdAt

        return new Date(B).getTime() - new Date(A).getTime()
    }).filter((item) => {
        const userId = item.users?.filter((userId) => userId !== useProfile.user?._id)[0]
        const user = useUsers.find((user) => user._id === userId)
        if (user) {
            return user.username?.toLowerCase().includes(watch('search').toLowerCase())
        }
    })


    return (
        <Animated.View style={[{ flex: 1 },
        AnimatedState.themeAnimatedStyles]}>
            <SearchList theme={useTheme}
                reset={reset}
                inputHandleControl={control} />
            <Header theme={useTheme}
                AnimatedState={AnimatedState}
                navigation={navigation} />
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
                                    AnimatedState={AnimatedState}
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

        </Animated.View>
    )
}