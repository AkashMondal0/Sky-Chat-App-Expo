import React from 'react';
import {FC} from 'react';
import { View } from 'react-native';
import { CurrentTheme } from '../../../types/theme';

interface LoadingUserCardProps {
    theme:CurrentTheme
}
const LoadingUserCard:FC<LoadingUserCardProps> = ({
    theme
}) => {
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.background,
        borderRadius: 20,
        paddingVertical: 12,
        paddingLeft: 5,
        width: '100%',
    }}>
        <View style={{
            width: 55,
            height: 55,
            borderRadius: 55,
            backgroundColor: theme.primaryBackground,
            marginHorizontal: 5,
        }}/>
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        }}>
            <View style={{
                width: '80%',
                height: 20,
                borderRadius: 20,
                backgroundColor: theme.primaryBackground,
                marginBottom: 5,
            }}/>
            <View style={{
                width: '60%',
                height: 20,
                borderRadius: 20,
                backgroundColor: theme.primaryBackground,
                marginBottom: 5,
            }}/>
        </View>
    </View>
  );
};

export default LoadingUserCard;