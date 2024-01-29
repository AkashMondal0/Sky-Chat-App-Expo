import React, { useState, useContext, useCallback } from 'react';
import { Animated, View, Text, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import StatusHeader from './components/header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FlashList } from "@shopify/flash-list";
import SingleCard from '../../../components/shared/Single-Card';
import FloatingButton from '../../../components/shared/Floating';
import { Camera } from 'lucide-react-native';

interface StatusScreenProps {
  navigation?: any
}
const StatusScreen = ({ navigation }: StatusScreenProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useProfile = useSelector((state: RootState) => state.profile)
  const usePrivateChat = useSelector((state: RootState) => state.privateChat)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {

    }
  }

  const uploadStatus = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload status!');
    } else {
      pickImage()
    }

  }, [])

  return (
    <Animated.View style={{
      flex: 1,
      backgroundColor: AnimatedState.backgroundColor
    }}>
      <StatusHeader theme={useTheme}
        navigation={navigation}
        AnimatedState={AnimatedState} />
      <View style={{ margin: 5 }}>
        <SingleCard label={"My Status"}
          subTitle='Today, 10:00 PM'
          onPress={uploadStatus}
          height={80} />
      </View>
      <FlashList
        estimatedItemSize={100}
        renderItem={({ item }) => {
          return <View style={{ margin: 5 }}>
            <SingleCard label={item.name}
              subTitle='Today, 10:00 PM'
              height={80} />
          </View>
        }}
        getItemType={(item) => item.id}
        data={Array.from({ length: 100 }).map((_, i) => ({
          id: i,
          name: `Item ${i}`,
        }))}
        keyExtractor={(item) => item.id.toString()}
      />
      <FloatingButton
        onPress={uploadStatus}
        theme={useTheme}
        icon={<Camera color={useTheme.color}
          size={35} />} />
    </Animated.View>
  );
}

export default StatusScreen;