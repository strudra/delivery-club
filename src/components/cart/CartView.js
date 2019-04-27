import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, 
Label, Body, Title, Button, Text, ListItem, CheckBox, Left, Right } from 'native-base';

import CartItem from './CartItem';

export default class CartView extends Component {
  constructor(props) {
    super();
    this.state = {
      items: props.items,
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
      </Container>
    )
  }
}