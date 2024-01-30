import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Animated, View, Text, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import StatusHeader from './components/header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FlashList } from "@shopify/flash-list";
import SingleCard from '../../../components/shared/Single-Card';
import FloatingButton from '../../../components/shared/Floating';
import { Camera } from 'lucide-react-native';
import uid from '../../../utils/uuid';
import { getFriendStatuses } from '../../../redux/slice/status';
import privateChat from '../../../redux/slice/private-chat';
import { Status, User } from '../../../types/profile';
import { timeFormat } from '../../../utils/timeFormat';

interface StatusScreenProps {
  navigation?: any
}
const StatusScreen = ({ navigation }: StatusScreenProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useProfile = useSelector((state: RootState) => state.profile)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
  const statusState = useSelector((state: RootState) => state.statusState)
  const { friendListWithDetails } = useSelector((state: RootState) => state.privateChat)
  const dispatch = useDispatch()


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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

  const fetchStatus = useCallback(async () => {
    if (useProfile?.user) {
      dispatch(getFriendStatuses({
        profileId: useProfile.user?._id,
        friendIds: friendListWithDetails.map((item) => item._id)
      }) as any)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [useProfile?.user])

  const ViewStatus = useCallback((data: { user: User, statuses: Status[] }) => {
    if (data.statuses.length === 0) {
      uploadStatus()
    }
    else {
      navigation.navigate('ViewStatus', {
        assets: data.statuses,
        user: data.user,
      })
    }
  }, [])
  // console.log(statusState.myStatus)
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
          const user = friendListWithDetails.find((friend) => friend._id === item.userId)
          return <>
            {
              item.status.length >= 1 ?
                <SingleCard
                  label={user?.username || ''}
                  subTitle={timeFormat(item.status[item.status.length - 1].createdAt).toString()}
                  backgroundColor={false}
                  elevation={0}
                  avatarSize={55}
                  avatarUrl={user?.profilePicture}
                  onPress={() => { ViewStatus({ user: user, statuses: item.status } as any) }}
                  height={70} /> : null
            }
          </>
        }}
        getItemType={(item) => item.userId}
        data={statusState.friendStatus}
        keyExtractor={(item) => item.userId.toString()}
        ListHeaderComponent={() => (
          <>
            <SingleCard label={"My Status"}
              subTitle='Today, 10:00 PM'
              backgroundColor={false}
              elevation={0}
              avatarSize={55}
              avatarUrl={useProfile.user?.profilePicture}
              onPress={() => {
                ViewStatus({
                  user: useProfile.user,
                  statuses: statusState.myStatus?.status
                } as any)
              }}
              height={70} />
            <View style={{
              height: 40,
              justifyContent: "center",
              paddingHorizontal: 15,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: "bold",
                color: useTheme.textColor,
              }}>Recent Updates</Text>
            </View>
          </>
        )}
        // refreshing={statusState.fetchLoading}
        // onRefresh={fetchStatus}
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