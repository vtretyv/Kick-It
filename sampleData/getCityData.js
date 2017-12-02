const fs = require('fs');
const request = require('request');
const moment = require('moment');
const csvWriter = require('csv-write-stream');
// const getEvents = require('../lib/eventbrite.js');
const { APIKEY } = require('../config.js');
const { cities, cityList } = require('../sampleData/citiesArray.js');



const getCityData = () => {
  const queryOptions = (pageNumber, location) => {
    return ({
      method: 'GET',
      url: 'https://www.eventbriteapi.com/v3/events/search/',
      qs:
      {
        'start_date.range_start': moment().startOf('day').utcOffset(0, true).format(),
        'start_date.range_end': moment().add(60, 'days').utcOffset(0, true).format(),
        'location.address': location,
        // categories: '103,110,113,116,17001,104,105,102,118,108,109',
        categories: '102,103,104,105,106,107,108,109,110,111,113,116,118,17001',
        page: pageNumber,
      },
      headers: {
        authorization: APIKEY,
      },
    });
  };

  const largeDataWriter = csvWriter({
    headers: ["id", "location", "name", "url", "timezone", "starttime", "category", "subcategory", "free?"],
  });
  largeDataWriter.pipe(fs.createWriteStream('sampleData/test.csv'));

  // let searchPage = 1;
  // const searchLocation = cities[39];

  const getPageOfCity = (pg, loc, idx) => {
    request(queryOptions(pg, loc), (error, response, body) => {
      // const page = JSON.parse(body).pagination.page_number;
      // console.log('error', error);
      const parsedEvents = JSON.parse(body).events;
      // console.log(`retrieved ${parsedEvents.length} events for  page #${pg} of ${loc}`);
      // console.log(JSON.stringify(parsedEvents));
      if (parsedEvents) {
        if (parsedEvents.length < 50) {
          // console.log(`No more events for ${loc} starting at ${pg}, at ${idx}`)
        }
        parsedEvents.forEach((event) => {
          const newEvent = [
            event.id,
            loc,
            event.name.text,
            event.url,
            event.start.timezone,
            event.start.utc,
            event.category_id,
            event.subcategory_id,
            event.is_free,
            // event.description.text
          ];
          largeDataWriter.write(newEvent);
          // insertEventintoD3Table;
          
        });
      } else {
        console.log(`No more events for ${loc} starting at ${pg}`);
      }
    });
  };

    // console.log(`saving eventbrite data for results in ${city}`);
  for (let i = 1; i < 2; i += 1) {
    // getPageOfCity(i, cityList[5]);
  }

  cityList.forEach((city, index) => {
    // console.log(`saving eventbrite data for results in ${city}`);
    // for (let i = 1; i < 3; i += 1) {
    //   getPageOfCity(i, city, index);
    // }
    // getPageOfCity(1, city);
  });
};

module.exports = {
  getCityData,
};
