import axios from "axios";

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

  export {
        uploadImage
  }