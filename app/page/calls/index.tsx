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

// import { useEffect, useState } from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { Audio } from 'expo-av';

// export default function App() {
//   const [sound, setSound] = useState();

//   async function playSound() {
//     console.log('Loading Sound');
//     const { sound } = await Audio.Sound.createAsync({uri: 'http://13.127.232.152:4001/file/65b9fe641680d88be82392d6/1706729665833-65b9fe641680d88be82392d6.mp4'},)
//     setSound(sound);

//     console.log('Playing Sound');
//     await sound.playAsync();
//   }

//   useEffect(() => {
//     return sound
//       ? () => {
//           console.log('Unloading Sound');
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <Button title="Play Sound" onPress={playSound} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 10,
//   },
// });
