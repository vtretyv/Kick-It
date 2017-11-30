import React from 'react';
import ReactDOM from 'react-dom';
import SearchBarContainer from './components/SearchBarContainer.jsx';
import EventListContainer from './components/EventListContainer.jsx';
//import WeekendListContainer from './components/WeekendListContainer.jsx';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			featured: [],
			weekend: [],
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
				this.setState({
					featured: data.today
				})
			})
		.then(() => {
			fetch('/weekend')
			.then((response) => {
				console.log('data from API for weekend', response);
				return response.json();
			})
			.then((data) => {
				console.log('data about to be put into weekend state: ' , data);
				let events = JSON.parse(data).events;
				this.setState({
					weekend: events,
				});
			});
		});
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
		})
		// .then(() => {
		// 	fetch(`/weekend/${}`)
		// })
	}

	render() {
		return (
			<div>
				<h1>Kick It</h1>
				<SearchBarContainer runFilters={this.runFilters.bind(this)}/>
				<div className="album text-muted">
					<div className="container">
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
