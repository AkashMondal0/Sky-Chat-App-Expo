import { memo } from "react"
import { TextProps, Text as RNText } from "react-native"

const Text = memo(function ThemeView(props: TextProps) {

    return (
        <RNText style={{
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {props.children}
        </RNText>
    )
})

export default Text