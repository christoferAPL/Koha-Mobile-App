import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements"
import Stylesheet from './Stylesheet';

export default class AccountDetail extends Component {

  // establishes the title for the window
  static navigationOptions = { title: 'Account' };

  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    // store the values into the state
    this.setState({
      password: await AsyncStorage.getItem('password'),
      patronName: await AsyncStorage.getItem('patronName'),
      username: await AsyncStorage.getItem('username')
    });

    // grab the checkouts
    this.getCheckOuts();

    // forces a new connection to ensure that we're getting the newest stuff
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => { this.getCheckOuts(); } );
  }

  // needed to ensure that the data refreshes
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  // grabs the items checked out to the account
  getCheckOuts = () => {
    const random = new Date().getTime();
    const url = 'https://www.****/app/item.php?barcode=' + this.state.username + '&pin=' + this.state.password + '&rand=' + random;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.Items,
          fines: res.fines,
          holds: res.holdsPending,
          isLoading: false,
          issues: res.issueCount
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  };

  // renders the items on the screen
  renderNativeItem = (item) => {
    const subtitle = 'Barcode: ' + item.barcode + '\nDate Due: ' + item.dateDue;
    const iconName = 'https://www.****.ca/app/icons/' + item.thumbnail;

    return <ListItem
            bottomDivider
            chevron
            leftAvatar={{ source: iconName && { uri: iconName }  }}
            onPress={() => this.onPressItem(item)}
            roundAvatar
            title={ item.key }
            subtitle={ subtitle }
          />;
  }

  // handles the on press action 
  onPressItem = (item) => {
    this.props.navigation.navigate('ItemDetails', { item });
  }

  _listEmptyComponent = () => {
    return <ListItem
      roundAvatar
      title      = "You've got no items checked out."
      subtitle   = ""
      leftAvatar = {{ source: require('../assets/noImageAvailable.png') }}
      bottomDivider
    />;
  };

  getHeader = () => {
    return (
      <View>
        <View style={ Stylesheet.accountInformation }>
        <Text style={ Stylesheet.accountTextHeader }>{ this.state.patronName }'s Account Summary:</Text>
        <Text style={ Stylesheet.accountText }>Barcode: { this.state.username }</Text>
        <Text style={ Stylesheet.accountText }>Items checked out: { this.state.issues }</Text>
        <Text style={ Stylesheet.accountText }>Items on hold: { this.state.holds }</Text>
        </View>
        <View style={ Stylesheet.accountInformation }>
            <Text style={ Stylesheet.accountTextHeader }>Items Currently Checked Out:</Text>
        </View>
      </View>
    );
  }
  
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
          renderItem={( {item} ) => this.renderNativeItem(item) }  
          ListHeaderComponent={ this.getHeader() }
        />
      </View>
    );
  }
}