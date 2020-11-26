import React, { Component } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import Stylesheet from './Stylesheet';

export default class News extends Component {
  // establishes the title for the window
  static navigationOptions = { title: 'News' };

  constructor() {
    super();

    this.state = {
      isLoading: true
    };
  }

  // handles the mount information, setting session variables, etc
  componentDidMount = async() =>{
    const url = 'https://www.****.ca/app/moreDetails.php';

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          dataNews: res.news,
          dataUniversal: res.universal,
          isLoading: false
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

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={ Stylesheet.outerContainer }>
        <View style={ Stylesheet.welcomeContainer }>
            <Image source={ require('../assets/aplKohaLogo.png') } style={ Stylesheet.newsImage } />
        </View>
        
        <Text style={ Stylesheet.newsItem }>Today's Branch Hours:{'\n'} { this.state.dataUniversal.todayHours }.</Text>

          { this.state.dataNews.news.map((user, index) => (
            <Text style={ Stylesheet.newsItem } key={ user.date }>{ user.date }: {'\n'} { user.newsItem }</Text>
          ))}


      </View>
      </ScrollView>
    );
  }
}
