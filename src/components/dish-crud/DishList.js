import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Container, Header, Content, Body, Title, Button, List, Text, ListItem, CheckBox, Right, Left } from 'native-base';

import DishForm from "./DishForm";
import CartView from '../cart/CartView';
import SearchForm from './SearchForm';

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
      dishId: "",
      categories: [],
      cartList: [],
      search: "",
      allCategories: [],
      selectedCategories: []
    };
  }
  
  sendQuery = async (token, query, callback) => {
    try {
      body = JSON.stringify({
        query: query,
        token: token
      });
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

  receiveCategories = async () => {
    query = `query { categories { _id, name }}`;
    await this.sendQuery(this.props.googleToken, query, (val) => {
      this.setState({
        allCategories: val.categories
      });
    });
  }

  filterDishes = async (categories, minPrice, maxPrice) => {
    cats = categories.map(v => `"${v}"`);
    console.log("NEW: " + cats);
    console.log("OLD: " + categories);
    query = `query {dishesFiltered(filterInput: {minPrice: ${minPrice}, maxPrice: ${maxPrice}, categoriesIds: [${cats}]}){ _id name description price categories {name, _id} creator {email} }}`;
    console.log("QUERY " + query);
    await this.sendQuery(this.props.googleToken, query, (val) => {
      this.setState({
        list: val.dishesFiltered
      });
    });
  }

  sortDishes = async (field) => {
    dishes = []
    switch (field) {
      case 0:
        dishes = this.state.list.sort((a, b) => a.name > b.name); break;
      case 1:
        dishes = this.state.list.sort((a, b) => a.description > b.description); break;
      case 2:
        dishes = this.state.list.sort((a, b) => a.price > b.price); break;
      case 3:
        dishes = this.state.list.sort((a, b) => a.creator > b.creator); break;
      default:
        return;
    }
-
    this.setState({
      list: dishes
    });
  }

  getList = async () => {
    try {
      body = JSON.stringify({
        query: "query {dishes{ _id name description price categories {name, _id} creator {email} }}",
        token: this.props.googleToken
      });
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

  async componentDidMount() {
    this.update();
  }

  getDishList = () => this.state.list.filter((v) => 
    v.name.toLowerCase().includes(this.state.search.toLowerCase())).map((val, i) => (
    <ListItem key={i} onPress={() => {
      this.setState((prev) => {
        return {
          chosen: prev.chosen === i ? -1 : i
        }
      });
    }}>
      {this.state.chosen === i ? (
        <Body>
          <Text>ID: {val._id}</Text>
          <Text>Name: {val.name}</Text>
          <Text>Description: {val.description}</Text>
          <Text>Price: ${val.price}</Text>
          <Text>Creator: {val.creator.email}</Text>
          <Text>Categories: {JSON.stringify(val.categories)}</Text>
          {this.props.email === val.creator.email && this.props.user === 1 ? (
            <Button onPress={() => this.editDish(val._id, val.name, val.description,
              val.price, val.categories)}>
              <Text>Edit</Text>
            </Button>
          ) : (null)}
          {this.props.user === 0 ? (
            <Button success onPress={() => this.addDishToCard(val._id, val.name, val.description,
              val.price, val.categories)}>
              <Text>Add to Cart</Text>
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

  addDishToCard = (id, name, description, price) => {
    this.setState((prev) => {
      let ind = prev.cartList.findIndex(val => val.id === id);
      if (ind >= 0) {
        prev.cartList[ind].quantity += 1;
        return {
          cartList: prev.cartList,
        }
      } else {
        return {
          cartList: prev.cartList.concat({
            id: id, 
            name: name, 
            description: description, 
            price: price,
            quantity: 1,
          })
        }
      }
    });
  }

  goToCart = () => {
    this.setState({
      form: 3
    });
  }

  editDish = (id, name, description, price, categories) => {
    console.log("dishid from list " + id);
    console.log(categories)
    this.setState({
      dishId: id,
      dishName: name,
      dishDescription: description,
      dishPrice: price,
      form: 2,
      categories: categories
    });
  };

  createDish = () => {
    this.setState({
      dishId: -1,
      dishName: "",
      dishDescription: "",
      dishPrice: 0,
      form: 1,
      categories: []
    });
  }

  update = () => {
    this.setState({
      loaded: 0,
      cartList: []
    });
    this.receiveCategories().then(() => console.log("allCategories: " + this.state.allCategories));
    this.getList()
    .then(() => {
      this.setState({
        loaded: 1
      });
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
      this.update();
    }
  }

  closeCart = (cartState) => {
    this.setState({
      cartList: cartState,
      form: 0
    });
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
          ) : (
            <Button hasText transparent disabled={this.state.loaded === 0}
              onPress={() => { this.goToCart() }}>
              <Text>Cart</Text>
            </Button>
          )}
        </Right>
      </Header>
      <SearchForm 
        onSearchChange={(val) => {this.setState({search: val})}}
        categories={this.state.allCategories}
        filterDishes={this.filterDishes}
        sortDishes={this.sortDishes}
        />
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
      <View style={styles.buttons}>
        <Button bordered success style={styles.button} disabled={this.state.loaded === 0} onPress={() => {
          this.update();
        }}>
          <Text style={styles.buttonText}>Update</Text>
        </Button>
      </View>
      </Container>
      )
    } else if (this.state.form === 1 || this.state.form === 2) {
      return (
        <DishForm
        mode={this.state.form === 1 ? 0 : 1}
        googleToken={this.props.googleToken}
        url={this.props.url}
        title={this.state.dishName}
        description={this.state.dishDescription}
        price={this.state.dishPrice.toString()}
        id={this.state.dishId}
        close={this.closeForm}
        categories={this.state.categories}/>
      )
    } else if (this.state.form === 3) {
      return (
        <CartView
          items={this.state.cartList}
          close={this.closeCart}
        />
      )
    }
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