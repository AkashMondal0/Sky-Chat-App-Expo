import React, { useContext } from 'react'
import { View, Text, Animated, Button } from 'react-native';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import { getTableData, insertIntoTable } from '../../../utils/sqlLite';

export default function StatusScreen() {
    const AnimatedState = useContext(AnimatedContext)
    const setData = () => {
        insertIntoTable("sky", "mondal")
    }
    const getData = () => {
        console.log(getTableData("sky"))
    }

    return (
        < >
            <Animated.View style={{
                backgroundColor: AnimatedState.backgroundColor,
                flex: 1,
            }}>
                {/* {} */}
                {/* <Button title="set" onPress={setData} /> */}
                {/* <Button title="get" onPress={getData} /> */}
            </Animated.View>
        </>
    )
}

