import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Body, Header, Content, Container, Text, Button } from "native-base";

const StylizedButton = props => {
  return (
    <TouchableOpacity style={styles.loginContainer} onPress={() => props.onPress()}>
      <Text style={styles.buttonText}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const LoginPage = props => {
  return (
    <Container style={styles.loginPage}>
      <Text style={styles.header}>Delivery Club</Text>
      <View style={styles.buttonContainer}>
        <Button light style={styles.button} onPress={() => props.signIn(0)}>
          <Text style={styles.buttonText}>Sign in as Consumer</Text>
        </Button>
        <Button light style={styles.button} onPress={() => props.signIn(1)}>
          <Text style={styles.buttonText}>Sign in as Producer</Text>
        </Button>
      </View>
    </Container>
  )
}

const LoggedInPage = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: props.photoUrl }} />
      <Text style={styles.header}>{props.name}</Text>
      <Text style={styles.subtitle}>status: {props.userId}</Text>
      <StylizedButton onPress={() => props.logOut()} text="Logout" />
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
    alignItems: "center",
    backgroundColor: "#8BC34A",
  },
  button: {
    margin: 5,
    width: "100%",
    alignSelf: "center",
    alignItems: "center"
  },
  buttonContainer: {
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    textAlign:"center",
    flex: 1
  },
});

export {LoginPage, LoggedInPage};