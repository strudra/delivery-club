import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform } from "react-native";
import ApolloClient from "apollo-boost";
import { Container } from "native-base";

import Logo from './src/Logo';
import { LoggedInPage, LoginPage } from "./src/components/auth/Login";
import DishForm from "./src/components/dish-crud/DishForm"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: "",
      googleToken: "",
      status: "logged out",
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
        this.backendGoogleLogin();
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  backendGoogleLogin = async () => {
    try {
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
      if (result.ok) {
        this.setState({
          status: responseJson.data.consumerLoginGoogle.user_id
        });
      } else {
        // probably can't sign in because not registered
        // try to register
        console.log(responseJson.errors);
        this.backendGoogleSignUp();
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  backendGoogleSignUp = async () => {
    try {
      const result = await fetch(this.restUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: "mutation {createConsumerGoogle{_id}}",
            token: this.state.googleToken
          })
        }
      );
      
      responseJson = await result.json();
      if (result.ok) {
        this.setState({
          status: responseJson.data.createConsumerGoogle._id
        });
      } else {
        console.log(responseJson.errors);
      }
    } catch (e) {
      console.log("error", e);
    }
  }

  logOut = () => {
    this.setState({
      signedIn: false,
      status: "logged out",
      googleToken: ""
    });
  }

  render() {
    return (
      <Container>
        <DishForm />
      {/*<View style={styles.container}>
      <Logo/>*/}
        {/*this.state.signedIn ? (
          <LoggedInPage
            name={this.state.name}
            photoUrl={this.state.photoUrl}
            userId={this.state.status}
            logOut={this.logOut}
          />
        ) : (
          <LoginPage signIn={this.signIn} />
        )*/}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BC34A",
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