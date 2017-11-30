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


const Piechart = ({ data }) => (
  <svg className="Piechart" width={width} heigth={height} >
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {pieChart(data).map((d, i) => (
        <g key={i} className="arc">
          <path
            d={dataArc(d)}
            fill={color(d.data.label)}
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
);

export default Piechart;
