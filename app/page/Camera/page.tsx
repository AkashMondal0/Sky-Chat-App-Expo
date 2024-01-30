import React, { memo, useEffect } from 'react'
import { Camera, CameraType, } from 'expo-camera';
import { useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Icon_Button from '../../../components/shared/IconButton';
import { X, Zap, SwitchCamera, ImageIcon, Check } from 'lucide-react-native';
import { CurrentTheme } from '../../../types/theme';
import Padding from '../../../components/shared/Padding';
import { Assets, User } from '../../../types/profile';
import uid from '../../../utils/uuid';
import * as MediaLibrary from 'expo-media-library';
import MyButton from '../../../components/shared/Button';

interface SendImagesScreenProps {
    navigation?: any
    route?: {
        params: {
            type: "status" | "message",
            forDirectMessage?: {
                conversationId: string,
                content: string,
                member: User,
                receiver: User,
            } | null,
        }
    }
}
const CameraScreen = ({ navigation, route }: SendImagesScreenProps) => {
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const profileState = useSelector((state: RootState) => state.profile.user)
    const [type, setType] = useState(CameraType.back);
    const cameraRef = React.useRef<Camera>(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [media, setMedia] = useState<MediaLibrary.Asset[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [selectedAssets, setSelectedAssets] = useState<MediaLibrary.Asset[]>([]);



    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={{
                flex: 1,
                backgroundColor: useTheme.background,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    textAlign: 'center',
                    color: useTheme.textColor
                }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }


    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const photoCapture = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync(options);
            const data: Assets[] = [{
                _id: uid(),
                url: photo.uri,
                type: "image",
                caption: "",
            }]
            navigation.replace('Preview', {
                assets: data,
                user: profileState,
                type: route?.params.type,
                forDirectMessage: route?.params.forDirectMessage,
            })
        }
    }
    // Asset ID of the last item returned on the previous page. 
    // To get the ID of the next page, pass endCursor as its value.
    const fetchMediaPagination = async () => {
        // permission
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            return;
        }
        const {
            assets: mediaResult,
            endCursor,
        } = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo', 'video'],
            first: 20,
            sortBy: MediaLibrary.SortBy.creationTime,
            after: totalCount.toString(),
        });

        setMedia([...media, ...mediaResult]);
        setTotalCount(Number(endCursor))
    }

    const SelectAssets = async (assets: MediaLibrary.Asset) => {
        setSelectedAssets([...selectedAssets, assets])
    }

    const navigateToPreview = () => {
        const data: Assets[] = selectedAssets.map((item) => {
            return {
                _id: uid(),
                url: item.uri,
                type: item.mediaType === "photo" ? "image" : "video",
                caption: "",
            }
        })
        navigation.replace('Preview', {
            assets: data,
            user: profileState,
            type: route?.params.type,
            forDirectMessage: route?.params.forDirectMessage,
        })
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: useTheme.background,
        }}>
            <Camera
                ref={cameraRef}
                style={{
                    aspectRatio: 9 / 16,
                }} type={type}
                ratio="16:9">
                <Header
                    navigation={navigation}
                    theme={useTheme}
                />
                <View style={{
                    justifyContent: "flex-end",
                }}>
                    <View style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        paddingBottom: 10,
                    }}>
                        {selectedAssets.length > 0 ? <MyButton
                            width={70}
                            height={60}
                            radius={30}
                            title={selectedAssets.length.toString()}
                            icon={<Check size={30} color={"white"} />}
                            onPress={navigateToPreview}
                            theme={useTheme} /> : <></>}
                    </View>
                    <FlatList
                        contentContainerStyle={{
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            alignSelf: "flex-end",
                        }}
                        onEndReached={fetchMediaPagination}
                        data={media}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                            return <TouchableOpacity
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                                onPress={() => {
                                    if (selectedAssets.includes(item)) {
                                        const index = selectedAssets.indexOf(item);
                                        if (index > -1) {
                                            selectedAssets.splice(index, 1);
                                        }
                                        setSelectedAssets([...selectedAssets])
                                    } else {
                                        SelectAssets(item)
                                    }
                                }}>
                                {selectedAssets.includes(item) ? <View style={{
                                    position: "absolute",
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    zIndex: 1,
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <X size={40} color={"white"} />
                                </View> : <></>}
                                <Image source={{ uri: item.uri }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 10,
                                        marginHorizontal: 5,
                                        resizeMode: "cover",
                                        borderColor: useTheme.borderColor,
                                        borderWidth: 1,
                                    }} />
                            </TouchableOpacity>
                        }} />
                    <Footer navigation={navigation}
                        theme={useTheme}
                        photoCapture={photoCapture}
                        imagePicker={fetchMediaPagination}
                        toggleCameraType={toggleCameraType}
                    />
                </View>
            </Camera>
        </View>
    );
}

export default memo(CameraScreen)

const Header = ({
    navigation,
    theme,
}: {
    navigation?: any,
    theme?: any,
}) => {
    const backgroundColor = "white"
    const iconColor = "black"
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={{
                height: 60,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>

                    <Icon_Button
                        backgroundColor={backgroundColor}
                        theme={theme}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        size={30}
                        icon={<X size={20} color={iconColor} />} />

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        <Icon_Button
                            theme={theme}
                            backgroundColor={backgroundColor}
                            onPress={() => {

                            }}
                            size={30}
                            icon={<Zap size={20} color={iconColor} />} />

                    </View>
                </View>
            </View>
        </View>
    )
}

const Footer = ({
    navigation,
    theme,
    toggleCameraType,
    photoCapture,
    imagePicker,
}: {
    navigation?: any,
    theme?: CurrentTheme,
    toggleCameraType?: () => void,
    photoCapture?: () => void,
    imagePicker?: () => void,
}) => {
    const backgroundColor = "white"
    const iconColor = "black"
    return (
        <>
            <View style={{
                // height: 60,
                paddingTop: 20,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>

                    <Icon_Button
                        theme={theme!}
                        onPress={imagePicker}
                        backgroundColor={backgroundColor}
                        size={40}
                        icon={
                            <ImageIcon size={30} color={iconColor} />
                        } />
                    <View style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "transparent",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignContent: "center",
                        borderColor: "white",
                        borderWidth: 5,
                        padding: 30,
                    }}>
                        <TouchableOpacity
                            onPress={photoCapture}
                            activeOpacity={0.8}
                            style={{
                                width: 50,
                                height: 50,
                                backgroundColor: backgroundColor,
                                borderRadius: 30,
                                justifyContent: "center",
                                alignContent: "center",
                                alignSelf: "center",
                            }} />
                    </View>
                    <Icon_Button
                        theme={theme!}
                        backgroundColor={backgroundColor}
                        onPress={toggleCameraType!}
                        size={40}
                        icon={<SwitchCamera size={30} color={iconColor} />} />
                </View>
                <Padding size={30} />
            </View>
        </>
    )
}