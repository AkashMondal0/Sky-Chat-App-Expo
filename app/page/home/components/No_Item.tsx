import { FC } from 'react';
import { Image, Text, View } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../../../types/theme';

interface NoItemProps {
    them?: CurrentTheme
}
const NoItem: FC<NoItemProps> = ({
    them
}) => {

    return (
        <View style={{
            borderRadius: 20,
            overflow: 'hidden',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image
                source={require('../../../../assets/images/nochat.png')}
                style={{
                    width: '80%',
                    height: 300,
                    resizeMode: 'contain'
                }}
            />

            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: them?.textColor
            }}>No Chat</Text>
        </View>
    )
};

export default NoItem;