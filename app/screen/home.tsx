import { ScrollView } from "@/components/skysolo-ui";
import { memo } from "react";
import { Button, Text } from "react-native";


const HomeScreen = memo(function HomeScreen({ navigation }: any) {
    return (
        <ScrollView>
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
        </ScrollView>
    )
})
export default HomeScreen;