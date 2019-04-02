import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, Label, Body, Title, Button, List, Text, ListItem, CheckBox, Right, Left } from 'native-base';

import DishForm from "./DishForm";

export default class DishList extends Component {
	constructor(props) {
		super();
		this.state = {
      list: [],
      loaded: 0,
      form: 0,
      chosen: -1,
      email: "",
      dishName: "",
      dishDescription: "",
      dishPrice: 0,
      dishId: ""
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
        await this.setState({
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
    <ListItem key={i} onPress={() => {
      console.log("clicked on dish");
      this.setState((prev) => {
        return {
          chosen: prev.chosen === i ? -1 : i
        }
      });
      console.log(this.state.chosen);
    }}>
      {this.state.chosen === i ? (
        <Body>
          <Text>ID: {val._id}</Text>
          <Text>Name: {val.name}</Text>
          <Text>Description: {val.description}</Text>
          <Text>Price: ${val.price}</Text>
          <Text>Creator: {val.creator.email}</Text>
          {this.props.email === val.creator.email && this.props.user === 1 ? (
            <Button onPress={() => this.editDish(val._id, val.name, val.description,
              val.price, [])}>
              <Text>Edit</Text>
            </Button>
          ) : (null)}
        </Body>
      ) : (
        <Body>
          <Text>{val.name}</Text>
        </Body>
      )}
    </ListItem>
  ));

  editDish = (id, name, description, price, categories) => {
    console.log("dishid from list " + id);
    this.setState({
      dishId: id,
      dishName: name,
      dishDescription: description,
      dishPrice: price,
      form: 2
    });
  };

  createDish = () => {
    this.setState({
      dishId: -1,
      dishName: "",
      dishDescription: "",
      dishPrice: 0,
      form: 1
    });
  }

  closeForm = (update) => {
    if (update === 0) {
      this.setState({
        form: 0,
        loaded: 1
      });
    } else {
      this.setState({
        form: 0,
        loaded: 0
      });
      this.getList()
      .then(() => {
        this.setState({
          loaded: 1
        });
      });
    }
  }

  render() {
    if (this.state.form === 0) {
      return (
        <Container>
      <Header>
        <Left>
        <Button hasText transparent disabled={this.state.loaded === 0}
          onPress={() => { this.props.logOut() }}>
          <Text>Logout</Text>
        </Button>
        </Left>
        <Body>
          <Title>Dishes</Title>
        </Body>
        <Right>
          {this.props.user === 1 ? (
            <Button hasText transparent disabled={this.state.loaded === 0}
              onPress={() => { this.createDish() }}>
              <Text>Create</Text>
            </Button>
          ) : (null)}
        </Right>
      </Header>
      {this.state.loaded !== 0 && this.state.list.length === 0 ? (
        <Container>
          <Text style={{ flex:1, textAlign: "center" }}>No dishes</Text>
        </Container>
      ) : (
        <Content>
          <List>
            {this.props.googleToken !== undefined ? 
              this.state.loaded !== 0 ? 
              this.getDishList() : (<Text style={{ flex:1, textAlign: "center" }}>loading...</Text>) : 
              (<Text>no google token available</Text>)}
          </List>
        </Content>
      )}
      </Container>
      )
    } else {
      return (
        <DishForm
        mode={this.state.form === 1 ? 0 : 1}
        googleToken={this.props.googleToken}
        url={this.props.url}
        title={this.state.dishName}
        description={this.state.dishDescription}
        price={this.state.dishPrice.toString()}
        id={this.state.dishId}
        close={this.closeForm}/>
      )
    }
  }
}