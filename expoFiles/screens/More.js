import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, KeyboardAvoidingView, TouchableOpacity, Text, View } from 'react-native';
import { ListItem } from "react-native-elements"
import Stylesheet from './Stylesheet';

export default class More extends Component {
  // establishes the title for the window
  static navigationOptions = { title: 'More' };

  constructor() {
    super();
    this.state = { isLoading: true };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    const url = 'https://www.****.ca/app/moreDetails.php';

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.options,
          isLoading: false
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  }

  // renders the items on the screen
  renderNativeItem = (item) => {
    return <ListItem
            roundAvatar
            title={ item.title }
            subtitle={ item.subtitle }
            onPress={() => this.onPressItem(item.path)}
            chevron
            bottomDivider
          />;
  }
  
  // logs out the user, but keeps the barcode for ease of logging back in
  _logout = async() => {
    //await AsyncStorage.clear();
    await AsyncStorage.multiRemove(['isLoggedIn', 'password', 'patronName'])
    this.props.navigation.navigate('Auth');
  }

  getHeader = () => {
    return (
      <KeyboardAvoidingView behavior='padding' style={ Stylesheet.outerContainer }>
        <View style={ Stylesheet.logoutButton }>
          <TouchableOpacity style={ Stylesheet.btnFormat } onPress={ this._logout }>
            <Text style={ Stylesheet.btnText }>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // handles the on press action 
  onPressItem = (item) => {
    this.props.navigation.navigate(item, { item },);
  }
 
  _listEmptyComponent = () => {
    return <ListItem
      roundAvatar
      title = "Oops"
      subtitle = "Something went wrong. Please try again later."
      leftAvatar={{ source: require('../assets/noImageAvailable.png') }}
      bottomDivider
    />;
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={ Stylesheet.activityIndicator }>
          <ActivityIndicator size='large' color='#272362' />
        </View>
      );
    }

    return (
      <View style={ Stylesheet.searchResultsContainer }>
        <FlatList 
         data={ this.state.data } 
         ListEmptyComponent = { this._listEmptyComponent() }
         ListHeaderComponent={ this.getHeader }
         renderItem={( {item} ) => this.renderNativeItem(item) } 
         keyExtractor={ (item, index) => index.toString() }  
        />
      </View>
    );
  }
}