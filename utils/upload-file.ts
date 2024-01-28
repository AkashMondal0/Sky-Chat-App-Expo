import axios from "axios";

const skyUploadImage = async (filesUri: string[],userId:string) => {
  try {
    const data = new FormData();
    for (let i = 0; i < filesUri.length; i++) {
      data.append('file', {
        //@ts-ignore
        uri: filesUri[i],
        type: "image/jpeg",
        name: `${userId}.jpeg`,
      } as any);
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`http://192.168.31.212:4001/file/multiple/${userId}`, data, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export {
  skyUploadImage
}