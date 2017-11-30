import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
const Promise = require('bluebird');

class CitySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    new Promise((resolve, reject) => {
      this.setState({ 'city': event.target.value });
      resolve();
    }).then(() => {
      this.props.onChange('city', this.state.city);
    });
  }
  render() {
    return (
      <input
        className="city-search"
        value={this.state.city}
        onChange={this.handleChange}
        placeholder="Enter a City"
      />
    );
  }
}

export default CitySearch;
