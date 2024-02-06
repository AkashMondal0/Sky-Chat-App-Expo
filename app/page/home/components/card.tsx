import { FC, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Text, Pressable, Animated } from 'react-native';
import React from 'react';
import { truncate } from 'lodash';
import { CurrentTheme } from '../../../../types/theme';
import Avatar from '../../../../components/shared/Avatar';
import { timeFormat } from '../../../../utils/timeFormat';
import { User } from '../../../../types/profile';
import Padding from '../../../../components/shared/Padding';
import socket from '../../../../utils/socket-connect';
import { useDispatch } from 'react-redux';
import { setUserStatus } from '../../../../redux/slice/private-chat';

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
    userData?: User | null;
    avatarOnPress?: () => void;
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
    userData,
    avatarOnPress
}) => {
    const dispatch = useDispatch()


    useEffect(() => {
        if (userData) {
            socket.on(userData?._id, async (data) => {
                dispatch(setUserStatus({
                    userId: data?.userId,
                    status: data.status
                }))
            })
        }
    }, [])

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
                onPress={onPress}
                android_ripple={{
                    color: them.selectedItemColor,
                }}>
                <>
                    <TouchableOpacity
                        onPress={avatarOnPress}>
                        <View
                            style={{
                                width: 15,
                                height: 15,
                                borderRadius: 30,
                                backgroundColor: userData?.isOnline ? them.SuccessButtonColor : them.subTextColor,
                                position: 'absolute',
                                right: 6,
                                bottom: 4,
                                zIndex: 1,
                            }} />
                        <Avatar
                            size={55}
                            style={{
                                marginHorizontal: 5,
                            }}
                            text={title[0]}
                            url={avatarUrl as string} />
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: 'flex-start',
                            paddingHorizontal: 10,
                        }}>
                        <View>
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
                            >{isTyping ? "typing..." : truncate(lastMessage, {
                                length: 15,
                                separator: '...',
                            })}
                            </Text>
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
                    </View>
                </>
            </Pressable>
        </Animated.View>
    )
};

export default PrivateChatCard;