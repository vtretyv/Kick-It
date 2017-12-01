import React, { Component } from 'react';
import { min, max } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import stateData from '../../../lib/countyData.js';

const width = 700;
const height = 700;


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

  render() {
    return (
      <div className="map">
        <div>{this.state.hover === true && <ToolTipUS data={this.state.selection} />}</div>
        <svg className="Counties">
            {stateData.map(state => {
              return (
                <path
                  className="state"
                  key={state.id}
                  d={dataReturn(state)}
                  onMouseEnter={(e) => { this.mouseEnterEvent(state, e); }}
                  onMouseLeave={() => { this.mouseLeaveEvent(); }}
                ></path>
              );
            })}
        </svg>
      </div>);
  }
}

export default States;


