import React, { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native';
import { CurrentTheme } from '../../../../../types/theme';
import { User } from '../../../../../types/profile';
import Avatar from '../../../../../components/shared/Avatar';

interface Props {
    theme: CurrentTheme
    icon?: React.ReactNode
    secondaryIcon?: React.ReactNode
    iconBackgroundColor?: string
    avatarUrl?: string
    subTitle?: string
    textColor?: string
    height?: number
    onPress?: () => void
    user: User
}

const UserCard: React.FC<Props> = ({
    theme,
    icon,
    secondaryIcon,
    iconBackgroundColor,
    avatarUrl,
    subTitle,
    textColor,
    height,
    onPress,
    user
}) => {

    const titleTextSize = 16;
    const textWeight = "500";

    return (
        <>
            <View style={{
                borderRadius: 20,
                width: '100%',
                overflow: 'hidden',
                elevation: 0.5,
            }}>
                <Pressable
                    onPress={onPress}
                    android_ripple={{ color: theme.selectedItemColor, borderless: false, }}
                    style={{
                        backgroundColor: theme.cardBackground,
                        borderRadius: 20,
                        height: height || 70,
                    }}>
                    <View style={{
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        gap: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                            <View style={{
                                backgroundColor: iconBackgroundColor,
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {icon ? icon : <Text style={{
                                    fontSize: titleTextSize,
                                    fontWeight: textWeight,
                                    color: textColor || theme.textColor,
                                }}>
                                    {user.email[0].toLocaleUpperCase()}
                                </Text>}
                                {avatarUrl && <Avatar url={avatarUrl} size={40} />}
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: titleTextSize,
                                    fontWeight: textWeight,
                                    color: textColor || theme.textColor,
                                }}>
                                    {user.username}
                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: textColor || theme.textColor,
                                }}>
                                    {user.email}
                                </Text>
                            </View>
                        </View>
                        {secondaryIcon}
                    </View>
                </Pressable>
            </View>
        </>
    )
}

export default UserCard