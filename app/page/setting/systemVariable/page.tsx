import React, { useCallback, useContext } from 'react';
import { SafeAreaView, StatusBar, Text, ToastAndroid, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState } from '../../../../redux/store';
import Padding from '../../../../components/shared/Padding';
import MyInput from '../../../../components/shared/Input';
import MyButton from '../../../../components/shared/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StartServer } from '../../../../redux/slice/auth';
import Icon_Button from '../../../../components/shared/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import { ProfileContext } from '../../../../provider/Profile_Provider';

const SystemVariableScreen = ({ navigation }: any) => {

    const { error, loading, isLogin } = useSelector((state: RootState) => state.authState)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const profileContext = useContext(ProfileContext)
    const dispatch = useDispatch()
    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            mainUrl: '',
            storageUrl: '',
        },
    });

    const handleLogin = useCallback(async (data: {
        mainUrl: string,
        storageUrl: string,
    }) => {
        // dispatch(setServerValue(data))
        try {
            await AsyncStorage.setItem('mainUrl', data.mainUrl)
            await AsyncStorage.setItem('storageUrl', data.storageUrl)
            ToastAndroid.show("Server values saved", ToastAndroid.SHORT)
            // profileContext.fetchUserData?.()
            // navigation.goBack()
            dispatch(StartServer({ token: data.mainUrl }) as any)
        } catch (error) {
            ToastAndroid.show("Error in saving server values", ToastAndroid.SHORT)
        }

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 20,
            marginTop: StatusBar.currentHeight || 0,
        }}>
            {/* <Icon_Button
                onPress={() => navigation.goBack()}
                size={30} icon={<ArrowLeft
                    size={30} color={useTheme.textColor} />}
                theme={useTheme} /> */}
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
                }}>Server values</Text>
                <Text style={{
                    fontSize: 15,
                    color: useTheme.textColor,
                    marginBottom: 40,
                    marginHorizontal: 25,
                    textAlign: "center"
                }}>
                    Enter the server values to connect to the server [ Development ]
                </Text>

                <Text style={{
                    fontSize: 15,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 10,
                }}>
                    {error}
                </Text>
                <MyInput theme={useTheme}
                    placeholder='Main Api Key'
                    textContentType="URL"
                    keyboardType="url"
                    returnKeyType="next"
                    height={50}
                    control={control} name='mainUrl' />
                <Text style={{
                    fontSize: 12,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 4,
                }}>
                    {errors.mainUrl?.message}
                </Text>

                <MyInput theme={useTheme}
                    placeholder='Storage Api Key'
                    textContentType="URL"
                    keyboardType="url"
                    returnKeyType="next"
                    height={50}
                    control={control} name="storageUrl" />

                <Text style={{
                    fontSize: 12,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 4,
                }}>
                    {errors.storageUrl?.message}
                </Text>
                <Padding size={20} />

                <MyButton theme={useTheme}
                    onPress={handleSubmit(handleLogin)}
                    width={"100%"}
                    radius={10}
                    loading={loading}
                    disabled={loading}
                    fontWeight={'bold'}
                    title={'Save'} />
            </View>
        </SafeAreaView>
    );
};



export default SystemVariableScreen;