import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, Text, TouchableOpacity, View } from 'react-native';
import Stylesheet from './Stylesheet';

export default class ItemDetails extends Component {
  // establishes the title for the window
  static navigationOptions = { title: 'Item Details' };
  
  constructor() {
    super();
    this.state = { isLoading: true };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    this.setState({
      isLoading: false,
      renewalDate: '',
      password: await AsyncStorage.getItem('password'),
      showSuccess: false,
      showFailure: false,
      username: await AsyncStorage.getItem('username')
    });
  }

  // function that calls the external PHP script to renew the items
  onPressItem = (barcode) => {
    const random = new Date().getTime(); // included to ensure that we're pulling the most recent information
    const url = 'https://www.*****.ca/app/renew.php?barcode=' + this.state.username + '&pin=' + this.state.password + '&item=' + barcode + '&rand=' + random;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let renewalStatus = res.data.renewal.renewal;
        let renewalDate   = res.data.renewal.renewDate;

        // handle a failed renewal and then exit function
        if (renewalStatus == 'N') {
          this.setState({
            showFailure: true
          });

          return '';
        }

        // need to massage the due date a little to make it look prettier
        renewalDate = renewalDate.substring(0, 4) + '-' + renewalDate.substring(4, 6) + '-' + renewalDate.substring(6, 8);

        // we know that the renewal was successful at this point
        this.setState({
          renewalDate: renewalDate,
          showSuccess: true
        });
      })
      .catch(error => {
        console.log("get data error from:" + url + " error:" + error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={ Stylesheet.activityIndicator }>
          <ActivityIndicator size='large' color='#272362' />
        </View>
      );
    }

    const title     = this.props.navigation.state.params.item.key;
    const dateDue   = this.props.navigation.state.params.item.dateDue;
    const barcode   = this.props.navigation.state.params.item.barcode;
    const itemImage = 'https://www.*****.ca/app/icons/' + this.props.navigation.state.params.item.thumbnail;
    const renewText = "Renew " + title;

    return (
      <View style={ Stylesheet.outerContainer }>
        <Image style={ Stylesheet.coverArtImage } source={{ uri: itemImage }} />
        <Text style={ Stylesheet.title }>Title: { title }</Text>
        <Text style={ Stylesheet.barcodeText }>Barcode: { barcode }</Text>
        <Text style={ Stylesheet.dueDate }>Date Due: { dateDue }</Text>
        <View style={ Stylesheet.btnContainer }>
          <TouchableOpacity style={ Stylesheet.btnFormat } onPress={ () => this.onPressItem(barcode) }>
            <Text style={ Stylesheet.btnText }>{ renewText }</Text>
          </TouchableOpacity>
        </View>
        
        { this.state.showSuccess || this.state.showFailure ?
            <View style={ Stylesheet.ilsMessageContainer }>
              <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                {this.state.showSuccess ? <Text style={ Stylesheet.ilsSuccessMessage }>This Item was successfully renewed and now is due { this.state.renewalDate }.{'\n\n'}Tap to close.</Text> : null}
                {this.state.showFailure ? <Text style={ Stylesheet.ilsFailMessage }>This Item cannot be renewed and is still due due on or before { dateDue }.{'\n\n'}Tap to close.</Text> : null}
              </TouchableOpacity>
            </View> : null }
        
      </View>
    );
  }
}