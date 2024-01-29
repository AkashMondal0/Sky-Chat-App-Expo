import React, { memo, useEffect, useRef } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import { Status, User } from '../../../../types/profile'
import Wallpaper_Provider from '../../../../provider/Wallpaper_Provider'
import { useDispatch, useSelector } from 'react-redux'
import StatusHeader from './components/header'
import Padding from '../../../../components/shared/Padding'
import { RootState } from '../../../../redux/store'
import { ImagePlus, Send } from 'lucide-react-native'
import MyButton from '../../../../components/shared/Button'
import { CurrentTheme } from '../../../../types/theme'
import * as ImagePicker from 'expo-image-picker';
import uid from '../../../../utils/uuid'
import { uploadStatusApi } from '../../../../redux/slice/status'


interface StatusScreenProps {
    navigation?: any
    route?: {
        params: {
            assets: Status[],
            user: User,
        }
    }
}
const StatusViewScreen = ({ navigation, route }: StatusScreenProps) => {
    const dispatch = useDispatch()
    const useThem = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const profileState = useSelector((state: RootState) => state.profile.user)
    const [selectHeroImage, setSelectHeroImage] = React.useState<Status>(route?.params.assets[0] as Status)
    const profile = route?.params.user
    const [assets, setAssets] = React.useState<Status[]>(route?.params.assets || [])
    const statusState = useSelector((state: RootState) => state.statusState)

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
                    createdAt: new Date(),
                }
                return item
            })

            setAssets([...assets, ...data])
            setSelectHeroImage(data[0])
        }
    }

    const uploadStatus = async () => {
        await dispatch(uploadStatusApi({
            _id: profile?._id || profileState?._id as string,
            status: assets,
        }) as any)
        navigation.goBack()
    }




    return (<Wallpaper_Provider
        resizeMode="contain"
        url={selectHeroImage.url}
        backgroundColor={"black"}>
        <StatusHeader theme={useThem} navigation={navigation} />
        <View style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
        }}>
            <View style={{
                justifyContent: "flex-end",
                width: "100%",
                height: 80,
            }}>
                <FlatList data={assets}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        width: "100%",
                        height: 100,
                        flex: 1,
                        alignContent: "flex-end",
                    }}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity onPress={() => setSelectHeroImage(item)}>
                            <Image source={{ uri: item.url }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 10,
                                    marginHorizontal: 5,
                                    resizeMode: "cover",
                                    borderColor: useThem.borderColor,
                                    borderWidth: 1,
                                }} />
                        </TouchableOpacity>
                    }} />
            </View>
            <Footer useTheme={useThem}
                selectHeroImage={selectHeroImage}
                assets={assets}
                loading={statusState.fetchLoading}
                pickImage={pickImage}
                setAssets={setAssets}
                submitStatus={uploadStatus} />
            <Padding size={30} />
        </View>
    </Wallpaper_Provider>)

}

export default memo(StatusViewScreen)

const Footer = ({ useTheme,
    submitStatus, pickImage,
    assets,
    setAssets,
    selectHeroImage,
    loading,
}: {
    useTheme: CurrentTheme,
    pickImage?: () => void,
    submitStatus: () => void
    assets: Status[]
    setAssets: (data: Status[]) => void
    selectHeroImage: Status
    loading?: boolean
}) => {

    const _color = useTheme.textColor
    const backgroundColor = useTheme.background
    const inputRef = useRef<any>(null);

    // useEffect(() => {
    //     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    //         inputRef.current.blur();
    //     });

    //     return () => {
    //         hideSubscription.remove();
    //     };
    // }, []);


    const onChangeText = (text: string) => {
        const index = assets.findIndex((item) => item._id === selectHeroImage._id)
        assets[index].caption = text
        setAssets([...assets])
    }


    return <>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 8,
            gap: 10,
        }}>
            <View style={{
                backgroundColor: backgroundColor,
                // width: "85%",
                flex: 1,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                maxHeight: 100,
                paddingHorizontal: 10,
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    elevation: 5,
                    gap: 5,
                }}>
                    <TouchableOpacity onPress={pickImage}>
                        <ImagePlus
                            size={25}
                            color={_color}
                        />
                    </TouchableOpacity>
                    <TextInput
                        onBlur={() => {
                            // onBlur()
                            // Keyboard.dismiss()
                        }}
                        ref={inputRef}
                        onChangeText={onChangeText}
                        value={assets.find((item) => item._id === selectHeroImage._id)?.caption}
                        multiline={true}
                        style={{
                            minHeight: 45,
                            width: "85%",
                            borderRadius: 100,
                            color: _color,
                            fontSize: 18,
                            flex: 1,
                        }}
                        placeholder="Caption"
                        placeholderTextColor={_color} />
                </View>
            </View>
            <MyButton theme={useTheme}
                onPress={submitStatus}
                variant="primary"
                radius={100}
                padding={8}
                width={55}
                elevation={5}
                loading={loading}
                icon={<Send size={30} color={useTheme.color} />} />
        </View>
    </>
}