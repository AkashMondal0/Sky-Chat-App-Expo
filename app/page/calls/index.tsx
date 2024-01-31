import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AnimatedContext } from '../../../provider/Animated_Provider'
import { RootState } from '../../../redux/store'
import { useSelector } from 'react-redux'

interface CallScreenProps {
  navigation?: any
}
const CallScreen = ({ navigation }: CallScreenProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

  return (
    <Animated.View style={{
      flex: 1,
      backgroundColor: AnimatedState.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{
        color: useTheme.textColor,
        fontSize: 20,
        fontWeight: 'bold'
      }}>Call Screen</Text>

    </Animated.View>
  )
}

export default CallScreen

const styles = StyleSheet.create({})