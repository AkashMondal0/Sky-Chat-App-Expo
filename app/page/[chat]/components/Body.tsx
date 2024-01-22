import React, { FC, useEffect, useMemo, PureComponent, useContext } from 'react';
import { FlatList, ScrollView, Text, ToastAndroid, View } from 'react-native';
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
import { ProfileContext } from '../../../../provider/Profile_Provider';
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
    const scrollViewRef = React.useRef<ScrollView | any>(null);
    const [page, setPage] = React.useState(2);
    const [loading, setLoading] = React.useState(false);
    const [stopMoreData, setStopMoreData] = React.useState(false);
    const dispatch = useDispatch()
    const profileState = useContext(ProfileContext)

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
    }


    const seenCount = () => {
        return messages.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined)
    }



    const messageSeen = () => {

        const seen: PrivateMessageSeen = {
            messageIds: seenCount() as string[],
            memberId: profile?._id as string,
            receiverId: user?._id as string,
            conversationId: privateChat?._id as string
        }

        dispatch(sendMessageSeenPrivate({ seen }) as any)
    }

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
            if (messages.length > 0 && messages[messages.length - 1].memberId !== profile?._id) {
                messageSeen()
            }
            scrollToBottom()
        }
    }, [])

    const handleScroll = ({ nativeEvent }: any) => {
        if (nativeEvent.contentOffset.y === 0) {
            getMoreData()
        }
    };

    const sortedDates = messages?.filter((value, index, dateArr) => index === dateArr
        .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
        .sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })

    const RenderMessageItem = useMemo(() => {
        return (item: PrivateMessage) => {
            return (
                <ChatCard
                    sender={item.memberId === profile?._id}
                    seen={item.seenBy.length >= 2 && item.seenBy.includes(profile?._id as string)}
                    theme={theme}
                    data={item}
                    content={item.content}
                />
            );
        };
    }, [sortedDates]);

    return (
        <>
            <FlatList
                ListHeaderComponent={() => {
                    return <View style={{
                        paddingVertical: 15,
                        width: "100%",
                        alignItems: 'center',
                    }}>
                        {messages.length >= 0 && stopMoreData ? <></> : <>
                            {loading ? <Text style={{ textAlign: 'center', color: theme.textColor }}>Loading...</Text>
                                : <MyButton onPress={getMoreData}
                                    theme={theme} title='More' variant="info" width={100} radius={20} />}
                        </>}
                    </View>
                }}
                onContentSizeChange={() => {
                    if (!loading) {
                        scrollToBottom()
                    }
                }}

                // optimization
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                refreshing={loading}
                //
                // onScroll={handleScroll}
                scrollEventThrottle={400}
                ref={scrollViewRef}
                data={sortedDates}
                renderItem={({ item }) => {
                    return <View>
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
                        <FlatList
                            // optimization
                            removeClippedSubviews={true}
                            initialNumToRender={10}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            //
                            data={messages.filter((value) => dateFormat(value.createdAt) === dateFormat(item.createdAt))
                                .sort((a, b) => {
                                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                })}
                            renderItem={({ item }) => <RenderMessageItem {...item} />}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                }
                }
                keyExtractor={(item, index) => index.toString()} />
        </>
    );
};

export default BodyChat;