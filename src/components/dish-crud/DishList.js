import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, Label, Body, Title, Button, List, Text, ListItem, CheckBox } from 'native-base';

export default class DishList extends Component {
	constructor(props) {
		super();
		this.state = {
      list: [],
      loaded: 0
    };
  }
  
  getList = async () => {
    try {
      body = JSON.stringify({
        query: "query {dishes{ _id name description price categories {name} creator {email} }}",
        token: this.props.googleToken
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
      if (result.ok) {
        console.log(responseJson.data.dishes);
        this.setState({
          list: responseJson.data.dishes
        });
      } else {
        console.log(responseJson.errors);
      }
    } catch (e) {
      console.log("dish list error", e);
    }
  }

  componentDidMount() {
    this.getList()
    .then(() => {
      this.setState({
        loaded: 1
      });
    });
  }

  getDishList = () => this.state.list.map((val, i) => (
    <ListItem key={i} onPress={() => {}}>
      <Body>
        <Text>ID: {val._id}</Text>
        <Text>Name: {val.name}</Text>
        <Text>Description: {val.description}</Text>
        <Text>Price: ${val.price}</Text>
        <Text>Creator: {val.creator.email}</Text>
      </Body>
    </ListItem>
  ));

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Dishes</Title>
          </Body>
        </Header>
        <Content>
          <List>
            {this.props.googleToken !== undefined ? 
              this.state.loaded !== 0 ? 
              this.getDishList() : (<Text style={{ flex:1, textAlign: "center" }}>loading...</Text>) : 
              (<Text>no google token available</Text>)}
          </List>
        </Content>
      </Container>
    );
  }
}