import React, { Component } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { ListItem } from "react-native-elements"
import Stylesheet from './Stylesheet';

export default class ListResults extends Component {
  // establishes the title for the window
  static navigationOptions = { title: 'Search Results' };

  constructor() {
    super();
    this.state = { isLoading: true };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    const level      = this.props.navigation.state.params.level;
    const format     = this.props.navigation.state.params.format;
    const searchType = this.props.navigation.state.params.searchType;

    // need to replace any space in the search term with a friendly %20
    const searchTerm = encodeURI((this.props.navigation.state.params.searchTerm).replace(' ', '%20'));
    
    /// need to build out the URL to call, including the search term
    const url = 'https://www.****.ca/app/searchResultz.php?searchTerm=' + searchTerm + '&searchType=' + searchType;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.Items,
          isLoading: false
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  }

  // renders the items on the screen
  renderNativeItem = (item) => {
    const subtitle = item.author + ' (' + item.format + ')';
    
    if (item.image) {
      return <ListItem
              roundAvatar
              title={ item.title }
              subtitle={ subtitle }
              leftAvatar={{ source: item.image && { uri: item.image }  }}
              onPress={() => this.onPressItem(item)}
              chevron
              bottomDivider
            />;
    } else {
      return <ListItem
              roundAvatar
              title={ item.title }
              subtitle={ subtitle }
              leftAvatar={{ source: require('../assets/noImageAvailable.png') }}
              onPress={() => this.onPressItem(item)}
              chevron
              bottomDivider
            />;
    }
  }

  // handles the on press action 
  onPressItem = (item) => {
    this.props.navigation.navigate('PlaceHold', { item },);
  }
 
  _listEmptyComponent = () => {
    return <ListItem
      roundAvatar
      title="No Results Found"
      subtitle="Please try another search"
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
         renderItem={( {item} ) => this.renderNativeItem(item) } 
         keyExtractor={ (item, index) => index.toString() }  
        />
      </View>
    );
  }
}