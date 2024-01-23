import React, { FC, useEffect, useMemo, useCallback, memo } from 'react';
import { ActivityIndicator, ToastAndroid, View, VirtualizedList } from 'react-native';
import ChatCard from './MessageCard';
import { useDispatch } from 'react-redux';
import { CurrentTheme } from '../../../../types/theme';
import { PrivateChat, PrivateMessage, PrivateMessageSeen } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import { addMoreMessagesToPrivateChatList, sendMessageSeenPrivate } from '../../../../redux/slice/private-chat';
import axios from 'axios';
import { localhost } from '../../../../keys';
import MyButton from '../../../../components/shared/Button';
import { ArrowDown } from 'lucide-react-native';

interface BodyChatProps {
    theme: CurrentTheme
    messages: PrivateMessage[]
    profile: User | null | undefined
    privateChat: PrivateChat | null | undefined
    user: User | null | undefined
    conversationId: string | undefined
}
const BodyChat: FC<BodyChatProps> = ({
    theme,
    messages,
    profile,
    privateChat,
    user,
    conversationId
}) => {
    const scrollViewRef = React.useRef<any>(null);
    const [page, setPage] = React.useState(2);
    const [loading, setLoading] = React.useState(false);
    const [userScrollIcon, setUserScrollIcon] = React.useState(false);
    const [moreDataStop, setMoreDataStop] = React.useState(false);
    const dispatch = useDispatch()

    // unread message count
    const seenCount = useMemo(() => {
        return messages.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined)
    }, [messages])

    // memoized sorted dates
    const memoSortedDates = useMemo(() => {
        return [...messages].reverse()
        // ?.filter((value, index, dateArr) => index === dateArr
        //     .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
        // .sort((a, b) => {
        //     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        // })
    }, [messages])


    const messageSeen = useCallback(() => {
        const seen: PrivateMessageSeen = {
            messageIds: seenCount as string[],
            memberId: profile?._id as string,
            receiverId: user?._id as string,
            conversationId: privateChat?._id as string
        }
        dispatch(sendMessageSeenPrivate({ seen }) as any)
    }, [messages])

    const getMoreData = async () => {
        setLoading(true)
        // increment height of view
        axios.get(`${localhost}/private/chat/list/messages/${conversationId}?page=${page}&size=${20}`)
            .then((res) => {
                if (res.data) {
                    dispatch(addMoreMessagesToPrivateChatList(res.data))
                    setPage(page + 1)
                    return res.data
                }
            })
            .catch((err) => {
                ToastAndroid.show('No more messages', ToastAndroid.SHORT)
                setMoreDataStop(true)
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        //debounce
        if (!loading) {
            if (messages.length > 0) {
                messageSeen()
            }
        }
    }, [messages])

    const ItemView = memo(({ item }: { item: PrivateMessage }) => {
        return (
            <ChatCard
                key={item._id}
                sender={item.memberId === profile?._id}
                seen={item.seenBy.length >= 2 && item.seenBy.includes(profile?._id as string)}
                theme={theme}
                data={item}
                content={item.content}
            />
            // <View>
            //     <>
            //         <Text style={{
            //             textAlign: 'center',
            //             color: theme.subTextColor,
            //             backgroundColor: theme.primaryBackground,
            //             borderRadius: 10,
            //             padding: 5,
            //             marginVertical: 5,
            //             alignSelf: 'center'
            //         }}>{dateFormat(item.createdAt)}</Text>
            //     </>
            //     {messages.filter((value) => dateFormat(value.createdAt) === dateFormat(item.createdAt))
            //         .sort((a, b) => {
            //             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            //         }).map((item, index) => {
            //             return <ChatCard
            //                 key={item._id}
            //                 sender={item.memberId === profile?._id}
            //                 seen={item.seenBy.length >= 2 && item.seenBy.includes(profile?._id as string)}
            //                 theme={theme}
            //                 data={item}
            //                 content={item.content}
            //             />
            //         })}
            // </View>
        );
    });




    return (
        <>
            <VirtualizedList
                inverted
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString() as string}
                scrollEventThrottle={400}
                ref={scrollViewRef}
                data={memoSortedDates}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                updateCellsBatchingPeriod={100}
                getItem={(data, index) => data[index]}
                getItemCount={(data) => data.length}
                onEndReached={!moreDataStop ? getMoreData : () => { }}
                // @ts-ignore
                renderItem={({ item }) => <ItemView item={item} />}
                onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y > 200) {
                        setUserScrollIcon(true)
                    } else {
                        setUserScrollIcon(false)
                    }
                }}
                // ListHeaderComponent={() => {}}
                ListFooterComponent={() => {
                    return <View style={{
                        paddingVertical: 15,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {loading ? <ActivityIndicator size="large" color={theme.primaryTextColor} /> : <></>}
                    </View>
                }}
            />
            <View style={{
                paddingVertical: 15,
                width: "100%",
                position: 'absolute',
                bottom: 50,
                right: 10,
                alignItems: "flex-end",
                zIndex: 1000,
                elevation: 1000,
            }}>
                {userScrollIcon ?
                    <MyButton onPress={() => scrollViewRef?.current?.scrollToOffset({ offset: 0, animated: false })} theme={theme}
                        variant="custom" backgroundColor={theme.cardBackground}
                        height={50}
                        icon={<ArrowDown size={30} color={theme.primaryIconColor} />}
                        width={50} radius={20} /> : <></>}
            </View>
        </>
    );
};

export default memo(BodyChat);