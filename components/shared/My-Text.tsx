import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Text } from 'react-native';
import React from 'react';

interface MyTextProps {
    children: string;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
}
const MyText: FC<MyTextProps> = ({
    children,
    color,
    fontSize,
    fontWeight,
    fontFamily
}) => {
    // const themeValue = useSelector((state: RootState) => state.ThemeMode.current_theme)
    
    return (
        <>
            <Text
                style={{
                    // color: color ? color : themeValue === "dark" ? "white" : "black",
                    fontSize: fontSize ? fontSize : 15,
                    fontWeight: fontWeight ? fontWeight : "normal" as any,
                    fontFamily: fontFamily,
                }}
            >
                {children}
            </Text>
        </>
    );
};

export default MyText;