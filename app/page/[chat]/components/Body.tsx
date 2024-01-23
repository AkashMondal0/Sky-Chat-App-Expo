import React, { FC, useEffect, useMemo, useCallback, memo } from 'react';
import { ActivityIndicator, FlatList, Text, ToastAndroid, View } from 'react-native';
import ChatCard from './MessageCard';
import { useDispatch } from 'react-redux';
import { CurrentTheme } from '../../../../types/theme';
import { PrivateChat, PrivateMessage, PrivateMessageSeen } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import { addMoreMessagesToPrivateChatList, sendMessageSeenPrivate } from '../../../../redux/slice/private-chat';
import { dateFormat } from '../../../../utils/timeFormat';
import axios from 'axios';
import { localhost } from '../../../../keys';
import MyButton from '../../../../components/shared/Button';

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
    const [stopMoreData, setStopMoreData] = React.useState(false);
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
        return messages?.filter((value, index, dateArr) => index === dateArr
            .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
            .sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
    }, [messages])

    const scrollToBottom = useCallback(() => {
        // scroll to last index
        scrollViewRef?.current?.scrollToEnd({ animated: false });

    }, [])


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
                setStopMoreData(true)
                ToastAndroid.show('No more messages', ToastAndroid.SHORT)
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
            scrollToBottom()
        }
    }, [messages])

    const ItemView = memo(({ item }: { item: PrivateMessage }) => {
        return (
            <View>
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
                {messages.filter((value) => dateFormat(value.createdAt) === dateFormat(item.createdAt))
                    .sort((a, b) => {
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    }).map((item, index) => {
                        return <ChatCard
                            key={item._id}
                            sender={item.memberId === profile?._id}
                            seen={item.seenBy.length >= 2 && item.seenBy.includes(profile?._id as string)}
                            theme={theme}
                            data={item}
                            content={item.content}
                        />
                    })}
            </View>
        );
    });


    return (
        <>
            <FlatList
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                windowSize={10}
                removeClippedSubviews={true}
                onContentSizeChange={scrollToBottom}
                keyExtractor={(item, index) => index.toString() as string}
                scrollEventThrottle={400}
                ref={scrollViewRef}
                data={memoSortedDates}
                renderItem={({ item }) => <ItemView item={item} />}

                // component
                ListEmptyComponent={() => {
                    return <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: theme.subTextColor,
                            fontSize: 20
                        }}>No messages</Text>
                    </View>
                }}
                ListHeaderComponent={() => {
                    return <View style={{
                        paddingVertical: 15,
                        width: "100%",
                        alignItems: 'center',
                    }}>
                        {messages.length >= 0 && stopMoreData ? <></> : <>
                            {loading ?
                                <ActivityIndicator size="large" color={theme.primary} />
                                :
                                <MyButton onPress={getMoreData} theme={theme} title='More' variant="info" width={100} radius={20} />}</>}
                    </View>
                }} />
        </>
    );
};

export default memo(BodyChat);