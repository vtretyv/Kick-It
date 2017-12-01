import React, { Component } from 'react';
import { min, max } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import stateData from '../../../lib/stateData.js';
import $ from 'jquery';

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

const ToolTipState = ({ data }) => {
  // console.log(`tool tip state is being called: ${JSON.stringify(data, null, 2)}`);
    // return (
    // <div>
    //   <span className={componentClasses.join(' ')}>
    //     {`${data.name}`}
    //   </span>
    // </div>);
  return (
    <div>
      <span className="toolUS">
        <p>{`${data.name.toUpperCase()}`}!</p>
      </span>
    </div>);
};

const ToolTipPie = ({ data }) => {
  // const componentClasses = ['toolPie'];
  // if (data) { componentClasses.push('show'); }
  return (
    <div className="toolPie">{`${data.label} ${data.value}`}</div>
  );
};


class States extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      selection: {},
      // mouseX: 0,
      // mouseY: 0,
    };
  }

  mouseEnterEvent(data) {
    // console.log(`Welcome to ${d.n}!`);
    this.setState({
      hover: true,
      selection: { name: data.n }
    });
  }

  mouseLeaveEvent(data) {
    // console.log(`Farewell, ${d.n}!`);
    this.setState({
      hover: false,
    });
  }

  mouseMoveEvent(data, e) {
    console.log('mouse has moved!', e.clientX);
    // this.setState({
    //   mouseX: e.clientX,
    //   mouseY: e.clientY
    // }, () => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const toolTipUS = document.getElementsByClassName('toolUS');
      // console.log('toolTipUS: ', typeof toolTipUS, Array.isArray(toolTipUS), toolTipUS[0]);
      toolTipUS[0].style.top = (mouseY - 200) + 'px';
      toolTipUS[0].style.left = (mouseX - 300) + 'px';
       console.log(`mouse is at: (${mouseX}, ${mouseY})`);
      // console.log(`mouse is at: (${this.state.mouseX}, ${this.state.mouseY})`);
    // });
  }

  render() {
    return (
      <div className="container">
        <div>{this.state.hover === true && <ToolTipState data={this.state.selection} />}</div>
        <svg className="States" width={width} height={height} >
            {stateData.map(state => {
              return (
                <path
                  className="state"
                  key={state.id}
                  d={dataReturn(state)}
                  onMouseEnter={(e) => { this.mouseEnterEvent(state, e); }}
                  onMouseLeave={(e) => { this.mouseLeaveEvent(state, e); }}
                  onMouseMove={(e) => { this.mouseMoveEvent(state, e); }}
                ></path>
              );
            })}
        </svg>
      </div>);
  }
}

export default States;

//       <div>{this.state.hover === true && <ToolTipUS data={this.state.selection} />}</div>

