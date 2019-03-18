import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform } from "react-native";

import { ExpoLinksView } from "expo";

import Logo from './src/Logo';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: ""
    }
  }
  clientId = () => {
    if (Platform.OS === "android") 
      return "125304975168-nq6lbk6lsu9pjv9jrcs05u6i90rcfgj0.apps.googleusercontent.com";
    else if (Platform.OS === "ios")
      return "125304975168-4v96av0qbt8jj0pc39of8a2maqhmm1sb.apps.googleusercontent.com"; 
  }
  signIn = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        clientId: this.clientId(),
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          signedIn: true,
          name: result.user.name,
          photoUrl: result.user.photoUrl
        })
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <Logo/>
        {this.state.signedIn ? (
          <LoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} />
        ) : (
          <LoginPage signIn={this.signIn} />
        )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <View style={{ backgroundColor: "red", marginTop:-80 }}>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.signIn()} />
    </View>
  )
}

const LoggedInPage = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome:{props.name}</Text>
      <Image style={styles.image} source={{ uri: props.photoUrl }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    textAlign:"center",
    fontSize: 25,
    marginTop: 0

  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
});