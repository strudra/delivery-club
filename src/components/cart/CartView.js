import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, 
  Label, Body, Title, Button, Text, ListItem, CheckBox, Left, Right } from 'native-base';

import CartItem from './CartItem';

export default class CartView extends Component {
  constructor(props) {
    super();
    this.state = {
      items: props.items === undefined ? [] : props.items,
      inProcess: false
    };
  }

  getItemList = () => this.state.items.map((val, i) => (
    <CartItem
      data={val}
      key={i}
      add={this.increaseQuantity}
      remove={this.decreaseQuantity}
      delete={this.deleteFromCart}
    />
  ))

  increaseQuantity = (id) => {
    let ind = this.state.items.findIndex((val) => val.id === id);
    this.setState(prev => {
      prev.items[ind].quantity += 1;
      return {
        items: prev.items
      }
    });
  }

  decreaseQuantity = (id) => {
    let ind = this.state.items.findIndex((val) => val.id === id);
    this.setState(prev => {
      if (prev.items[ind].quantity > 1) prev.items[ind].quantity -= 1;
      return {
        items: prev.items
      }
    });
  }

  deleteFromCart = (id) => {
    this.setState(prev => {
      return {
        items: prev.items.filter(val => val.id !== id)
      }
    });
  }

  sendQuery = async (token, query, callback) => {
    try {
      body = JSON.stringify({
        query: query,
        token: token
      });

      console.log(body);

      const result = await fetch(this.props.url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: body
        }
      );
      
      responseJson = await result.json();
      if (result.ok) { } 
      else {
        console.log(responseJson.errors);
      }
    } catch (e) {
      console.log("error", query, e);
    }

    callback(responseJson.data);
  }

  closePlaceOrder = async (cartItems) => {
    query = `mutation { createOrder(dishesIds: [${cartItems.toString()}]) { _id, totalCost }}`;
    await this.sendQuery(this.props.googleToken, query, (val) => {
      try {
        var totalCost = val.dishesIds.totalCost;
        this.setState({
          items: []
        });
        alert(`You have been charged $${totalCost}.`);
      } catch {
        alert(`Could not place the order. Try again.`);
      }

      this.setState({
        inProcess: false
      });
    });
  }

  render(props) {
    return (
      <Container>
        <Header>
          <Left>
            <Button hasText transparent onPress={() => { this.props.close(this.state.items)} }>
              <Text>Close</Text>
            </Button>
          </Left>
          <Body>
            <Title>Cart</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          { this.getItemList() }
        </Content>
        <View style={styles.buttons}>
          <Button bordered success style={styles.button} disabled={this.state.items.length === 0 || this.state.inProcess} 
            onPress={() => {
              this.setState({
                inProcess: true
              });
              var items = this.state.items.map((val) => `"${val.id}"`);
              this.closePlaceOrder(items);
            }}>
            <Text style={styles.buttonText}>Place Order</Text>
          </Button>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: "5%",
  },
  button: {
    flex: 1
  },
  buttonText: {
    flex: 1,
    textAlign: "center"
  }
});