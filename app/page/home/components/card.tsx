import { FC, useContext } from 'react';
import { View, TouchableOpacity, Text, Pressable, Animated } from 'react-native';
import React from 'react';
import { truncate } from 'lodash';
import { CurrentTheme } from '../../../../types/theme';
import Avatar from '../../../../components/shared/Avatar';
import { timeFormat } from '../../../../utils/timeFormat';
import { Badge } from 'lucide-react-native';
import { PrivateMessage } from '../../../../types/private-chat';
import { User } from '../../../../types/profile';
import Padding from '../../../../components/shared/Padding';
import { AnimatedContext } from '../../../../provider/Animated_Provider';

interface PrivateChatCardProps {
    title: string;
    date: Date | string | any;
    lastMessage: string;
    onPress?: () => void;
    onLongPress?: () => void;
    indicator: number;
    avatarUrl?: string;
    them: CurrentTheme
    isTyping?: boolean;
    profile?: User | null;
    AnimatedState: any;
}
const PrivateChatCard: FC<PrivateChatCardProps> = ({
    title,
    date,
    lastMessage,
    onPress,
    onLongPress,
    indicator,
    avatarUrl,
    them,
    isTyping,
    profile,
    AnimatedState,
}) => {


    return (
        <Animated.View style={{
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: AnimatedState.BackgroundColor,
        }}>
            <Pressable
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 20,
                    paddingVertical: 12,
                    paddingLeft: 5,
                    width: '100%',
                }}

                android_ripple={{
                    color: them.selectedItemColor,
                }}
                onPress={onPress}>
                <>
                    <Avatar
                        size={55}
                        style={{
                            marginHorizontal: 5,
                        }}
                        text={title[0]}
                        url={avatarUrl as string} />
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        paddingHorizontal: 10,
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: them.textColor,
                        }}>{truncate(title, { separator: "...", length: 14 })}</Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '400',
                                color: isTyping ? them.primary : them.subTextColor,
                            }}
                        >{
                                isTyping ? "typing..." : truncate(lastMessage, {
                                    length: 15,
                                    separator: '...',
                                })
                            }</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        paddingHorizontal: 10,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: them.subTextColor,
                        }}>{timeFormat(date)}</Text>
                        {indicator > 0 ?
                            <View style={{
                                width: 25,
                                height: 25,
                                borderRadius: 100,
                                backgroundColor: them.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: them.color,
                                }}>{indicator}</Text>
                            </View>
                            : <Padding size={25} />}
                    </View>
                </>
            </Pressable>
        </Animated.View>
    )
};

export default PrivateChatCard;