import React, { Component } from 'react';
// import { min, max } from 'd3-array';
// import { interpolate } from 'd3-interpolate';
// import stateData from '../../../lib/stateData.js';
// import _ from 'underscore';
// import $ from 'jquery';

// Tree configuration
const branches = [];
const seed = {
  index: 0,
  startx: 420,
  starty: 600,
  angle: 0,
  length: 130,
  endx: 420,
  endy: 470,
  depth: 0,
  parent: null,
}; // a = angle, l = length, d = depth
seed.path = ['M', seed.startx, ',', seed.starty, 'L', seed.endx, ',', seed.endy].join('');
const angleDelta = 0.5;
const lengthDelta = 0.7; // how much to shorten sequential branches by at each depth
const randomnessFactor = 0.7;
const maxDepth = 10;

// Tree creation functions

const branchEndPoint = (branch) => {
  const x = branch.startx + (branch.length * Math.sin(branch.angle));
  const y = branch.starty - (branch.length * Math.cos(branch.angle));
  return { x, y };
};

const createBranch = (branch) => {
  const prevBranchEnd = branchEndPoint(branch);
  let newAngleRandomizer = null;
  let newBranchAngle = null;
  const newBranchLength = branch.length * lengthDelta;
  let newLeftBranch = null;
  let newRightBranch = null;

  branches.push(branch);

  if (branch.depth === maxDepth) {
    return;
  }

  // left branch
  newAngleRandomizer = (randomnessFactor * Math.random()) - (angleDelta * 0.5);
  newBranchAngle = (branch.angle - angleDelta) + newAngleRandomizer;
  newLeftBranch = {
    index: branches.length,
    startx: prevBranchEnd.x,
    starty: prevBranchEnd.y,
    angle: newBranchAngle,
    length: newBranchLength,
    endx: prevBranchEnd.x + (newBranchLength * Math.sin(newBranchAngle)),
    endy: prevBranchEnd.y - (newBranchLength * Math.cos(newBranchAngle)),
    depth: branch.depth + 1,
    parent: branch.index,
  };
  newLeftBranch.path = ['M', newLeftBranch.startx, ',', newLeftBranch.starty, 'L', newLeftBranch.endx, ',', newLeftBranch.endy];
  console.log(`nlb path: ${newLeftBranch.path}`);
  newLeftBranch.path = newLeftBranch.path.join('');
  console.log(`nlb path: ${newLeftBranch.path}`);
  createBranch(newLeftBranch);

  // right branch
  newAngleRandomizer = (randomnessFactor * Math.random()) - (angleDelta * 0.5);
  newBranchAngle = (branch.angle + angleDelta) + newAngleRandomizer;
  newRightBranch = {
    index: branches.length,
    startx: prevBranchEnd.x,
    starty: prevBranchEnd.y,
    angle: newBranchAngle,
    length: newBranchLength,
    endx: prevBranchEnd.x + (newBranchLength * Math.sin(newBranchAngle)),
    endy: prevBranchEnd.y - (newBranchLength * Math.cos(newBranchAngle)),
    depth: branch.depth + 1,
    parent: branch.index,
  };
  newRightBranch.path = ['M', newRightBranch.startx, ',', newRightBranch.starty, 'L', newRightBranch.endx, ',', newRightBranch.endy];
  console.log(`nrb path: ${newRightBranch.path}`);
  newRightBranch.path = newRightBranch.path.join('');
  console.log(`nrb path: ${newRightBranch.path}`);
  createBranch(newRightBranch);
};


// const ToolTipTree = ({ data }) =>
//   (
//     <div className="toolTree">
//       <div>{`${data}`}</div>
//     </div>);

// // ===================
// // Changes sample data to a form that the Piechart wants
// // Triggered on click
// // ===================
// function formatDataForPie(id) {
//   return _.map(sampleData[id], (value, label) => {
//     return { label: label, value: value };
//   });
// }

// function dataReturn(branch) {
//   return branch.d;
// }

function branchWidth(branch, index) {
  console.log(`branch size = ${branch.length}`);
  console.log(`branch index = ${index}`);
  return (10 - branch.depth).toString();
}


class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // hover: false,
      // selection: {},
      branches2: [
        { path: "M420,730L420,600", depth: 0 },
        { path: "M420,600L360,540", depth: 7 },
        { path: "M420,600L480,540", depth: 7 }
      ],
      branches3: [],
      // mouseX: 0,
      // mouseY: 0,
    };
  }


  // fakeData () {
  //   console.log('fake data being created');
  //   this.setState({
  //     branches2: [
  //       { data: "M420,600L420,730", depth: 4 },
  //       { data: "M420,730L382,634", depth: 1 },
  //       { data: "M420,730L341,561", depth: 1 }
  //     ],
  //   });
  // }

  componentWillMount () {
    // this.fakeData();
  }

  // mouseEnterEvent(d) {
  //   this.setState({
  //     hover: true,
  //     selection: {name: d.n, id: d.id }
  //   });
  // }


  // mouseLeaveEvent() {
  //   this.setState({
  //     hover: false,
  //   });
  // }

  // mouseMoveEvent(data, e) {
  //   const mouseX = e.clientX;
  //   const mouseY = e.clientY;
  //   const toolTipUS = document.getElementsByClassName('toolUS');
  //   toolTipUS[0].style.top = (mouseY - 200) + 'px';
  //   toolTipUS[0].style.left = (mouseX - 300) + 'px';
  //   // console.log(`mouse is at: (${mouseX}, ${mouseY})`);
  // trokeWidth={() => {return branchWidth(branch, index);}}
  // }

  render() {
    createBranch(seed);

    const newPaths = [];
    for (let i = 0; i < branches.length; i++) {
      newPaths.push(branches[i].path);
    }

    // newPaths.shift();

    console.log(`final paths of branches: ${JSON.stringify(newPaths, null, 2)}`);
    
    // console.log(JSON.stringify(this.state.branches2, null, 2));
    return (
      <div>
        <svg className="Tree">
          {branches.map((branch, index) => {
            const sw = {
              strokeWidth: branchWidth(branch, index),
            };
            console.log('sw: ', sw.strokeWidth);
            return (<path
              {...sw}
              className="branch"
              stroke="green"
              d={branch.path}
            />);
          })}
        </svg>
        HELLO
      </div>);
  }
}

export default Tree;

/* 
return (
      <div>
        <svg className="Tree">
          {this.state.branches2.map((branch, index) => {
            const sw = {
              strokeWidth: branchWidth(branch, index),
            };
            return (<path
              {...sw}
              className="branch"
              stroke="green"
              d={branch.path}
            />);
          })}
        </svg>
        HELLO
      </div>);
  }
*/