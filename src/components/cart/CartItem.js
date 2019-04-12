import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, 
  Label, Body, Title, Button, Text, ListItem, CheckBox, Left, Right } from 'native-base';

export default class CartItem extends Component {
  constructor(props) {
    super();
    this.state = {
      data: props.data
    };
  }

  render(props) {
    return (
      <ListItem>
        <Text>{this.state.data.name}</Text>
        <Button rounded light onPress={() => this.props.remove(this.state.data.id)}
          style={styles.roundButton}>
          <Text style={styles.buttonText}>-</Text>
        </Button>
        <Text> {this.state.data.quantity} </Text>
        <Button rounded light onPress={() => this.props.add(this.state.data.id)}
          style={styles.roundButton}>
          <Text style={styles.buttonText}>+</Text>
        </Button>
        <Button rounded danger onPress={() => this.props.delete(this.state.data.id)}
          style={styles.roundButton}>
          <Text style={styles.buttonText}>×</Text>
        </Button>
      </ListItem>
    )
  }
}

const styles = StyleSheet.create({
  roundButton: {
    width: 32,
    height: 32,
    margin: 4,
  },
  buttonText: {
    flex: 1,
    textAlign: "center"
  }
});