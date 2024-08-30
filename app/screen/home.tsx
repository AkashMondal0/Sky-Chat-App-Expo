import { memo } from "react";
import { ThemedView } from "@/components/skysolo-ui";
import { Button, Text } from "react-native";
import { Navigation } from "@/types";


const HomeScreen = memo(function HomeScreen({navigation}:any) {
    return (
        <ThemedView style={{
            width: '100%',
            height: '100%',
            flex: 1,
            padding: 20

        }}>
             <Button title="Go to Home" onPress={() => {
                navigation?.navigate("message")
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Home Screen</Text>
        </ThemedView>
    )
})
export default HomeScreen;