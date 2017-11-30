const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const getEvents = require('../lib/eventbrite.js');
const Promise = require('bluebird');

const PORT = process.env.PORT || 3000;
const moment = require('moment');
const { APIKEY } = require('../config.js');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client/dist')));

// ======================================================================
//        Database Functions
// ======================================================================
const db = require('../database/index.js');

// ======================================================================
//   API month's events + venues -> Save to DB
//   API weekend's events ->  Client
// ======================================================================

app.get('/initialLoad', (req, res) => {
  const responseObj = {};
  let eventBriteData = [];
  let currentCity = '';

  const monthOptions = {
    method: 'GET',
    url: 'https://www.eventbriteapi.com/v3/events/search/',
    qs:
    {
      'start_date.range_start': '2017-11-28T00:00:00',
      'start_date.range_end': '2017-12-06T19:00:00',
      'location.address': 'san francisco',
      categories: '103,110,113,116,17001,104,105,102,118,108,109',
      page: 1,
    },
    headers: {
      authorization: APIKEY,
    },
  };

  const getCalls = () => new Promise((resolve, reject) => {
    request(monthOptions, (error, response, body) => {
      const page = JSON.parse(body).pagination.page_number;
      const parsedEvents = JSON.parse(body).events;
      let city = JSON.parse(body).location.augmented_location.city;
      if (!error) {
        eventBriteData = eventBriteData.concat(parsedEvents);
        if (page < 5) {
          monthOptions.qs.page += 1;
          resolve(getCalls());
        } else {
          currentCity = city;
          // console.log('Data length in get calls function', eventBriteData.length);
          resolve(eventBriteData);
        }
      } else {
        reject(error);
      }
    });
  });

  getCalls()
    .then(temp =>

      temp.map((event) => {
        const imageUrl = event.logo ? event.logo.url : 'https://cdn.evbstatic.com/s3-build/perm_001/f8c5fa/django/images/discovery/default_logos/4.png';
        const catID = event.subcategory_id === 17001 ? event.subcategory_id : event.category_id;
        const defaultPrice = event.is_free ? 'free' : 'paid';
        const eventName = `$$${event.name.text}$$`;
        const eventDesc = `$$${event.description.text}$$`;
        return {
          id: event.id,
          name: eventName,
          description: eventDesc,
          venue_id: event.venue_id,
          price: defaultPrice,
          url: event.url,
          image_url: imageUrl,
          start_datetime: event.start.local,
          end_datetime: event.end.local,
          category_id: catID,
          city: currentCity,
          day: moment(event.start.local).format('dddd'),
        };
      })
    ).then((formattedEvents) => {
      db.addEvents(formattedEvents)
        .then(() => {
          db.getTodaysEvents()
            .then((data) => {
              responseObj.today = data.rows;
              res.json(responseObj);
            });
        });
    })
    .then(() => {
      app.get('/weekend', (req, res) => {
        getEvents.weekend()
          .then((data) => {
            res.json(data);
          });
      });
    }).then(() =>{
      db.searchEventsByCity('San Francisco').then((cityEvents) =>{
        console.log('in the search events by city then');
        // console.log('CityEvents', cityEvents);
      }).catch((err)=>{
        console.log('Error fetching events for San Francisco Hardcoded')
      });
    });
});

// ======================================================================
//                    Query the DB on client filters
// ======================================================================
app.post('/filter', (request, response) => {
  const { date, price } = request.body;
  const categories = request.body.category;
  let city = request.body.city;
  // const date = request.body.date;
  // const price = request.body.price;
  console.log('City works?', request.body.city)
  db.searchAllEvents(date, categories, price)
  if (city === '') {
    city = 'San Francisco';
  } else {
    db.searchEventsByCity(city).then((cityEvents)=>{
      if (cityEvents.length === 0){
        //Do API call for city
      } else {
        //We know we already have it in our DB, serve it from db
        db.searchAllEvents(date, categories, price, city)
        .then((data) => {
          response.json(data);
        });
      }

    })
  }
  db.searchAllEvents(date, categories, price, city)
    .then((data) => {
      response.json(data);
    });
});


// ======================================================================
//                    Send today's data back to the client
// ======================================================================
app.get('/loadToday', (request, response) => {
  getEvents.today()
    .then((data) => {
      response.json(data);
    });
  // getTodayEventsDB
});
// ======================================================================
//                    load Venues to DB
// ======================================================================
app.get('/loadVenues', (request, response) => {
  getEvents.month()
    .then((data) => {
      response.json(data);
    });
});

// ======================================================================
//                    Run Server
// ======================================================================

module.exports = app.listen(PORT, () => {
  console.log(`BNVC Kick-It is listening on port ${PORT}!`);
});