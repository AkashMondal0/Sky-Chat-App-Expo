import React, { useCallback } from 'react'
import { View, Text, ScrollView, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, UserRoundPlus, UsersRound } from 'lucide-react-native';
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import UserCard from './components/User-Card';
import { RootState } from '../../../../redux/store';
import { fetchSearchUser } from '../../../../redux/apis/user';
import { User } from '../../../../types/profile';
import Padding from '../../../../components/shared/Padding';
import MyInput from '../../../../components/shared/Input';
import SingleCard from '../../../../components/shared/Single-Card';
import MultipleCard from '../../../../components/shared/Multiple-card';
import { PrivateChat } from '../../../../types/private-chat';
import uid from '../../../../utils/uuid';

export default function NewMessageScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.profile)
    const { List } = useSelector((state: RootState) => state.privateChat)
    const { searchUser: searchResult } = useSelector((state: RootState) => state.users)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

    const Color = useTheme.color;
    const iconColor = useTheme.iconColor;

    const { control, watch, formState: { errors } } = useForm({
        defaultValues: {
            search: '',
        }
    });

    const handleSearch = useCallback((search: string) => {
        if (search.trim().length > 0) {
            dispatch(fetchSearchUser(search) as any)
        }
    }, []);

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    const CreateConnectionUser = useCallback(async (receiverData: User) => {
        const getChat = List.find((item) => item.users?.find((item) => item === receiverData._id))

        if (getChat) {
            navigation.navigate('Chat', {
                userId: getChat?.userDetails?._id,
                newChat: false,
                chatDetails: getChat,
                userDetail: receiverData,
            })
        } else {
            try {

                const createNewConversation: PrivateChat = {
                    _id: '',
                    users: [user?._id, receiverData._id] as any,
                    lastMessageContent: '',
                    messages: [],
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    typing: false,
                }
                navigation.navigate('Chat', {
                    chatId: uid(),
                    userDetail: receiverData,
                    chatDetails: createNewConversation,
                    newChat: true
                })
            } catch (error: any) {
                ToastAndroid.show(error.response.data, ToastAndroid.SHORT)
            }
        }

    }, []);


    return (
        <ScrollView>
            <Padding size={10} />

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                marginHorizontal: 10,
            }}>
                <MyInput
                    debouncedHandleSearch={debouncedHandleSearch}
                    control={control}
                    secondaryText='To:'
                    height={45}
                    placeholder='Search'
                    name='search'
                    theme={useTheme} />

                {watch("search").length <= 0 ? <>
                    <SingleCard
                        label={'Add a Friend'}
                        iconBackgroundColor={useTheme.primary}
                        icon={<UserRoundPlus color={Color} />}
                        secondaryIcon={<ChevronRight color={iconColor} />} />

                    <SingleCard
                        onPress={() => navigation.navigate('NewGroup')}
                        label={'New Group'}
                        iconBackgroundColor={useTheme.selectedItemColor}
                        icon={<UsersRound color={Color} />}
                        secondaryIcon={<ChevronRight color={iconColor} />} />
                </> : <></>}


                <View style={{ width: "100%" }}>
                    <Text style={{
                        color: useTheme.textColor,
                        fontSize: 14,
                        fontWeight: '600',
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                    }}>Suggested</Text>
                </View>
                <MultipleCard theme={useTheme}>
                    {searchResult.filter((item) => item._id !== user?._id)
                        .map((item, index) => (
                            <UserCard
                                key={index}
                                theme={useTheme}
                                user={item}
                                avatarUrl={item.profilePicture}
                                onPress={() => CreateConnectionUser(item)}
                                iconBackgroundColor={useTheme.background}
                                secondaryIcon={<ChevronRight color={iconColor} />} />
                        ))}
                </MultipleCard>
            </View>
            <Padding size={10} />
        </ScrollView>
    )
}


