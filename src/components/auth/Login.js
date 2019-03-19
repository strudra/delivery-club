import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const LoginPage = props => {
  return (
    <View style={styles.loginPage}>
      <Text style={styles.header}>Delivery Club</Text>
      <TouchableOpacity style={styles.loginContainer} onPress={() => props.signIn()}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  )
}

const LoggedInPage = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: props.photoUrl }} />
      <Text style={styles.header}>{props.name}</Text>
      <Text style={styles.subtitle}>user_id: {props.userId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    textAlign:"center",
    fontSize: 25,
    marginBottom: 20
  },
  subtitle: {
    textAlign:"center",
    fontSize: 16,
    marginBottom: 20
  },
  image: {
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 30
  },
  loginContainer: {
    backgroundColor: "#fff",
    padding: 10,
    width: "85%",
    borderRadius: 20
  },
  loginPage: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    textAlign:"center",
    fontSize: 16,
    color: "#2196F3",
    margin: 10
  }
});

export {LoginPage, LoggedInPage};