import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { File } from '../../../../types/private-chat';

interface MessageImageProps {
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    files: File[]
}
const MessageImage: FC<MessageImageProps> = ({
    theme,
    sender,
    seen,
    files
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
                padding: 5,
                maxWidth: "80%",
                elevation: 2,
                gap: 5,
            }}>
                {files.length >= 1 ? <Image source={{ uri: files[0].url }} style={{
                    width: 250,
                    maxHeight: 350,
                    height: 350,
                    borderRadius: 20,
                    resizeMode: "cover",
                }} /> : <>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: sender ? "flex-end" : "flex-start",
                        padding: 8,
                    }}>
                        {files.map((file, index) => (
                            <Image source={{ uri: file.url }} style={{
                                width: 250,
                                height: 250,
                                borderRadius: 20,
                                resizeMode: "cover",
                            }} />
                        ))}
                    </View>
                </>}

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