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
import uid from '../../../utils/uuid';

interface StatusScreenProps {
  navigation?: any
}
const StatusScreen = ({ navigation }: StatusScreenProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useProfile = useSelector((state: RootState) => state.profile)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const data = result.assets.map((item: any) => {
        item = {
          _id: uid(),
          url: item.uri,
          type: item.type,
          caption: "",
        }
        return item
      })

      navigation.navigate('StatusView', {
        assets: data,
        user: useProfile.user,
      })
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

      <FlashList
        estimatedItemSize={100}
        renderItem={({ item }) => {
          return <>
            <SingleCard label={item.name}
              subTitle='Today, 10:00 PM'
              backgroundColor={false}
              elevation={0}
              avatarSize={55}
              height={70} />
          </>
        }}
        getItemType={(item) => item.id}
        data={Array.from({ length: 100 }).map((_, i) => ({
          id: i,
          name: `Item ${i}`,
        }))}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
            <SingleCard label={"My Status"}
              subTitle='Today, 10:00 PM'
              backgroundColor={false}
              elevation={0}
              avatarSize={55}
              avatarUrl={useProfile.user?.profilePicture}
              onPress={uploadStatus}
              height={70} />
          </>
        )}
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