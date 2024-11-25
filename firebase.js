import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxRbBBwD6MhUftJQ2_Mku0bnFkI3qOEZw",
  authDomain: "studymate-956a7.firebaseapp.com",
  projectId: "studymate-956a7",
  storageBucket: "studymate-956a7.appspot.com",
  messagingSenderId: "877117529807",
  appId: "1:877117529807:android:125162ce90bbaff46761ba",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore();

const addSchedule = async (userId, scheduleData) => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return;
  }

  if (!scheduleData || !scheduleData.title || !scheduleData.date || !scheduleData.time) {
    console.error("Error: Invalid schedule data", scheduleData);
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "schedules"), {
      userId,
      ...scheduleData,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};


const getSchedules = async (userId) => {
  try {
    const q = query(collection(db, "schedules"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const schedules = [];
    querySnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });

    return schedules;
  } catch (e) {
    console.error("Error fetching schedules:", e);
  }
};

const updateSchedule = async (scheduleId, updatedData) => {
  const scheduleRef = doc(db, "schedules", scheduleId);
  await updateDoc(scheduleRef, updatedData);
};

const deleteSchedule = async (scheduleId) => {
  const scheduleRef = doc(db, "schedules", scheduleId);
  await deleteDoc(scheduleRef);
};

// Export Auth and Firestore
export { auth, addSchedule, getSchedules, updateSchedule, deleteSchedule };
