import React from 'react';
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';

export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    let data = [
      { category: 'music', value: 2 },
      { category: 'food', value: 5 },
      { category: 'community', value: 10 },
      { category: 'dating', value: 15 },
      { category: 'entertainment', value: 19 },
      { category: 'science', value: 40 },
      { category: 'active', value: 30 },
    ];

    // reduce the data to values

    this.setState({
      data: data,
    });
  }

  render() {
    return (<div>
    	  <Chart height={400} width={400} forceFit>
          <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
    	  </Chart>
    	</div>); 
  }
}


 // 103   | music         | Music
 // 110   | food          | Food & Drink
 // 113   | community     | Community Events
 // 116   | community     | Community Events
 // 17001 | dating        | Dating
 // 104   | entertainment | Entertainment
 // 105   | entertainment | Entertainment
 // 102   | science       | Science/Tech
 // 118   | autoBoatAir   | Auto, Boat, Air
 // 108   | active        | Active
 // 109   | active        | Active