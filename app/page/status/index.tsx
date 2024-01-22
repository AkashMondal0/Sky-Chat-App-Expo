import React, { useContext } from 'react'
import { View, Text, Animated } from 'react-native';
import { AnimatedContext } from '../../../provider/Animated_Provider';

export default function StatusScreen() {
    const AnimatedState = useContext(AnimatedContext)
    return (
        < >
            <Animated.View style={{
                backgroundColor: AnimatedState.backgroundColor,
                flex: 1,
            }}>
                <Text>Status Screen</Text>
            </Animated.View>
        </>
    )
}

