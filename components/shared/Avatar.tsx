import React from 'react';
import { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { CurrentTheme } from '../../types/theme';

interface AvatarProps {
    url?: string;
    size: number;
    style?: object;
    onPress?: () => void;
    onLongPress?: () => void;
    text?: string;
    theme?: CurrentTheme
    border?: boolean
}
const Avatar: FC<AvatarProps> = ({
    url,
    size,
    style,
    onPress,
    onLongPress,
    text,
    theme,
    border
}) => {

    if (!url) {
        return <View style={{
            width: size, height: size,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme?.primaryBackground,
            ...style,
            borderWidth: border ? 1 : 0,
            borderColor: theme?.primaryTextColor,
        }}>
            <Text style={{
                fontSize: size / 2,
                color: theme?.color,
            }}>
                {text?.charAt(0).toUpperCase()}
            </Text>
        </View>
    }
    return (
        <Image
            source={{
                uri: url,
            }}
            style={{
                width: size, height: size,
                borderRadius: size / 2,
                justifyContent: 'center',
                resizeMode: 'cover',
                ...style,
            }}
        />
    );
};

export default Avatar;