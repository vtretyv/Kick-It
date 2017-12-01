import React, { Component } from 'react';
import { min, max } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import stateData from '../../../lib/stateData.js';
import _ from 'underscore';
import $ from 'jquery';

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
    Music: Math.round(100 * Math.random()),
    Food: Math.round(100 * Math.random()),
    Community: Math.round(100 * Math.random()),
    Dating: Math.round(100 * Math.random()),
    Entertainment: Math.round(100 * Math.random()),
    Science: Math.round(100 * Math.random()),
    AutoBoatAir: Math.round(100 * Math.random()),
    active: Math.round(100 * Math.random())
  };
});


function dataReturn(state) {
  return state.d;
}


const ToolTipUS = ({ data }) => {
  return (
    <div className="toolUS">
      <div>{`${data.name}`}</div>
      {_.map(sampleData[data.id], (value, label) => {
        return (<div>{label}: {value}</div>);
      })}
    </div>);
};


function formatDataForPie(id) {
  return _.map(sampleData[id], (value, label) => {
    return { label: label, value: value };
  });
}


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


  mouseEnterEvent(d) {
    this.setState({
      hover: true,
      selection: {name: d.n, id: d.id}
    });
  }


  mouseLeaveEvent() {
    this.setState({
      hover: false,
    });
  }

  mouseMoveEvent(data, e) {
    console.log('mouse has moved!', e.clientX);
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const toolTipUS = document.getElementsByClassName('toolUS');
    toolTipUS[0].style.top = (mouseY - 200) + 'px';
    toolTipUS[0].style.left = (mouseX - 300) + 'px';
    // console.log(`mouse is at: (${mouseX}, ${mouseY})`);
  }

  render() {
    return (
      <div className="map">
        <div>{this.state.hover === true && <ToolTipUS data={this.state.selection} />}</div>
        <svg className="States"  transform="scale(0.6)">
            {stateData.map(state => {
              return (
                <path
                  stroke="red"
                  fill="#d89e9e"
                  className="state"
                  key={state.id}
                  d={dataReturn(state)}
                  onMouseEnter={(e) => { this.mouseEnterEvent(state, e); }}
                  onMouseMove={(e) => { this.mouseMoveEvent(state, e); }}
                  onMouseLeave={() => { this.mouseLeaveEvent(); }}
                  onClick={ () => { this.props.selectPieData(formatDataForPie(state.id)); }}
                ></path>
              );
            })}
        </svg>
      </div>);
  }
}

export default States;


// [
//       { label: 'music', category: [103], value: music },
//       { label: 'food', category: [110], value: food },
//       { label: 'community', category: [113, 116], value: community },
//       { label: 'dating', category: [17001], value: dating },
//       { label: 'entertainment', category: [104, 105], value: entertainment },
//       { label: 'science', category: [102], value: science },
//       { label: 'autoBoatAir', category: [118], value: autoBoatAir },
//       { label: 'active', category: [108, 109], value: active }
//     ]