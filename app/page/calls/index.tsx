import React, { useContext } from 'react'
import { View, Text, Animated } from 'react-native';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export default function CallsScreen() {
    const AnimatedState = useContext(AnimatedContext)
    const theme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    return (
        < >
            <Animated.View style={{
                backgroundColor: AnimatedState.backgroundColor,
                flex: 1,
            }}>
                <Text>Calls Screen</Text>
                <ContentLoader viewBox="0 0 380 70" backgroundColor={theme.primaryBackground}>
                    <Circle cx="30" cy="30" r="30" />
                    <Rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <Rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
            </Animated.View>
        </>
    )
}
