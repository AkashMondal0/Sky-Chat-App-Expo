import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { CheckCheck} from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { File } from '../../../../types/private-chat';
import { timeFormat } from '../../../../utils/timeFormat';
import { ResizeMode, Video } from 'expo-av';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';

interface MessageTypeProps {
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    files: File[]
    time: string
}
const MessageType: FC<MessageTypeProps> = ({
    theme,
    sender,
    seen,
    files,
    time
}) => {

    return (
        <>{
            files.map((file, index) => {
                if (file.type === "image") {
                    return <MessageImage key={index} file={file} sender={sender} seen={seen} theme={theme} time={time} />
                }
                else if (file.type === "video") {
                    return <MessageVideo key={index} file={file} sender={sender} seen={seen} theme={theme} time={time} />
                }
            })
        }</>
    );
};

export default MessageType;