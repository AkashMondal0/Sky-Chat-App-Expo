import { FC } from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import React from 'react';
interface MyStatusBarProps {
    translucent?: boolean;
}
const MyStatusBar: FC<MyStatusBarProps> = ({
    translucent,
}) => {
    const Theme = useSelector((state: RootState) => state.ThemeMode)

    return (<>
        <StatusBar
            barStyle={Theme.StatusBar}
            backgroundColor={Theme.currentTheme.background}
            translucent={translucent} />
    </>
    )
};

export default MyStatusBar;