import { useCallback, useContext } from 'react';
import { AnimatedContext } from '../../../../provider/Animated_Provider';
import { CurrentTheme } from '../../../../types/theme';
import Animated from 'react-native-reanimated';
import MyInput from '../../../../components/shared/Input';
import { useForm } from "react-hook-form";
import { TouchableOpacity } from 'react-native';
import { ArrowLeft, XCircle } from 'lucide-react-native';
import Padding from '../../../../components/shared/Padding';


interface SearchListType {
    inputHandleControl: any,
    theme: CurrentTheme,
    reset: any
}

export default function SearchList({
    theme,
    inputHandleControl: control,
    reset
}: SearchListType) {
    const AnimatedState = useContext(AnimatedContext)

    const cancelHandle = useCallback(() => {
        AnimatedState.SearchList_off()
        reset()
    }, [])


    return (
        <>
            <Animated.View style={[{
                width: 0,
                height: 0,
                alignSelf: "flex-end",
                borderRadius: 100,
                backgroundColor: theme.background,
                position: "absolute",
                zIndex: 100,
                // elevation: 100,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
            }, AnimatedState.SearchList_Style]}>
                <Padding size={10} />
                <MyInput
                    control={control}
                    secondaryText='To:'
                    height={45}
                    placeholder='Search'
                    name='search'
                    theme={theme} />
                <TouchableOpacity
                    onPress={cancelHandle}>
                    <XCircle size={26} color={theme.iconColor} />
                </TouchableOpacity>
                <Padding size={10} />
            </Animated.View>
        </>
    );
}
