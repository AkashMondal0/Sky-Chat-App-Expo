import React, { FC, useCallback, useEffect } from 'react';
import { FlatList, ScrollView, Text, ToastAndroid, View } from 'react-native';
import ChatCard from './MessageCard';
import { useDispatch } from 'react-redux';
import { CurrentTheme } from '../../../../types/theme';
import { PrivateChat, PrivateMessage, PrivateMessageSeen } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import { addMoreMessagesToPrivateChatList, sendMessageSeenPrivate } from '../../../../redux/slice/private-chat';
import { dateFormat } from '../../../../utils/timeFormat';
import { debounce } from 'lodash';
import axios from 'axios';
import { localhost } from '../../../../keys';
import Padding from '../../../../components/shared/Padding';
import { Dimensions } from 'react-native';
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
    const [unLoading, setUnLoading] = React.useState(false);
    const [stopMoreData, setStopMoreData] = React.useState(true);
    const dispatch = useDispatch()

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

    const getMoreData = () => {
        setLoading(true)
        setUnLoading(false)
        // increment height of view
        axios.get(`${localhost}/private/chat/list/messages/${conversationId}?page=${page}&size=${20}`)
            .then((res) => {
                if (res.data) {
                    dispatch(addMoreMessagesToPrivateChatList(res.data))
                    setPage(page + 1)
                    scrollViewRef?.current?.scrollTo({ y: 1000, animated: false })
                    return res.data
                }
            })
            .catch((err) => {
                setStopMoreData(false)
                ToastAndroid.show('No more messages', ToastAndroid.SHORT)
            }).finally(() => {
                setLoading(false)
                setUnLoading(true)
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
    }, [messages])

    const handleScroll = ({ nativeEvent }: any) => {
        
        if (nativeEvent.contentOffset.y === 0 && stopMoreData) {
            getMoreData()
        }
    };
    return (
        <ScrollView
        onContentSizeChange={()=>{
            if (!loading&&!unLoading) {
                scrollToBottom()
            }
        }}
            scrollEventThrottle={400}
            onScroll={handleScroll}
            ref={scrollViewRef}>
            {loading && <Text style={{ textAlign: 'center', color: theme.subTextColor }}>Loading...</Text>}
            {messages?.filter((value, index, dateArr) => index === dateArr
                .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
                .sort((a, b) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                })
                .map((item, i) => {

                    return <View key={i}>
                        <>
                            <Text style={{
                                textAlign: 'center',
                                color: theme.subTextColor,
                                backgroundColor: theme.primaryBackground,
                                borderRadius: 10,
                                padding: 5,
                                marginVertical: 5,
                                // width: '50%',
                                alignSelf: 'center'
                            }}>{dateFormat(item.createdAt)}</Text>
                        </>
                        {messages.filter((value) => dateFormat(value.createdAt) === dateFormat(item.createdAt))
                            .sort((a, b) => {
                                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                            })
                            .map((message, i) => {
                                // console.log(message)
                                return <ChatCard
                                    key={i}
                                    sender={message.memberId === profile?._id}
                                    seen={message.seenBy.length >= 2 && message.seenBy.includes(profile?._id as string)}
                                    theme={theme}
                                    data={message}
                                    content={message.content} />
                            })}
                    </View>

                })}
            {/* <FlatList
                ref={ref}
                data={}
                renderItem={({ item }) => {
                    return 
                   
                }}
                keyExtractor={item => item._id}
            /> */}
            {/* <Padding size={600}/> */}
        </ScrollView>
    );
};

export default BodyChat;