import React, { FC, useEffect, useMemo, useCallback, memo } from 'react';
import { ActivityIndicator, ToastAndroid, View, VirtualizedList, Text } from 'react-native';
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
import _ from 'lodash';
import { dateFormat } from '../../../../utils/timeFormat';

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
        const dateSorted = [...messages]
            ?.filter((value, index, dateArr) => index === dateArr
                .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
            .map((item) => {
                item._id = new Date(item.createdAt).getTime().toString();
                item = { ...item, typeDate: true }
                return item
            })
        const messageSorted = [...messages, ...dateSorted]
            .sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
        return messageSorted
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
        if (!moreDataStop && !privateChat?.loadAllMessages && !loading) {
            setLoading(true)
            // increment height of view
            axios.get(`${localhost}/private/chat/list/messages/${conversationId}?page=${page}&size=${20}`)
                .then((res) => {
                    if (res.data) {
                        if (res.data?.length === 0) {
                            setMoreDataStop(true)
                            dispatch(addMoreMessagesToPrivateChatList({
                                messages: [],
                                conversationId: privateChat?._id as string,
                                AllMessagesLoaded: true
                            }))
                            ToastAndroid.show('No more messages', ToastAndroid.SHORT)
                        } else {
                            dispatch(addMoreMessagesToPrivateChatList({
                                messages: res.data,
                                conversationId: privateChat?._id as string,
                                AllMessagesLoaded: false
                            }))
                            setPage(page + 1)
                            return res.data
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                }).finally(() => {
                    setLoading(false)
                })
        }
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
        if (item.typeDate) {
            return (
                <>
                    <Text style={{
                        textAlign: 'center',
                        color: theme.subTextColor,
                        backgroundColor: theme.primaryBackground,
                        borderRadius: 10,
                        padding: 5,
                        marginVertical: 5,
                        alignSelf: 'center'
                    }}>{dateFormat(item.createdAt)}</Text>
                </>
            )

        }
        return (
            <ChatCard
                key={item._id}
                sender={item.memberId === profile?._id}
                seen={item.seenBy.length >= 2 && item.seenBy.includes(profile?._id as string)}
                theme={theme}
                data={item}
                content={item.content}
            />
        );
    })

    const throttledFunction = _.throttle(() => getMoreData(), 2000);


    return (
        <>
            <VirtualizedList
                // style={{paddingBottom: 100,
                // minHeight: "100%"
                // }}
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
                onEndReached={throttledFunction}
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