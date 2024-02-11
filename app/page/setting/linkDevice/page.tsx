import { Animated, Button, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatedContext } from '../../../../provider/Animated_Provider'
import { RootState } from '../../../../redux/store'
import ActionSheet from '../../../../components/shared/ActionSheet'
import socket from '../../../../utils/socket-connect'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import MyButton from '../../../../components/shared/Button'
import { Camera, CameraType } from 'expo-camera'
import { Scan } from 'lucide-react-native'
interface LinkDeviceProps {
    navigation?: any
}
const LinkDevice = ({ navigation }: LinkDeviceProps) => {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const AnimatedState = useContext(AnimatedContext)
    const [scanned, setScanned] = useState(false) as any;
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const authToken = useSelector((state: RootState) => state.authState.token);

    const handleBarCodeScanned = ({ type, data }: {
        type: string,
        data: string
    }) => {
        setScanned(true);
        if (data) {
            socket.emit('qr_code_sender', {
                socketId: data,
                token: authToken
            });
            navigation.goBack()
        }else{
            ToastAndroid.show("Invalid QR Code", ToastAndroid.SHORT)
        }
    };



    useEffect(() => {
        if (permission === null) {
            requestPermission();
        }
    }, [])

    if (permission === null) {
        return <Text>Requesting for camera permission</Text>;
    }

    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: AnimatedState.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Camera style={{
                flex: 1,
                aspectRatio: 9 / 16,
                width: "100%",
            }}
                ratio='16:9'
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                type={CameraType.back}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Scan size={300}
                        strokeWidth={0.5}
                        color={"white"} />
                </View>
            </Camera>
        </Animated.View>
    )
}

export default LinkDevice