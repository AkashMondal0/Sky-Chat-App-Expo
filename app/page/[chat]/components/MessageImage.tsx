import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import MyText from '../../../components/shared/My-Text';
import { CurrentTheme } from '../../../types/theme';
import { CheckCheck } from 'lucide-react-native';

interface MessageImageProps {
    content: string;
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
}
const MessageImage: FC<MessageImageProps> = ({
    content,
    theme,
    sender,
    seen
}) => {
    const senderColor = theme.primary;
    const receiverColor = theme.background;
    const textColor = sender ? theme.color : theme.textColor;

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: sender ? "flex-end" : "flex-start",
            padding: 8,
        }}>
            <View style={{
                backgroundColor: sender ? senderColor : receiverColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderTopLeftRadius: !sender ? 0 : 20,
                borderTopRightRadius: !sender ? 20 : 0,
                padding: 10,
                maxWidth: "80%",
                elevation: 2,
                gap: 5,
            }}>
               <Image source={{ uri: content }} style={{
                     width: 200,
                     height: 200,
                     borderRadius: 10,
                        resizeMode: "cover",
                    }} />

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 15,
                }}>
                    <Text style={{
                        color: textColor,
                        fontSize: 12,
                    }}>
                        12:00 PM
                    </Text>
                    <CheckCheck
                        size={20}
                        color={seen ? theme.seen : theme.iconColor} />
                </View>
            </View>
        </View>
    );
};

export default MessageImage;