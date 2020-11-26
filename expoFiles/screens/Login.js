import React, { Component } from 'react';
import { AsyncStorage, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Stylesheet from './Stylesheet';

export default class Login extends Component {
  static navigationOptions = { header: null, };
  
  // set default values for the login information in the constructor
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' }
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    // store the values into the state
    this.setState({
      username: await AsyncStorage.getItem('username')
    });
  }

  // clear the value of the box when clicked
  clearText = async() =>{
    this.setState({ username: '', password: '' });
  }

  render () {
    return (
      <KeyboardAvoidingView behavior='padding' style={ Stylesheet.outerContainer }>

        <View style={Stylesheet.welcomeContainer}>
          <Image style={ Stylesheet.libraryLogo } source={ require('../assets/aplKohaLogo.png') } />
        </View>

        <TextInput style={ Stylesheet.input } 
          id = 'barcode'
          placeholder = 'Library Barcode' 
          placeholderTextColor = "#F0F0F0"
          autoCapitalize = 'none' 
          onChangeText = { (username) => this.setState({ username }) } 
          onSubmitEditing = { () => this.passwordInput.focus() }
          returnKeyType = 'next'
          value = { this.state.username } 
        />
        <TextInput style={ Stylesheet.input } 
          placeholder = 'Password' 
          placeholderTextColor = "#F0F0F0"
          secureTextEntry 
          onChangeText = { (password) => this.setState({ password }) } 
          onSubmitEditing = { this._login }
          ref = { (input) => this.passwordInput = input }
          value = { this.state.password } 
        />
        
        <View style={ Stylesheet.btnContainer }>
          <TouchableOpacity style={ Stylesheet.btnFormat } onPress={ this._login }>
            <Text style={ Stylesheet.btnText }>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={ Stylesheet.btnContainer }>
          <TouchableOpacity style={ Stylesheet.btnFormatSmall } onPress={ this.clearText }>
            <Text style={ Stylesheet.btnText }>Reset form</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // create a function that saves your data asyncronously
  _storeData = async (data, username, password) => {
    try {
        // grab global information once and share it throughout the app
        let patronName = data.Name.substr(0, data.Name.indexOf(' '));;
        let loggedIn   = '1';

        await AsyncStorage.setItem('isLoggedIn', loggedIn);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('patronName', patronName);

        // toss this back to the navigator to see if we're logged in
        this.props.navigation.navigate(loggedIn ? 'App' : 'Auth');
    } catch (error) {
        //alert(error);
        alert("Sorry. There was an error. Please try again later.")
    }
  }

  // Login function - determines if the login credentials are correct
  _login = async() => {

    // save the login credentials to the storage
    const { username, password } = this.state;

    const random = new Date().getTime(); // included to ensure that we're pulling the most recent information
    const url = 'https://www.****.ca/app/login.php?barcode=' + this.state.username + '&pin=' + this.state.password + '&rand=' + random;
  
    fetch(url)
    .then(res => res.json())
    .then(res => {
      let data = res;
 
      // verify if the login credentials match the system
      if (data.ValidLogin === 'Yes') {
        this._storeData(data, username, password);

      } else {
        // no good login - fail
        alert("The barcode or PIN are incorrect. Please try again.");
      }
    })
    .catch(error => {
      console.log("get data error from:" + url + " error:" + error);
    });
  };
}