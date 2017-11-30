import React, { Component } from 'react';
import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';

const color = scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;


const dataArc = arc()
  .outerRadius(radius - 10)
  .innerRadius(100);

const labelArc = arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);

const pieChart = pie()
  .sort(null)
  .value(d => d.value);




const ToolTipPie = ({ data }) => {
  const componentClasses = ['toolPie'];
  if (data) { componentClasses.push('show'); }
  return (
    <div className={componentClasses.join(' ')} >{`${data.label} ${data.value}`}</div>
  );
};


class Piechart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      selection: {}
    };
  }

  mouseOverEvent(d, e) {
    this.setState({
      hover: true,
      selection: {label: d.data.label, value: d.value}
    });
  };

  mouseLeaveEvent() {
    this.setState({
      hover: false
    });
  };

  render() {
    return (
      <div className="container">
        <div>{this.state.hover === true && <ToolTipPie data={this.state.selection} />}</div>
        <svg className="Piechart" width={width} heigth={height} >
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {pieChart(this.props.data).map((d, i) => (
              <g key={i} className="arc">
                <path
                  d={dataArc(d)}
                  fill={color(d.data.label)}
                  onMouseOver={(e) => { this.mouseOverEvent(d, e); }}
                  onMouseLeave={() => { this.mouseLeaveEvent(); }}
                />
                <text
                  dy='.55em'
                  transform={`translate(${labelArc.centroid(d)})`}
                >
                  {d.value !== 0 && d.data.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>);
  }
}

export default Piechart;
