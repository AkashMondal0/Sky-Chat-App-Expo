import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Button, FlatList, SafeAreaView, ScrollView, ToastAndroid, View } from 'react-native'
import PrivateChatCard from './components/card';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react-native';
import NoItem from './components/No_Item';
import LoadingUserCard from './components/LoadingUserCard';
import { RootState } from '../../../redux/store';
import { PrivateChat, PrivateMessage } from '../../../types/private-chat';
import FloatingButton from '../../../components/shared/Floating';
import SearchList from './components/SearchList';
import Header from './components/header';
import { useForm } from 'react-hook-form';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import ActionSheet from '../../../components/shared/ActionSheet';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { User } from '../../../types/profile';
import ProfileBottomSheet from './components/ProfileBottomSheet';
import { ProfileContext } from '../../../provider/Profile_Provider';


const HomeScreen = ({ navigation }: any) => {
    const useProfile = useSelector((state: RootState) => state.profile)
    const usePrivateChat = useSelector((state: RootState) => state.privateChat)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const AnimatedState = useContext(AnimatedContext)
    const profileState = useContext(ProfileContext)
    const [bottomSheetData, setBottomSheetData] = useState<User>()
    // search form
    const { control, watch, reset } = useForm({
        defaultValues: {
            search: '',
        }
    });

    // count unseen messages
    const seenCount = useCallback((messages?: PrivateMessage[]) => {
        return messages?.map(item => {
            if (!item.seenBy.includes(useProfile?.user?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined).length
    }, [useProfile?.user?._id])

    const sortedDate = useCallback((messages?: PrivateMessage[]) => {
        // @ts-ignore
        return [...messages]?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt
    }, [])

    // chat list sorted by last message
    const sortedListArray = useMemo(() => {
        return ([...usePrivateChat.List].sort((a, b) => {
            const A = sortedDate(a.messages)
            const B = sortedDate(b.messages)

            return new Date(B).getTime() - new Date(A).getTime()
        }).filter((item) => {
            const user = item.userDetails
            if (user) {
                return user.username?.toLowerCase().includes(watch('search').toLowerCase())
            }
        }))
    }, [usePrivateChat.List, watch('search')])

    const navigateToChat = useCallback((item: PrivateChat) => {
        navigation.navigate("Chat", {
            newChat: false,
            userDetail: item?.userDetails,
            profileDetail: useProfile?.user,
            chatDetails: item
        })
    }, [])
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["30%", "50%", "90%"], [])

    const handleSheetChanges = useCallback((userData: User) => {
        setBottomSheetData(userData)
        bottomSheetModalRef.current?.present()
    }, [])


    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: AnimatedState.backgroundColor
        }}>
            <ActionSheet
                BottomSheetComponent={<ProfileBottomSheet UserData={bottomSheetData as User} />}
                bottomSheetModalRef={bottomSheetModalRef}
                snapPoints={snapPoints} />
            <SearchList theme={useTheme}
                reset={reset}
                inputHandleControl={control} />
            <Header theme={useTheme}
                AnimatedState={AnimatedState}
                navigation={navigation} />
            {usePrivateChat.loading ? <ScrollView>
                {Array.from({ length: 15 }).fill(0).map((item, i) => <LoadingUserCard theme={useTheme} key={i} />)}
            </ScrollView>
                : <FlatList
                    // optimization
                    initialNumToRender={10}
                    windowSize={5}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={30}
                    removeClippedSubviews={true}
                    data={sortedListArray}
                    renderItem={({ item }) => {
                        const userData = usePrivateChat.friendListWithDetails.find((user) => user._id === item.userDetails?._id)
                        return item ? <PrivateChatCard
                            avatarOnPress={() => handleSheetChanges(userData || item.userDetails as User)}
                            userData={userData || item.userDetails}
                            AnimatedState={AnimatedState}
                            indicator={seenCount(item.messages) || 0}
                            avatarUrl={userData?.profilePicture || item.userDetails?.profilePicture} // TODO: add avatar url
                            them={useTheme}
                            profile={useProfile?.user}
                            title={userData?.username || item.userDetails?.username || "..."}
                            date={sortedDate(item?.messages)}
                            isTyping={item.typing}
                            onPress={() => navigateToChat(item)}
                            lastMessage={item.lastMessageContent} /> :
                            <LoadingUserCard theme={useTheme} />
                    }}
                    ListEmptyComponent={() => <NoItem them={useTheme} />}
                    onRefresh={profileState.fetchUserData}
                    refreshing={usePrivateChat.loading}
                    keyExtractor={(item) => item._id as any} />}

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

export default memo(HomeScreen)