import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

const getLocalhost = async () => {
    return AsyncStorage.getItem('mainUrl')
}

const localhost = getLocalhost();

const socket = io(`${localhost}/`);

export default socket;