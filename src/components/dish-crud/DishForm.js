import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Tabs, Tab, TabHeading, Container, Header, Content, Form, Item, Input, Label, Body, Title, Button, Text, ListItem, CheckBox } from 'native-base';

const getCategories = () => {
  return (
    <Content>
      <ListItem>
        <CheckBox />
        <Body>
          <Text>Breakfast</Text>
        </Body>
      </ListItem>
      <ListItem>
        <CheckBox />
        <Body>
          <Text>Lunch</Text>
        </Body>
      </ListItem>
      <ListItem>
        <CheckBox />
        <Body>
          <Text>Dinner</Text>
        </Body>
      </ListItem>
    </Content>
  );
};

export default class DishForm extends Component {
  constructor() {
    super();
    this.state = {
      mode: 1 // 0 for create, 1 for edit
    };
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
              <Item floatingLabel>
                <Label>Name</Label>
                <Input />
              </Item>
              <Item floatingLabel>
                <Label>Description</Label>
                <Input multiline />
              </Item>
              <Item floatingLabel last>
                <Label>Price</Label>
                <Input keyboardType="numeric" />
              </Item>
            </Form>
          </Content>
        </Tab>
        <Tab heading={ <TabHeading><Text>Categories</Text></TabHeading>}>
          {getCategories()}
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