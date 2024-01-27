import React, { useState, useEffect } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import uid from '../../../utils/uuid';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', {
      //@ts-ignore
      uri: image?.uri,
      type: "image/jpeg",
      name: "akash.jpeg",
    } as any);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post('http://192.168.31.212:4001/file/multiple/akash', data, config);
    console.log(res.data)
  }
  // http://192.168.31.212:4001/file/multiple/akash
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload" onPress={uploadImage} />
    </View>
  );
}
