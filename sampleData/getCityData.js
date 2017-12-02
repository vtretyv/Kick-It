const fs = require('fs');
const request = require('request');
const moment = require('moment');
const csvWriter = require('csv-write-stream');
// const getEvents = require('../lib/eventbrite.js');
const { APIKEY } = require('../config.js');
const { cities } = require('../sampleData/citiesArray.js');

const getCityData = () => {
  const queryOptions = (pageNumber, location) => {
    return ({
      method: 'GET',
      url: 'https://www.eventbriteapi.com/v3/events/search/',
      qs:
      {
        'start_date.range_start': moment().startOf('day').utcOffset(0, true).format(),
        'start_date.range_end': moment().add(50, 'days').utcOffset(0, true).format(),
        'location.address': location,
        categories: '103,110,113,116,17001,104,105,102,118,108,109',
        page: pageNumber,
      },
      headers: {
        authorization: APIKEY,
      },
    });
  };

  const largeDataWriter = csvWriter({
    headers: ["id", "location", "name", "timezone", "starttime", "category"],
  });
  largeDataWriter.pipe(fs.createWriteStream('sampleData/test.csv'));

  // let searchPage = 1;
  // const searchLocation = cities[39];

  const getPageOfCity = (pg, loc) => {
    request(queryOptions(pg, loc), (error, response, body) => {
      // const page = JSON.parse(body).pagination.page_number;
      // console.log('error', error);
      const parsedEvents = JSON.parse(body).events;
      // console.log(`retrieved ${parsedEvents.length} events for  page #${pg} of ${loc}`);
      //console.log(JSON.stringify(parsedEvents));
      if (parsedEvents) {
        parsedEvents.forEach((event) => {
          const newEvent = [
            event.id,
            loc,
            event.name.text,
            // url: event.url,
            event.start.timezone,
            event.start.utc,
            event.category_id,
            event.subcategory_id,
          ];
          largeDataWriter.write(newEvent);
        });
      }
    });
  };

    // console.log(`saving eventbrite data for results in ${city}`);
  for (let i = 1; i < 3; i += 1) {
    getPageOfCity(i, 'austin');
  }

  // cities.forEach((city) => {
  //   // console.log(`saving eventbrite data for results in ${city}`);
  //   for (let i = 1; i < 3; i += 1) {
  //     getPageOfCity(i, 'austin');
  //   }
  // });
};

module.exports = {
  getCityData,
};
