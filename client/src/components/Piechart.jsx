import React, { Component } from 'react';
import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';

const color = scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

const width = 600;
const height = 600;
const radius = Math.min(width - 200, height - 200) / 2;


const dataArc = arc()
  .outerRadius(radius - 10)
  .innerRadius(100);

const labelArc = arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);

const pieChart = pie()
  .sort(null)
  .value(d => d.value);

function labelPath(center, label) {
  const cx = center[0];
  const cy = center[1];
  const lx = label[0];
  const ly = label[1];

  return `M ${cx} ${cy} L ${lx} ${ly}`;
}

const ToolTipPie = ({ data }) => {
  return (
    <div className="toolPie">
      {`${data.label} ${data.value}`}
    </div>
  );
};

// const ToolTipPie = ({ data }) => {
//   const componentClasses = ['toolPie'];
//   if (data) { componentClasses.push('show'); }
//   return (
//     <div className={componentClasses.join(' ')} >{`${data.label} ${data.value}`}</div>
//   );
// };


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
      selection: { d: d, label: d.data.label, value: d.value }
    });
  };

  mouseLeaveEvent() {
    this.setState({
      hover: false
    });
  };
  

  // <g transform .... puts the pie chart in the middle of the div object

  render() {
    return (
      <div className="pie">
        <div>{this.state.hover === true && <ToolTipPie data={this.state.selection} />}</div>
        <svg className="Piechart" width={width} heigth={height} >
          <g transform={`translate(${(width) / 2}, ${(height) / 2})`}>
            {pieChart(this.props.data).map((d, i) => {

              // Trig
              const center = dataArc.centroid(d);
              const cx = center[0];
              const cy = center[1];
              const h = Math.sqrt((cx * cx) + (cy * cy));
              const labelRadius = 60;
              console.log(`center = ${cx}, ${cy} with a hypotenuse of ${h}`);
              const labelPosition = [((cx / h) * labelRadius), ((cy / h) * labelRadius)];

              return (<g key={i} className="arc">
                <path
                  d={dataArc(d)}
                  fill={color(d.data.label)}
                  onMouseOver={(e) => { this.mouseOverEvent(d, e); }}
                  onMouseLeave={() => { this.mouseLeaveEvent(); }}
                />
                <path fill="red" d={labelPath(center, labelPosition)} />
                <text
                  className="label"
                  dy=".15em"
                  transform={`translate(${labelPosition})`}
                >
                  {d.value !== 0 && d.data.label}
                </text>
              </g>);
            })}
          </g>
        </svg>
      </div>);
  }
}

export default Piechart;
