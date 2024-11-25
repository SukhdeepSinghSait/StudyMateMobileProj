import * as Notifications from 'expo-notifications';

// Schedule a notification:
const scheduleNotification = async (scheduleTime, title) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: "You have an upcoming event!",
    },
    trigger: {
      seconds: scheduleTime, // Set the time before the notification is triggered
    },
  });
};
