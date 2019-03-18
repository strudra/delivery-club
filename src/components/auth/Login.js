import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform } from "react-native";

const LoginPage = props => {
  return (
    <View style={styles.loginPage}>
      <Text style={styles.header}>Delivery Club</Text>
      <View style={styles.loginContainer}>
        <Button title="Sign in with Google" onPress={() => props.signIn()} />
      </View>
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
    backgroundColor: "#16a085",
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
    backgroundColor: "#ecf0f1",
    padding: 15,
    width: "80%",
    borderRadius: 20
  },
  loginPage: {
    flex: 1,
    justifyContent: "space-evenly"
  }
});

export {LoginPage, LoggedInPage};