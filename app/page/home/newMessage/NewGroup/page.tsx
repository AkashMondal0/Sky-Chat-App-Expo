import { Animated, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Suspense, useContext } from 'react'
import { useSelector } from 'react-redux'
import { AnimatedContext } from '../../../../../provider/Animated_Provider'
import { RootState } from '../../../../../redux/store'
import Header from '../components/header'
import { User } from '../../../../../types/profile'
import { GroupConversation } from '../../../../../types/private-chat'
import { ArrowLeft, ImagePlus, XCircle } from 'lucide-react-native'
import Avatar from '../../../../../components/shared/Avatar'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Icon_Button from '../../../../../components/shared/IconButton'
import * as ImagePicker from 'expo-image-picker';
import MyInput from '../../../../../components/shared/Input'
import MyButton from '../../../../../components/shared/Button'
import Padding from '../../../../../components/shared/Padding'

const schema = z.object({
  GroupDescription: z.string()
    .max(50, { message: "GroupDescription must be at most 50 characters" }),
  GroupName: z.string()
    .max(200, { message: "GroupName must be at most 200 characters" })
    .nonempty({ message: "GroupName is required" }),
})
interface NewCreateGroupProps {
  navigation?: any
  route: {
    params: {
      users: User[],
      groupId: string,
    }
  }
}
const NewCreateGroup = ({
  navigation,
  route: { params }
}: NewCreateGroupProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
  const [image, setImage] = React.useState<any>(null);
  const { error, loading, isLogin } = useSelector((state: RootState) => state.authState)
  const { control, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      GroupName: '',
      GroupDescription: '',
    },
    resolver: zodResolver(schema)
  });
  // const NewGroup = {
  //   groupName: '',
  //   groupDescription: '',
  //   groupImage: '',
  //   members: users,
  //   lastMessageContent: '',
  //   groupId: groupId,
  // }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function handleRegister(data: { GroupName: string; GroupDescription: string }, image: any) {
    
  }

  return (
    <>
      <Animated.View style={{
        flex: 1,
        backgroundColor: AnimatedState.backgroundColor,
      }}>
        <ScrollView style={{
          flex: 1,
          padding: 20,
          marginTop: StatusBar.currentHeight || 0,
        }}>
          <Icon_Button
            onPress={() => navigation.goBack()}
            size={30} icon={<ArrowLeft
              size={30} color={useTheme.textColor} />}
            theme={useTheme} />

          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '700',
              color: useTheme.textColor,
              textAlign: 'center',
            }}>
              Create Group
            </Text>
            <Text style={{
              fontSize: 15,
              color: useTheme.textColor,
              marginBottom: 40,
              marginHorizontal: 25,
              textAlign: "center"
            }}>
              Create a new group and start chatting with your friends
            </Text>
            <Suspense>
              {
                image ?
                  <View style={{
                    width: 120,
                    height: 120,
                  }}>
                    <Avatar
                      size={120}
                      url={image}
                      onPress={pickImage} />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: useTheme.primaryBackground,
                        borderRadius: 20,
                      }}
                      onPress={() => setImage(null)}>
                      <XCircle size={30} color={useTheme.DangerButtonColor} />
                    </TouchableOpacity>
                  </View>
                  :
                  <TouchableOpacity onPress={pickImage} style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: useTheme.primaryBackground,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <View>
                      <ImagePlus size={60} color={useTheme.iconColor} />
                    </View>
                  </TouchableOpacity>}
            </Suspense>
            <Text style={{
              fontSize: 15,
              color: useTheme.DangerButtonColor,
              textAlign: "left",
              fontWeight: 'bold',
              margin: 10,
            }}>
              {/* {error} */}
            </Text>
            <MyInput theme={useTheme}
              placeholder='Group Name'
              textContentType="name"
              keyboardType="default"
              returnKeyType="next"
              control={control}
              height={50}
              name='GroupName' />
            <Text style={{
              fontSize: 12,
              color: useTheme.DangerButtonColor,
              textAlign: "left",
              fontWeight: 'bold',
              margin: 4,
            }}>
              {errors.GroupName?.message}
            </Text>
            {/* <Padding size={10} /> */}

            <MyInput theme={useTheme}
              placeholder='Group Description'
              textContentType="name"
              keyboardType="default"
              multiline={true}
              returnKeyType="next"
              height={50}
              control={control} name='GroupDescription' />
            <Text style={{
              fontSize: 12,
              color: useTheme.DangerButtonColor,
              textAlign: "left",
              fontWeight: 'bold',
              margin: 4,
            }}>
              {errors.GroupDescription?.message}
            </Text>

            <Text style={{
              color: useTheme.textColor,
              fontSize: 20,
              fontWeight: 'bold'
            }}>Members</Text>
            <FlatList
              data={params.users}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => {
                return <View>
                  <TouchableOpacity
                    onPress={() => {
                      // setAddToListUser(NewGroup.filter((i) => i._id !== item._id))
                    }}
                    style={{
                      position: "absolute",
                      zIndex: 100,
                      backgroundColor: useTheme.background,
                      borderRadius: 20 / 2,
                      alignSelf: "flex-end",
                      right: 5,
                      top: 5,
                    }}>
                    <XCircle color={useTheme.DangerButtonColor} />
                  </TouchableOpacity>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between', padding: 10, backgroundColor: useTheme.background, borderRadius: 10
                  }}>
                    <View>
                      <Avatar size={60} url={item.profilePicture} text={item.username} />
                      <Text style={{ color: useTheme.textColor, fontSize: 16, alignSelf: "center" }}>{item.username}</Text>
                    </View>
                  </View>
                </View>
              }}
            />
            <Padding size={20} />
            <MyButton theme={useTheme}
              onPress={handleSubmit((data) => handleRegister(data, image))}
              width={"100%"}
              radius={10}
              fontWeight={'bold'}
              loading={loading}
              disabled={loading}
              title={'Create Group'} />
          </View>
        </ScrollView>
      </Animated.View>
    </>
  )
}

export default NewCreateGroup