import { RootState } from "@/redux/store"
import { View, type ViewProps } from 'react-native';
import { useSelector, shallowEqual } from "react-redux"
import ThemeColors from "@/constants/shadcn.color.v1.json"

export type ThemedViewProps = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const ThemedView = ({ style, ...otherProps }: ThemedViewProps) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return null
    return (
        <View style={[{ backgroundColor: `hsl(${currentTheme.destructive})` }, style]} {...otherProps} />
    )
}

export default ThemedView