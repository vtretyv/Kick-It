import React, { Component } from 'react';
import { min, max } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import stateData from '../../../lib/stateData.js';

const width = 300;
const height = 300;

function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+
      "<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
      "<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
      "<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
      "</table>";
  }

const sampleData = {};
const states = ['HI', 'AK', 'FL', 'SC', 'GA', 'AL', 'NC', 'TN', 'RI', 'CT', 'MA',
  'ME', 'NH', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'WV', 'KY', 'OH',
  'MI', 'WY', 'MT', 'ID', 'WA', 'DC', 'TX', 'CA', 'AZ', 'NV', 'UT',
  'CO', 'NM', 'OR', 'ND', 'SD', 'NE', 'IA', 'MS', 'IN', 'IL', 'MN',
  'WI', 'MO', 'AR', 'OK', 'KS', 'LS', 'VA'];

states.forEach((d) => {
  const low = Math.round(100 * Math.random());
  const mid = Math.round(100 * Math.random());
  const high = Math.round(100 * Math.random());
  sampleData[d] = {
    low: min([low, mid, high]),
    high: max([low, mid, high]),
    avg: Math.round((low + mid + high) / 3),
    color: interpolate('#ffffcc', '#800026')(low / 100)
  };
});


function dataReturn(state) {
  return state.d;
}

const ToolTipUS = ({ data }) => {
  return (
    <div className="toolUS">
      <div>{`${data.name}`}</div>
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
    console.log('HERERE O');
    this.setState({
      hover: true,
      selection: {name: d.n}
    });
  }

  mouseLeaveEvent() {
    console.log('HERERE 4');
    this.setState({
      hover: false
    });
  }

  render() {
    return (
        <svg className="States" width={width} height={height} >
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
        </svg>);
  }
}

export default States;

//       <div>{this.state.hover === true && <ToolTipUS data={this.state.selection} />}</div>

