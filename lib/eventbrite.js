const { API_key } = require('../config.js');
const request = require('request');
const Promise = require('bluebird');

// ==========================================================================================
//                     OPTIONS for API get request
// ==========================================================================================

// options for Weekend
const weekend_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'this_weekend',
    sort_by: 'date',
    'location.address': 'san francisco',
  },
  headers: {
    authorization: API_key,
  },
};


// options for Month
const month_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'this_month',
    sort_by: 'date',
    'location.address': 'san francisco',
    categories: '103,110,113,116,17001,104,105,102,118,108,109',
    page: 1,
  },
  headers: {
    authorization: API_key,
  },
};

const today_options = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'today',
    sort_by: 'best',
    'location.address': 'san francisco',
  },
  headers: {
    authorization: API_key,
  },
};

const location = {
  method: 'GET',
  url: 'https://www.eventbriteapi.com/v3/events/search',
  qs: {
    'start_date.keyword': 'today',
    sort_by: 'best',
    'location.address': 'san francisco',
  },
  headers: {
    authorization: API_key,
  },
};

// get the venueID and address


// ==========================================================================================
//                    GET requests
// ==========================================================================================


const getMonthEvents = () =>
  new Promise((resolve, reject) => {
    request(month_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

const getWeekendEvents = () =>
  new Promise((resolve, reject) => {
    request(weekend_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

const getTodayEvents = () =>
  new Promise((resolve, reject) => {
    request(today_options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });

module.exports = {
  month: getMonthEvents,
  weekend: getWeekendEvents,
  today: getTodayEvents,
  monthOptions: month_options,
};
