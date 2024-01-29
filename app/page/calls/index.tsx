import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const video = React.useRef(null) as any;
  const [status, setStatus] = React.useState({});
  const [videoUri, setVideoUri] = React.useState(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri)
    }
  }
  return (
    <View style={styles.container}>
      {videoUri && <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "http://13.127.232.152:4001/file/test/1706532866909-4_5887441612014880094.mp4",
        }}
        // useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />}
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
        <Button title={'Upload'} onPress={pickImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: "100%",
    height: "100%",
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
