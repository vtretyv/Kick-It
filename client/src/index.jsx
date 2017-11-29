import React from 'react';
import ReactDOM from 'react-dom';
import SearchBarContainer from './components/SearchBarContainer.jsx';
import EventListContainer from './components/EventListContainer.jsx';
import Piechart from './components/Piechart.jsx';


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

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      featured: [],
      weekend: [],
      isLoggedIn: false,
      userFirstName: '',
    };
  }
  componentDidMount() {
    // fetch('/initialLoad')
    //   .then((response) => {
    //     // console.log('response received from server:', JSON.stringify(response));
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // console.log('data about to be put into todays state:', data.today);
    //     this.setState({
    //       featured: data.today
    //     })
    //   })
    // .then(() => {
    //   fetch('/weekend')
    //   .then((response) => {
    //     // console.log('data from API for weekend', response);
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // console.log('data about to be put into weekend state: ', data);
    //     let events = JSON.parse(data).events;
    //     this.setState({
    //       weekend: events,
    //     });
    //   });
    // });
  }

  // login() {
  //   console.log('login!!');
  //   fetch('/auth/google', { mode: 'no-cors' })
  //     .then(response => {
  //     // load login page
  //     // this.setState({
  //     //   isLoggedIn: true,
  //     // });
  //   });
  // };

  logout() {
    console.log('logout!!');
    fetch('/login')
      .then(response => {
      // load login page
      });
  };

  runFilters(filters) {
    fetch('/filter', {
      headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(filters),
    })
    .then((response)=> {

      return response.json();
    })
    .then(events=> {
      this.setState({
        featured: events.rows
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Kick It</h1>
        <div>
          {this.state.isLoggedIn ?
            <div>
              <h2>Welcome, YOU!</h2>
              <button onClick={this.logout}>Logout</button>
            </div>
            :
            <div>
              <a href="/auth/google">
                <button>Login</button>  
              </a>      
            </div>
           }
        </div>
        <SearchBarContainer runFilters={this.runFilters.bind(this)}/>
        <div className="album text-muted">
          <div className="container">
=======
      d3Data: []
    }
  }
  componentDidMount() {
    fetch('/initialLoad')
      .then((response) => {
        console.log('response received from server:', JSON.stringify(response));
        return response.json();
      })
      .then((data) => {
        console.log('data about to be put into todays state:', data.today);

        // creates massaged data for d3
        const d3Data = this.createD3Data(data.today);

        // Passes d3data into state
        this.setState({
          featured: data.today,
          d3Data: d3Data
        })
      })
      .then(() => {
        fetch('/weekend')
          .then((response) => {
            console.log('data from API for weekend', response);
            return response.json();
          })
          .then((data) => {
            //console.log('data about to be put into weekend state: ' , data);
            let events = JSON.parse(data).events;
            this.setState({
              weekend: events,
            });
          });
      });
  }

  createD3Data(raw) {

    const d3Data = [
      { label: 'music', value: 33 },
      { label: 'food', value: 53 },
      { label: 'community', value: 32 },
      { label: 'dating', value: 21 },
      { label: 'entertainment', value: 13 },
      { label: 'science', value: 14 },
      { label: 'autoBoatAir', value: 14 }
    ];

    return d3Data;
  }

  runFilters(filters) {
    fetch('/filter', {
      headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(filters),
    })
      .then((response) => {
        return response.json();
      })
      .then((events) => {
        this.setState({
          featured: events.rows
        });
      });
  }

  render() {
    return (
      <div>
        <h1>Kick It</h1>
        <SearchBarContainer runFilters={this.runFilters.bind(this)}/>
        <div className="album text-muted">
          <div className="container">

            <Piechart data={this.state.d3Data} />

            <EventListContainer 
              featuredEvents={this.state.featured}
              weekendEvents={this.state.weekend.slice(0,10)} 
            />
          </div>
        </div>        
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
