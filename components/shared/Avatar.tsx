import React from 'react';
import { FC } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { CurrentTheme } from '../../types/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface AvatarProps {
    url?: string;
    size: number;
    style?: object;
    onPress?: () => void;
    onLongPress?: () => void;
    text?: string;
    theme: CurrentTheme
    border?: boolean
    AnimatedState: any
}
const Avatar: FC<AvatarProps> = ({
    url,
    size,
    style,
    onPress,
    onLongPress,
    text,
    theme,
    border,
    AnimatedState
}) => {

    if (!url) {
        return <Animated.View style={{
            width: size,
            height: size,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
            borderWidth: border ? 1 : 0,
            borderColor: theme?.borderColor,
            backgroundColor: AnimatedState.primaryBackgroundColor
        }}>
            <Text style={{
                fontSize: size / 2,
                color: theme?.textColor,
            }}>
                {text?.charAt(0).toUpperCase()}
            </Text>
        </Animated.View>
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