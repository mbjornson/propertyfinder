'use strict';

var React = require('react');

var ReactNative = require('react-native');
var SearchResults = require('./SearchResults');

var {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Image
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

function urlForQueryAndPage(key,value,pageNumber) {
  var data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };
  data[key] = value;
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&')
    .replace(/%2C/g,"," );
  return 'http://api.nestoria.co.uk/api?' + querystring;
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  }
  onSearchTextChange(event) {
    console.log('onSearchTextChange');
    this.setState({searchString: event.nativeEvent.text});
    console.log(this.state.searchString);
  }
  _executeQuery(query) {
    console.log('in _executeQuery');
    console.log(query);
    this.setState({isLoading: true});
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
        this.setState({isLoading: false,
          message: 'Something bad happened.'}));
  }
  _handleResponse(response) {
    this.setState({ isLoading: false, message: ''});
    if (response.application_response_code.substr(0,1) === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: response.listings }
      });
      console.log(response.listings);
    } else {
      console.log('in _handleResponse');
      console.log(response);
      this.setState({message: 'Location not recognized; Please try again.'});
    }
  }
  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }
  onLocationPressed(){
    console.log('in onLocationPressed');
    navigator.geolocation.getCurrentPosition(
      location => {
        var search = location.coords.latitude + ',' + location.coords.longitude;
        //var search = "53.5451,-2.6325"; //works
        //var search = decodeURIComponent(searchLoc);
        console.log(search);
        this.setState({searchString: search});
        var query = urlForQueryAndPage('centre_point', search, 1);
        console.log('still in location about to call _executeQuery');
        console.log(query);
        this._executeQuery(query);
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your locaiton' + error
        });
      }
    );
  }
  render() {
    console.log('SearchPage.render');
    var spinner = this.state.isLoading ?
      ( <ActivityIndicator size='large'/> ) :
      ( <View/>) ;
    return (
      <View
        style={styles.container}>
        <Text
          style={styles.description}>
          Search for houses to buy
        </Text>
        <Text
          style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View
          style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChange.bind(this)}
            placeholder='Search via name or postcode'/>
          <TouchableHighlight
              style={styles.button}
              underlayColor='#99d9f4'
              onPress={this.onSearchPressed.bind(this)}>
              <Text
                style={styles.buttonText}>
                Go
              </Text>
          </TouchableHighlight>
        </View>
        <View
          style={styles.flowRight}>
        <TouchableHighlight
          style={styles.button}
          underlayColor='#99d9f4'
          onPress={this.onLocationPressed.bind(this)}>
          <Text
            style={styles.buttonText}>
            Location
          </Text>
        </TouchableHighlight>
        </View>
        <Image
          source={require('../images/house.png')}
          style={styles.image} />
        { spinner }
        <Text
          style={styles.description}>
          {this.state.message}
        </Text>
      </View>
    );
  }
}
module.exports = SearchPage;
