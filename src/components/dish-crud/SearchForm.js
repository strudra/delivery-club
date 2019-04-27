import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Item, Label, Body, Button, Content, Text, ListItem, CheckBox, Right, Left, Input, Container } from 'native-base';

export default class SearchForm extends Component {
	constructor(props) {
    super(props);
    this.state = {
      list: [],
      loaded: 0,
      chosen: -1,
      search: "",
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 100000
    };
  }

  choose = (n) => this.setState(prev => {return { chosen: prev.chosen === n ? -1 : n }});

  onSearchChange = (val) => {
      this.setState({
          search: val
      });
      if (this.props.onSearchChange)
        this.props.onSearchChange(val);
  }

  onMinPriceChange = (val) => {
    this.setState({
        minPrice: parseFloat(val.length > 0 ? val : "0")
    });
  }

  onMaxPriceChange = (val) => {
    this.setState({
        maxPrice: parseFloat(val.length > 0 ? val : "0")
    });
  }

  getDataList = () => {
    return this.props.categories.map((val, i) => (
    <ListItem key={val._id} onPress={() => this.handleCheckBoxPressed(val._id)}>
      <CheckBox 
        checked={this.state.selectedCategories.includes(val._id)}
        onPress={() => this.handleCheckBoxPressed(val._id)}/>
      <Body>
        <Text>{val.name}</Text>
      </Body>
    </ListItem>
  ))};

  handleCheckBoxPressed = (val) => {
    if (this.state.selectedCategories.includes(val)) {
      this.setState(prevState => {
        return {
          selectedCategories: prevState.selectedCategories.filter((v) => {
            return v !== val;
          })
        }
      });
    } else {
      this.setState(prevState => {
        return {
          selectedCategories: prevState.selectedCategories.concat([val])
        }
      });
    }
  }

  getCategories = () => {
    return (
      <View>
        {this.getDataList()}
      </View>
    );
  };

  applyFilter = () => {
    if (this.props.filterDishes) this.props.filterDishes(this.state.selectedCategories, 
        this.state.minPrice,
        this.state.maxPrice)
        .then(() => this.setState({chosen: -1}))
        .then(() => console.log("filtered"));
  }

  applySort = (field) => {
    if (this.props.sortDishes) this.props.sortDishes(field)
        .then(() => this.setState({chosen: -1}))
        .then(() => console.log("sorted"));
  }

  getForm = () => {
    switch(this.state.chosen) {
        case 0:
            return (
                <View>
                    <Item stackedLabel>
                        <Label>Search</Label>
                        <Input
                            value={this.state.search}
                            onChangeText={this.onSearchChange}/>
                    </Item>
                </View>
            )
        case 1:
            return (
                <View style={{height: "90%"}}>
                <Content>
                    {this.getCategories()}
                    <Item stackedLabel>
                        <Label>Minimum Price</Label>
                        <Input
                            value={this.state.minPrice.toString()}
                            onChangeText={this.onMinPriceChange}/>
                    </Item>
                    <Item stackedLabel>
                        <Label>Maximum Price</Label>
                        <Input
                            value={this.state.maxPrice.toString()}
                            onChangeText={this.onMaxPriceChange}/>
                    </Item>
                    <Button onPress={() => this.applyFilter()}>
                        <Text>
                            Apply
                        </Text>
                    </Button>
                    </Content>
                </View>
            )
        case 2:
            return (
                <View style={{height: "90%"}}>
                <Content>
                <Button onPress={() => this.applySort(0)}>
                    <Text>
                        Name
                    </Text>
                </Button>
                <Button onPress={() => this.applySort(1)}>
                    <Text>
                        Description
                    </Text>
                </Button>
                <Button onPress={() => this.applySort(2)}>
                    <Text>
                        Price
                    </Text>
                </Button>
                <Button onPress={() => this.applySort(3)}>
                    <Text>
                        Creator
                    </Text>
                </Button>
                </Content>
                </View>
            )
        default:
            return null;
    }
  }

  render() {
      return (
        <View>
            <View style={styles.searchContainer}>
                <Button onPress={() => this.choose(0)}>
                    <Text>
                        Search
                    </Text>
                </Button>
                <Button onPress={() => this.choose(1)}>
                    <Text>
                        Filter
                    </Text>
                </Button>
                <Button onPress={() => this.choose(2)}>
                    <Text>
                        Sort
                    </Text>
                </Button>
            </View>
            <View>
                {this.getForm()}
            </View>
        </View>
      )
  }
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});