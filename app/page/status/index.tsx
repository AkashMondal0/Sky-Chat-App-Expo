import React from 'react'
import { View, Text, Pressable } from 'react-native';

export default function StatusScreen() {
    return (
        < >
            <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                <Pressable
                    android_ripple={{ color: 'red', borderless: false, }}
                    style={{ backgroundColor: 'blue', borderRadius: 10 }}>
                    <Text style={{ alignSelf: 'center' }}>Button</Text>
                </Pressable>
            </View>
        </>
    )
}

