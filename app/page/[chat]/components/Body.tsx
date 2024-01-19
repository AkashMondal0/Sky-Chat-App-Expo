import React, { FC, useCallback, useEffect } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import ChatCard from './MessageCard';
import { useDispatch } from 'react-redux';
import { CurrentTheme } from '../../../../types/theme';
import { PrivateChat, PrivateMessage, PrivateMessageSeen } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import { sendMessageSeenPrivate } from '../../../../redux/slice/private-chat';
import { dateFormat } from '../../../../utils/timeFormat';

interface BodyChatProps {
    theme: CurrentTheme
    messages: PrivateMessage[]
    profile: User | null | undefined
    privateChat: PrivateChat | null | undefined
    user: User | null | undefined
}
const BodyChat: FC<BodyChatProps> = ({
    theme,
    messages,
    profile,
    privateChat,
    user
}) => {
    const scrollViewRef = React.useRef<ScrollView | any>(null);
    const dispatch = useDispatch()
    // const scrollToBottom = () => {
    //     scrollViewRef.current?.scrollToEnd({ animated: true });
    // }
    const seenCount = () => {
        return messages.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined)
    }

    // console.log(seenCount())

    const messageSeen = () => {

        const seen: PrivateMessageSeen = {
            messageIds: seenCount() as string[],
            memberId: profile?._id as string,
            receiverId: user?._id as string,
            conversationId: privateChat?._id as string
        }

        dispatch(sendMessageSeenPrivate({ seen }) as any)
    }
    useEffect(() => {
        if (messages.length > 0) {
            messageSeen()
        }
        // scrollToBottom()
    }, [messages])

    return (
        <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef?.current.scrollToEnd({ animated: true })}>

            {messages?.filter((value, index, dateArr) => index === dateArr
                .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
                .map((item) => {

                    return <View key={item.createdAt}>
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
                            .map((message) => {
                                return <ChatCard
                                    key={message._id}
                                    sender={message.memberId === profile?._id}
                                    seen={message.seenBy.includes(message.receiverId)}
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
        </ScrollView>
    );
};

export default BodyChat;