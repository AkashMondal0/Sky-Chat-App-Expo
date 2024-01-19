import { FC } from 'react';
import { View, Text } from 'react-native';
import { primary_color, secondary_color_dark } from '../color/schema';
import React from 'react';

interface HeaderProps {
    theme: "light" | "dark";
}
const Header: FC<HeaderProps> = ({
    theme
}) => {
    return (
        <View style={{
            height: 90,
            backgroundColor: theme === "dark" ? secondary_color_dark : primary_color,
        }}>
            <Text style={{}}>Home Screen</Text>
        </View>
    );
};

export default Header;