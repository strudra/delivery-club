import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform } from "react-native";
import ApolloClient from "apollo-boost"

import Logo from './src/Logo';
import { LoggedInPage, LoginPage } from "./src/components/auth/Login";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: "",
      googleToken: "",
      userId: "id",
    }

    this.restUrl = "https://deliveryclubsp.herokuapp.com/api/v1/graphql";

    const client = new ApolloClient({
      uri: this.restUrl
    });
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
          photoUrl: result.user.photoUrl,
          googleToken: result.idToken
        });
        console.log(result);
        this.fetchUserId();
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

fetchUserId = async () => {
  try {
    console.log(this.restUrl);
    const result = await fetch(this.restUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: "query {consumerLoginGoogle{user_id}}",
          token: this.state.googleToken
        })
      }
    );
    
    responseJson = await result.json();
    console.log(responseJson);
    if (result.ok) {
      this.setState({
        userId: responseJson.data.consumerLoginGoogle.user_id
      });
    }
  } catch (e) {
    console.log("error", e)
  }
}

  render() {
    return (
      <View style={styles.container}>
      {/*<Logo/>*/}
        {this.state.signedIn ? (
          <LoggedInPage name={this.state.name} photoUrl={this.state.photoUrl} userId={this.state.userId} />
        ) : (
          <LoginPage signIn={this.signIn} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16a085",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  image: {
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 30
  }
});