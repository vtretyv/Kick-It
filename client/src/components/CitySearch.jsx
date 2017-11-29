import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

class CitySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ city: event.target.value });
  }
  render() {
    return (
      <input
        className="city-search"
        onChange={this.handleChange}
        value={this.state.city}
        placeholder="Enter a City"
      />
    );
  }
}

export default CitySearch;
