import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableWithoutFeedback, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import Stylesheet from './Stylesheet';

export default class Discovery extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      isLoading: true,
      limiter: 'BK|FICTION|',
    };
  }

  // routes to the function for reusability
  componentDidMount() {
    this.grabListData(this.state.limiter);
  }

  // call the list data in a function in order to reload when changes happen
  grabListData = (restriction) => {
    this.setState({ 
      isLoading: true,
      limiter: restriction
    });
    const url = 'https://www.*****.ca/app/discovery.php?limiter=' + restriction;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.Items,
          isLoading: false,
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  }

  // route user to page that allows them to place a hold
  onPressItem = (item) => { 
    this.props.navigation.navigate( 'PlaceHold', { item }, ); 
  }

  // renders the items on the screen
  renderNativeItem = (item) => {
    return (
      <TouchableWithoutFeedback onPress={ () => this.props.navigation.navigate('PlaceHold', {item } )}>
        <View style={ Stylesheet.discoverContainer }>
          <Image style={ Stylesheet.discoveryThumbnail } source={{ uri: item.image }} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getHeader = () => {
    const searchPlaceHolder = { label: 'Click to discover more!', value: '', color: '#9EA0A4', };

    return (
      <View style={ Stylesheet.discoveryPickerView }>
        <RNPickerSelect
          onValueChange = { (itemValue) =>  this.grabListData(itemValue) }
          items = {[ 
            { label: 'Books: Adult (Fiction)', value: 'BK|FICTION|' },
            { label: 'Books: Adult (NonFiction)', value: 'BK|NONFICTION|' },
            { label: 'Books: Adult (Large Print)', value: 'BK|NONFICTION|LP' },
            { label: 'Books: Children (Fiction)', value: 'JBK|FICTION|' },
            { label: 'Books: Children (NonFiction)', value: 'JBK|NONFICTION|' },
            { label: 'Books: Children (Board Books)', value: 'JBK||BB' },
            { label: 'Download: Overdrive', value: 'DOWNLOAD|OVERDRIVE|' },
            { label: 'Movies: Adult', value: 'DVD||ADULT' },
          ]}
          placeholder = { searchPlaceHolder }
          style = { Stylesheet.pickerViewSmall, Platform.OS === 'ios' ? Stylesheet.inputIOS : Stylesheet.inputAndroid }
          useNativeAndroidPickerStyle = { false }
          value = { this.state.limiter }
          Icon = { () => {
            return <Chevron size={1.5} color="gray" style={ Stylesheet.floatRight } />;
          }}
        /> 
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
      <View>
        <FlatList 
          data={ this.state.data } 
          keyExtractor={ (item, index) => index.toString() } 
          numColumns={ 3 } 
          renderItem={( {item} ) => this.renderNativeItem(item) } 
          ListHeaderComponent={ this.getHeader }
          extraData={ this.state }
        />
      </View>
    );
  }
}