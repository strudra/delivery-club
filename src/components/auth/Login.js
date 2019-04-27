import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import { Container, Text, Button } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    fontSize: 35,
    fontWeight: '700',
    marginBottom: 20,
    color: "white"

  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  image: {
    width: 150,
    height: 150,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 30
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 10,
    width: '85%',
    borderRadius: 20
  },
  loginPage: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    
  },
  button: {
    margin: 5,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  buttonContainer: {
    width: '70%',
    alignItems: 'center'
  },
  buttonText: {
    textAlign: 'center',
    flex: 1
  }
});

class BackgroundImage extends Component{

    render() {
        return(
            <ImageBackground source={require("./pizza.jpg")} style = {{ flex:1, width:null, height:null, resizeMode:"cover" }}>
                
               { this.props.children } 
                
            </ImageBackground>
        )
    }

}

class StylizedButton extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <TouchableOpacity style={styles.loginContainer} onPress={() => this.props.onPress()}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
  )};
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <BackgroundImage>
    <Container style={styles.loginPage}>
      <Text style={styles.header}>Delivery Club</Text>
      <View style={styles.buttonContainer}>
        <Button light style={styles.button} onPress={() => this.props.signIn(0)}>
          <Text style={styles.buttonText}>Sign in as Consumer</Text>
        </Button>
        <Button light style={styles.button} onPress={() => this.props.signIn(1)}>
          <Text style={styles.buttonText}>Sign in as Producer</Text>
        </Button>
      </View>
    </Container>
    </BackgroundImage>
  )};
};

class LoggedInPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: this.props.photoUrl }} />
      <Text style={styles.header}>{this.props.name}</Text>
      <Text style={styles.subtitle}>status: {this.props.userId}</Text>
      <StylizedButton onPress={() => this.props.logOut()} text="Logout" />
    </View>
  )};
};

export { LoginPage, LoggedInPage };
