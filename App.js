import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform } from "react-native";
import ApolloClient from "apollo-boost";
import { Container } from "native-base";
import { Font } from "expo";
import { Ionicons } from '@expo/vector-icons';

import Logo from './src/Logo';
import { LoggedInPage, LoginPage } from "./src/components/auth/Login";
import DishForm from "./src/components/dish-crud/DishForm"
import DishList from "./src/components/dish-crud/DishList"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: "",
      googleToken: "",
      status: "logged out",
      userType: 0,
      email: "",
      loaded: false
    }

    this.restUrl = "https://deliveryclubsp.herokuapp.com/api/v1/graphql";

    const client = new ApolloClient({
      uri: this.restUrl
    });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({
      loaded: true
    });
  }

  clientId = () => {
    if (Platform.OS === "android") 
      return "125304975168-nq6lbk6lsu9pjv9jrcs05u6i90rcfgj0.apps.googleusercontent.com";
    else if (Platform.OS === "ios")
      return "125304975168-4v96av0qbt8jj0pc39of8a2maqhmm1sb.apps.googleusercontent.com"; 
  }

  signIn = async (userType) => {
    this.setState({
      userType: userType
    });
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
          googleToken: result.idToken,
          email: result.user.email
        });
        console.log(result);
        this.backendGoogleLogin(userType);
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("sign in error", e)
    }
  }

  backendGoogleLogin = async (userType) => {
    try {
      loginQuery = userType === 0 ? "query {consumerLoginGoogle{user_id}}" : "query {producerLoginGoogle{user_id}}";
      body = JSON.stringify({ query: loginQuery, token: this.state.googleToken });
      console.log(body);
      const result = await fetch(this.restUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: body
        }
      );
      
      responseJson = await result.json();
      if (result.ok) {
        this.setState({
          status: userType === 0 ? responseJson.data.consumerLoginGoogle.user_id : responseJson.data.producerLoginGoogle.user_id,
          userType: userType
        });
        console.log(this.state.status)
      } else {
        // probably can't sign in because not registered
        // try to register
        console.log(responseJson.errors);
        this.backendGoogleSignUp(userType);
      }
    } catch (e) {
      console.log("login error", e)
    }
  }

  backendGoogleSignUp = async (userType) => {
    try {
      query = userType === 0 ? "mutation {createConsumerGoogle{_id}}" : "mutation {createProducerGoogle{_id}}";
      body = JSON.stringify({ query: query, token: this.state.googleToken });
      console.log(body);
      const result = await fetch(this.restUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: body
        }
      );
      
      responseJson = await result.json();
      if (result.ok) {
        this.setState({
          status: userType === 0 ? responseJson.data.createConsumerGoogle._id : responseJson.data.createProducerGoogle._id,
          userType: userType
        });
      } else {
        console.log(responseJson.errors);
      }
    } catch (e) {
      console.log("sign up error", e);
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
    if (this.state.loaded) {
      return (
        <Container>
          {this.state.signedIn ? (
            <DishList logOut={this.logOut} user={this.state.userType} email={this.state.email} url={this.restUrl} googleToken={this.state.googleToken} />
          ) : (
            <LoginPage signIn={this.signIn} />
          )}
        </Container>
      )
    } else return (null)
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