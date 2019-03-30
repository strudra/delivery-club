import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, Label, Body, Title, Button, Text, ListItem, CheckBox } from 'native-base';

export default class DishForm extends Component {
  constructor(props) {
    super();
    this.state = {
      mode: props.mode ? props.mode : 0, // 0 for create, 1 for edit
      dishName: props.title ? props.title : "",
      dishDescription: props.description ? props.description : "",
      dishPrice: props.price ? props.price : "",
      activeCheckbox: props.categories ? props.categories : [],
    };
  }

  handleCheckBoxPressed = val => {
    if (this.state.activeCheckbox.includes(val)) {
      this.setState(prevState => {
        return {
          activeCheckbox: prevState.activeCheckbox.filter((v) => {
            return lowerCase(v) !== lowerCase(val);
          })
        }
      });
    } else {
      this.setState(prevState => {
        return {
          activeCheckbox: prevState.activeCheckbox.concat([lowerCase(val)])
        }
      });
    }
  }

  getData = () => ["cold", "hot", "drinks", "snacks", "fast food", "dessert", "healthy", "russian", "serbian",
                   "nepali", "ukrainian", "italian", "french", "spanish", "fruits", "vegetables"];

  getDataList = () => this.getData().map((val, i) => (
    <ListItem key={i} onPress={() => this.handleCheckBoxPressed(val)}>
      <CheckBox 
        checked={this.state.activeCheckbox.includes(val)}
        onPress={() => this.handleCheckBoxPressed(val)}/>
      <Body>
        <Text>{val}</Text>
      </Body>
    </ListItem>
  ));

  getCategories = () => {
    return (
      <Content>
        {this.getDataList()}
      </Content>
    );
  };

  handleDishNameChange = val => {
    this.setState({
      dishName: val
    });
  }

  handleDishDescriptionChange = val => {
    this.setState({
      dishDescription: val
    });
  }

  handleDishPriceChange = val => {
    this.setState({
      dishPrice: val
    });
  }

  parsePrice = str => {
    str.replace(",", ".0");
    return str;
  }

  render() {
    return (
    <Container>
      <Header hasTabs>
        <Body>
          <Title>{this.state.mode === 0 ? "Create" : "Edit"} Dish</Title>
        </Body>
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
                  multiline 
                  value={this.state.dishDescription}
                  onChangeText={this.handleDishDescriptionChange}/>
              </Item>
              <Item stackedLabel last>
                <Label>Price</Label>
                <Input 
                  keyboardType="numeric" 
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
        <Button success style={styles.button}>
          <Text style={styles.buttonText}>{this.state.mode === 0 ? "Create" : "Save"}</Text>
        </Button>
        {this.state.mode === 1 ? (<View style={{ width: "5%" }} />) : null}
        {
          this.state.mode === 1 ? (
            <Button danger style={styles.button}>
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