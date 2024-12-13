// LoginScreen.js

import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Text, Provider as PaperProvider, ActivityIndicator } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import theme from "../theme";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        Alert.alert("Login Successful", "You have successfully logged in!");
        
        // Reset navigation stack and navigate to Main
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { userId: userCredential.user.uid } }],
        });
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("Error", error.message);
      });
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Button
            mode="contained"
            onPress={handleLogin}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            labelStyle={{ color: '#fff' }}
          >
            Login
          </Button>
        )}
        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          Don't have an account? Sign Up
        </Text>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: -50,
    
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 16,
    color: "black",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;