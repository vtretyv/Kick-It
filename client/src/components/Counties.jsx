import React, { Component } from 'react';
import { min, max } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import countyData from '../../../lib/countyData.js';


function dataReturn(state) {
  return state.d;
}

const ToolTipUS = ({ data }) => {
  return (
    <div className="toolUS">
      <div>{`County: ${data.label}`}</div>
    </div>);
};


class States extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      selection: {}
    };
  }

  mouseEnterEvent(d) {
    this.setState({
      hover: true,
      selection: {label: d.label}
    });
  }

  mouseLeaveEvent() {
    this.setState({
      hover: false
    });
  }


  // use d3 interpolate!
  colorSelector(label) {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    return (
      <div className="map">
        <div>{this.state.hover === true && <ToolTipUS data={this.state.selection} />}</div>
        <svg className="Counties" transform="scale(1)">
            {countyData.map(county => {
              return (
                <path
                  stroke={this.colorSelector(county.label)}
                  fill={this.colorSelector(county.label)}
                  className="state"
                  key={county.id}
                  d={dataReturn(county)}
                  onMouseEnter={(e) => { this.mouseEnterEvent(county, e); }}
                  onMouseLeave={() => { this.mouseLeaveEvent(); }}
                ></path>
              );
            })}
        </svg>
      </div>);
  }
}

export default States;


