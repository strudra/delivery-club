import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, 
  Label, Body, Title, Button, Text, ListItem, CheckBox, Left, Right } from 'native-base';

export default class DishForm extends Component {
  constructor(props) {
    super();
    this.state = {
      mode: props.mode ? props.mode : 0, // 0 for create, 1 for edit
      dishName: props.title ? props.title : "",
      dishDescription: props.description ? props.description : "",
      dishPrice: props.price ? props.price : "",
      activeCheckbox: [],
      dishId: props.id ? props.id : -1,
      buttonsActive: true,
      categories: []
    };
  }

  async componentDidMount() {
    await this.receiveCategories();
  }

  handleCheckBoxPressed = (val) => {
    if (this.state.activeCheckbox.includes(val) && this.props.categories.find(v => v._id === val) === undefined) {
      this.setState(prevState => {
        return {
          activeCheckbox: prevState.activeCheckbox.filter((v) => {
            return v !== val;
          })
        }
      });
    } else {
      this.setState(prevState => {
        return {
          activeCheckbox: prevState.activeCheckbox.concat([val])
        }
      });
    }
  }

  getDataList = () => {
    return this.state.categories.map((val, i) => (
    <ListItem key={val._id} onPress={() => this.handleCheckBoxPressed(val._id)}>
      <CheckBox 
        checked={this.props.categories.find(v => v._id === val._id) !== undefined ||
          this.state.activeCheckbox.includes(val._id)}
        onPress={() => this.handleCheckBoxPressed(val._id)}/>
      <Body>
        <Text>{val.name}</Text>
      </Body>
    </ListItem>
  ))};

  getCategories = () => {
    return (
      <Content>
        {this.getDataList()}
      </Content>
    );
  };

  handleDishNameChange = (val) => {
    this.setState({
      dishName: val
    });
  }

  handleDishDescriptionChange = (val) => {
    this.setState({
      dishDescription: val
    });
  }

  handleDishPriceChange = (val) => {
    this.setState({
      dishPrice: val
    });
  }

  parsePrice(str) {
    str.replace(",", ".");
    return str;
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
    this.sendQuery(this.props.googleToken, query, (val) => {
      this.setState({
        categories: val.categories
      });
    });
  }

  createDish = async () => {
    this.setState({buttonsActive: false});
    query = `mutation { createDish (dishInput: {name: "${this.state.dishName}",` + 
      `description: "${this.state.dishDescription}",` +
      `price: ${Number.parseFloat(this.state.dishPrice)}, }) { _id }}`;
    await this.sendQuery(this.props.googleToken, query, (dish) => {
      if (this.state.activeCheckbox.length > 0) {
        this.state.activeCheckbox.map((val, i) => {
          catQuery = `mutation { addDishToCategory(dishId: \"${dish.createDish._id}\", categoryId: \"${val}\") { _id } }`
          if (this.props.categories.find(v => v._id === val) == undefined) {
            this.sendQuery(this.props.googleToken, catQuery, (val) => {
              if (i === this.state.activeCheckbox.length - 1) this.props.close(1);
            });
          }
        });
      } else this.props.close(1);
    });
  }

  updateDish = async () => {
    this.setState({buttonsActive: false});
    query = `mutation { updateDish (dishId: \"${this.props.id}\", dishInput: {name: "${this.state.dishName}",` + 
      `description: "${this.state.dishDescription}",` +
      `price: ${Number.parseFloat(this.state.dishPrice)}, }) { _id }}`;
    
    await this.sendQuery(this.props.googleToken, query, (dish) => {
      if (this.state.activeCheckbox.length > 0) {
        this.state.activeCheckbox.map((val, i) => {
          catQuery = `mutation { addDishToCategory(dishId: \"${dish.updateDish._id}\", categoryId: \"${val}\") { _id } }`
          if (this.props.categories.find(v => v._id === val) == undefined) {
            this.sendQuery(this.props.googleToken, catQuery, (val) => {
              if (i === this.state.activeCheckbox.length - 1) this.props.close(1);
            });
          }
        });
      } else this.props.close(1);
    });
  }

  removeDish = async () => {
    this.setState({buttonsActive: false});
    query = `mutation { removeDish (dishId: \"${this.props.id}\") { _id }}`;
    this.sendQuery(this.props.googleToken, query, (val) => {
      this.props.close(1);
    });
  }

  render() {
    return (
    <Container>
      <Header hasTabs>
        <Left>
          <Button hasText transparent onPress={() => { this.props.close(0)} }>
            <Text>Back</Text>
          </Button>
        </Left>
        <Body>
          <Title>{this.state.mode === 0 ? "Create" : "Edit"} Dish</Title>
        </Body>
        <Right>
        </Right>
      </Header>
      <Tabs>
        <Tab heading={ <TabHeading><Text>Basic Info</Text></TabHeading>}>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Name</Label>
                <Input 
                  value={this.state.dishName}
                  onChangeText={this.handleDishNameChange}/>
              </Item>
              <Item stackedLabel>
                <Label>Description</Label>
                <Input
                  value={this.state.dishDescription}
                  onChangeText={this.handleDishDescriptionChange}/>
              </Item>
              <Item stackedLabel last>
                <Label>Price</Label>
                <Input
                  value={this.state.dishPrice}
                  onChangeText={this.handleDishPriceChange}/>
              </Item>
            </Form>
          </Content>
        </Tab>
        <Tab heading={ <TabHeading><Text>Categories</Text></TabHeading>}>
          {this.getCategories()}
        </Tab>
      </Tabs>
      <View style={styles.buttons}>
        <Button success style={styles.button} disabled={this.state.buttonsActive === false} onPress={() => {
          if (this.state.mode === 0) this.createDish();
          else this.updateDish();
        }}>
          <Text style={styles.buttonText}>{this.state.mode === 0 ? "Create" : "Save"}</Text>
        </Button>
        {this.state.mode === 1 ? (<View style={{ width: "5%" }} />) : null}
        {
          this.state.mode === 1 ? (
            <Button danger style={styles.button} disabled={this.state.buttonsActive === false} onPress={() => {
              this.removeDish();
            }}>
              <Text style={styles.buttonText}>Delete</Text>
            </Button>) : null
        }
      </View>
    </Container>
    );
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