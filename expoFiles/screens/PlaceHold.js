import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, Linking, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ViewMoreText from 'react-native-view-more-text';
import { Chevron } from 'react-native-shapes';
import Stylesheet from './Stylesheet';

export default class PlaceHold extends Component {
  // establishes the title for the window
  static navigationOptions = { title: 'Place a Hold' };
  
  // constructor - sets up what is needed by default
  constructor() {
    super();
    this.state = { isLoading: true };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    this.setState({
      isLoading: false,
      password: await AsyncStorage.getItem('password'),
      pickUpLocation: 'Main',
      screenHeight: 0,
      showSuccess: false,
      showFailure: false,
      username: await AsyncStorage.getItem('username')
    });
  }

  // function that calls the external PHP script to put a hold on the item
  onPressItem = (barcode, downloadLink) => {

    // handle the downloadable book and stop processing
    if (downloadLink) {
      Linking.canOpenURL( downloadLink ).then(supported => {
        if (supported) {
          Linking.openURL( downloadLink );
        }
      });

      return '';
    }

    const random = new Date().getTime(); // included to ensure that we're pulling new information
    const url = 'https://www.****.ca/app/placeHold.php?barcode=' + this.state.username + '&pin=' + this.state.password + '&item=' + barcode + '&location=' + this.state.pickUpLocation + '&rand=' + random;

    // fetches the information from the external URL
    fetch(url)
      .then(res => res.json())
      .then(res => {
        let holdStatus = res.data.hold.ok;

        // handle a failed renewal and then exit function
        if (holdStatus != '1') {
          this.setState({ showFailure: true });
          return '';
        }

        // we know that the renewal was successful at this point
        this.setState({ showSuccess: true });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  }

  // function that handles the read more functionality
  renderViewMore(onPress) { 
    return( <Text style={ Stylesheet.readMore } onPress={onPress}>View more</Text> );
  }

  // function that handles the read less functionality
  renderViewLess(onPress) {
    return( <Text style={ Stylesheet.readMore }  onPress={onPress}>View less</Text> );
  }

  // handles the scrollability of the screen
  onContentSizeChange = (contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  // handles changing the pick up locaiton of the hold
  updateHoldLocation = (location) => {
    this.setState({ pickUpLocation: location })
  }

  showLocationPulldown = (url) => {
    const placeholder = {
      label: 'Choose your pickup location',
      value: null,
      color: '#9EA0A4',
    };

    if (url) {
      return <Text style={ Stylesheet.spacer }>{'\n'}</Text>;
    }

    return (
      <View style={ Stylesheet.outerContainer }>
        <Text style={ Stylesheet.spacer }>{'\n'}</Text>
        <Text style={ Stylesheet.author }>My Prefered Pickup Location: </Text>
        <View style={ Stylesheet.pickerViewSmall }>
          <RNPickerSelect
            onValueChange = { this.updateHoldLocation }
            items = {[ 
              { label: 'Audley', value: 'Audley' },
              { label: 'Main', value: 'Main' },
              { label: 'McLean', value: 'McLean' },
            ]}
            value = { this.state.pickUpLocation }
            placeholder = { placeholder }
            style = { Stylesheet.pickerViewSmall, Platform.OS === 'ios' ? Stylesheet.inputIOS : Stylesheet.inputAndroid }
            useNativeAndroidPickerStyle = { false }
            Icon = { () => {
              return <Chevron size={1.5} color="gray" style={ Stylesheet.floatRight } />;
            }}
          />
        </View>
      </View>
    );
  }

  // renders the screen
  render() {
    // renders the is loading loop until the system is ready with the data
    if (this.state.isLoading) {
      return (
        <View style={ Stylesheet.activityIndicator }>
          <ActivityIndicator size='large' color='#272362' />
        </View>
      );
    }

    // construct variables to make the displaying of informtion easier
    const title       = this.props.navigation.state.params.item.title;
    const author      = this.props.navigation.state.params.item.author;
    const barcode     = this.props.navigation.state.params.item.barcode;
    const bookSummary = this.props.navigation.state.params.item.summary;
    const format      = this.props.navigation.state.params.item.format;
    const url         = this.props.navigation.state.params.item.url;
    const height      = 0;
    const scrollEnabled = this.state.screenHeight > height;
    
    var holdText    = "Place Hold" + '\n' + "(Pickup at " + this.state.pickUpLocation + ')';
    if (url) {
      holdText = 'Click here to download';
    }

    // need to toggle when images aren't availabe
    var itemImage   = require('../assets/noImageAvailable.png');
    if (this.props.navigation.state.params.item.image) {
      itemImage   = this.props.navigation.state.params.item.image;
    }

    return (
      <SafeAreaView style={Stylesheet.outerContainer}>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={ Stylesheet.outerContainer }>
            { this.props.navigation.state.params.item.image ? <Image style={ Stylesheet.coverArtImage } source={{ uri: itemImage }} /> : <Image style={ Stylesheet.coverArtImage } source={ itemImage } /> }
          
            <ViewMoreText 
              numberOfLines={ 10 }
              renderViewMore={ this.renderViewMore }
              renderViewLess={ this.renderViewLess }
              textStyle = { Stylesheet.summaryDescription }
              >
              <Text style={ Stylesheet.spacer }>{'\n'}</Text>
              <Text style={ Stylesheet.title }>{ title }{'\n'}</Text>
              <Text style={ Stylesheet.author }>{ author }{'\n'}</Text>
              <Text style={ Stylesheet.author }>Format: { format }  {'\n'}</Text>
              <Text style={ Stylesheet.spacer }>{'\n'}</Text>
              <Text style={ Stylesheet.bookSummary }>Summary: {'\n'}</Text>
              <Text style={ Stylesheet.summaryDescription }>{ bookSummary }</Text>
            </ViewMoreText>

            <View style={ Stylesheet.outerContainer }>
              { this.showLocationPulldown(url) }
            </View>




            <View style={ Stylesheet.btnContainer }>
              <TouchableOpacity style={ Stylesheet.btnFormat } onPress={ () => this.onPressItem(barcode, url) }>
                <Text style={ Stylesheet.btnText }>{ holdText }</Text>
              </TouchableOpacity>
            </View>
            { this.state.showSuccess || this.state.showFailure ?
            <View style={ Stylesheet.ilsMessageContainer }>
              <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                {this.state.showSuccess ? <Text style={ Stylesheet.ilsSuccessMessage }>Awesome! This title was successfully placed on hold for you. You'll be notified when it is ready.{'\n\n'}Tap to close.</Text> : null}
                {this.state.showFailure ? <Text style={ Stylesheet.ilsFailMessage }>Oops, there was an issue placing this on hold for you.{'\n\n'}Tap to close.</Text> : null}
              </TouchableOpacity>
            </View> : null }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}