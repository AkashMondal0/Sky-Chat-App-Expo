// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';

// // First, set the handler that will cause the notification
// // to show the alert

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// // Second, call the method

// Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Look at that notification',
//     body: "I'm so proud of myself!",
//     badge: 1,
//     color: 'red',
//     categoryIdentifier: 'yes',
//   },
//   trigger: null,
// });
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-around',
//       }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 1 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

// //   if (Device.isDevice) {
// //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
// //     let finalStatus = existingStatus;
// //     if (existingStatus !== 'granted') {
// //       const { status } = await Notifications.requestPermissionsAsync();
// //       finalStatus = status;
// //     }
// //     if (finalStatus !== 'granted') {
// //       alert('Failed to get push token for push notification!');
// //       return;
// //     }
// //     // Learn more about projectId:
// //     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
// //     token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
// //     console.log(token);
// //   } else {
// //     alert('Must use physical device for Push Notifications');
// //   }

//   return token;
// }

import { View, Text } from 'react-native'
import React from 'react'

const Status = () => {
  return (
    <View>
      <Text>Status</Text>
    </View>
  )
}

export default Status