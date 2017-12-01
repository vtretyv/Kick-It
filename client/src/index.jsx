import React from 'react';
import ReactDOM from 'react-dom';
import SearchBarContainer from './components/SearchBarContainer.jsx';
import EventListContainer from './components/EventListContainer.jsx';
import Piechart from './components/Piechart.jsx';
import States from './components/States.jsx';


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
      d3Data: []
    };
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
    let music = 0;
    let food = 0;
    let community = 0;
    let dating = 0;
    let entertainment = 0;
    let science = 0;
    let autoBoatAir = 0;
    let active = 0;


    raw.forEach(event => {
      if (event.category_id === '103') {
        music++;
      } else if (event.category_id === '110') {
        food++;
      } else if (event.category_id === '113' || event.category_id === '116') {
        community++;
      } else if (event.category_id === '17001') {
        dating++;
      } else if (event.category_id === '104' || event.category_id === '105') {
        entertainment++;
      } else if (event.category_id === '102') {
        science++;
      } else if (event.category_id === '118') {
        autoBoatAir++;
      } else if (event.category_id === '108' || event.category_id === '109') {
        active++;
      }
    });

    let d3Data = [
      { label: 'music', category: [103], value: music },
      { label: 'food', category: [110], value: food },
      { label: 'community', category: [113, 116], value: community },
      { label: 'dating', category: [17001], value: dating },
      { label: 'entertainment', category: [104, 105], value: entertainment },
      { label: 'science', category: [102], value: science },
      { label: 'autoBoatAir', category: [118], value: autoBoatAir },
      { label: 'active', category: [108, 109], value: active }
    ];

    console.log(d3Data);
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
		.then((response)=> {
			console.log('RESPONSE in runFilters:', response);
			return response.json();
		})
		.then((events)=> {
			console.log('EVENTS in runFilters:', events);
			if (events.rows){
				this.setState({
					featured: events.rows
				})
			} else {
				this.setState({
					featured: events.today.rows
				})
			}	
		}).then(()=>{
			fetch('/weekend', {
				headers: {
					//'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({'city':filters.city}),
			})
			.then((res) => {
				console.log('RESPONSE in weekend POST:', res);
				return res.json();
			})
			.then((data) => {
				let events = JSON.parse(data).events;
				this.setState({
					weekend: events,
				});
			})
			.catch((err)=>{
				console.log('ERROR getting weekend from filter post', err);
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
              <button>Logout</button>
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
            <div>
              <States />
              <Piechart data={this.state.d3Data} />
            </div>
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
