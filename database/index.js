// pg allows node to use postgres
const pg = require('pg');
const config = require('../knexfile.js');  
const dev = 'development';
const prod = 'production';
let knex = require('knex')(config[dev]);
const bookshelf = require('bookshelf')(knex);
const _ = require('lodash');
const Promise = require('bluebird');
const categoryList = require('../category_map.json');
const moment = require('moment');

const fs = require('fs')
const copyFrom = require('pg-copy-streams').from

// knex.raw('DROP DATABASE IF EXISTS d3data;').then( () => {
// knex.raw('CREATE DATABASE d3data;').then( () => {
//     knex.destroy();
//     config[dev]['connection']['database'] = 'd3data';
//     knex = require('knex')(config[dev]);
//     module.exports = knex;
//   }).then(() => {
//     knex.raw(`DROP TABLE IF EXISTS test;`).then( () => {
//     console.log('creating test table...');
//     knex.schema.createTable('test', (table) => {
//       table.string('id').primary();
//       table.string('name');
//       table.string('music');
//       table.string('food');
//       table.string('community');
//       table.string('dating');
//       table.string('entertainment');
//       table.string('science');
//       table.string('autoboatair');
//       table.string('active');
//     })
//     }).catch((err) => { console.log(err); })
//   });
// });


// knex.raw('DROP DATABASE IF EXISTS kickit;').then( () => {

  const initDB = () => {

  // knex.raw('CREATE DATABASE kickit;').then
  // ( () => {
  //   knex.destroy();
    return new Promise ((resolve, reject) => {
    config[dev]['connection']['database'] = 'kickit';
    knex = require('knex')(config[dev]);
    module.exports = knex;
    })
    .then(() => {
    knex.raw(`DROP TABLE IF EXISTS venues;`).then( () => {
    knex.schema.createTable('venues', (table) => {
      table.string('id').primary();
      table.text('address', 'longtext');
      table.string('name');
    }).then(() => {
    knex.raw(`DROP TABLE IF EXISTS categories;`).then( () => {
      knex.schema.createTable('categories', (table) => {
        table.string('id').primary();
        table.string('shortname');
        table.string('name');
      }).then(() => {
        console.log('creating d3data table');
        knex.schema.createTable('d3data', (table) => {
          table.string('id').primary();
          table.string('name');
          table.string('category');
          // table.string('food');
          // table.string('community');
          // table.string('dating');
          // table.string('entertainment');
          // table.string('science');
          // table.string('autoboatair');
          // table.string('active');
        }).then( () => {
        // knex.raw(`DROP TABLE IF EXISTS categories;`).then( () => {
            // Promise.resolve(knex.raw(`COPY d3data FROM 'testdata.csv' WITH (FORMAT csv);`))
            Promise.resolve(() => {
              console.log('starting to copy data from .csv');
              // knex.client.pool.acquire(function(err, client){
              //   const done = (err) => {
              //     console.log('done copying data from .csv into d3data');
              //     connection.client.pool.release(client)
              //     if (err) console.log(err)
              //     else console.log('success')
              //   }
              //   var stream = client.query(copyFrom('COPY d3data FROM STDIN'))
              //   var fileStream = fs.createReadStream('testdata.csv');
              //   fileStream.on('error', done)
              //   fileStream.pipe(stream).on('finish', done).on('error', done)
              // })
            })
         
          .then( () => {
        console.log('Inserting values to categories table..');
        Promise.resolve(addCategories(categoryList)).then(() => {
          knex.raw(`DROP TABLE IF EXISTS events;`).then(() => {
            console.log('Creating events table..');
            knex.schema.createTable('events', (table) => {
              table.string('id').primary();
              table.string('name');
              table.text('description', 'longtext');
              table.string('venue_id');
              // table.foreign('venue_id').references('venues.id');
              table.string('price');
              table.varchar('url');
              table.varchar('city');
              table.varchar('image_url');
              table.dateTime('start_datetime');
              table.dateTime('end_datetime');
              table.string('day');
              table.string('category_id');
              table.foreign('category_id').references('categories.id');
            }).catch((err) => { console.log(err); });
          });
        })
          })
        });
      });
    });
  });
      });
  });
// });
};


//==========================================================================================
//                    Events Table
//==========================================================================================

class Event extends bookshelf.Model {
  get tableName() {
    return 'events';
  }
}

const Events = bookshelf.Collection.extend({
  model: Event,
})


module.exports = {
  //Promise.resolve(knex.raw(`INSERT INTO events (id, name, description, venue_id, price, url, image_url, start_datetime, end_datetime, category_id) VALUES ('${event.id}', ${event.name}, ${event.description}, '${event.venue_id}', '${event.price}', '${event.url}', '${event.image_url}', '${event.start_datetime}', '${event.end_datetime}', '${event.category_id}')`))
  // add events to table
  // eventsList should be an array of event objects
  // an event object should look like the following:
  // {name: '', description: '', venue_id: '', price: '', url: '', image_url: '', start_datetime: '', end_datetime: '', category_id: '' }
  addEvents: (eventsList) => {
    return new Promise((resolve, reject) => {
      eventsList.forEach((event) => {
        Promise.resolve(knex.raw(`INSERT INTO events (id, name, description, venue_id, price, url, city, image_url, start_datetime, end_datetime, category_id) SELECT '${event.id}', ${event.name}, ${event.description}, '${event.venue_id}', '${event.price}', '${event.url}', '${event.city}', '${event.image_url}', '${event.start_datetime}', '${event.end_datetime}', '${event.category_id}' WHERE NOT EXISTS (SELECT 1 from events WHERE id='${event.id}')`)).then( (results) => {
          resolve(results);
        }).catch((err) => {
          console.log('Error occurred adding events to DB: ');
          reject(err);
        });
      });
    });
  },

  getTodaysEvents: (city = 'San Francisco') => {
    const todayStart = moment().startOf('day').utcOffset(0, true).format() //moment().startOf('day').format();
    const todayEnd = moment().add(60, 'days').utcOffset(0, true).format() //moment().endOf('day').format();
    return new Promise((resolve, reject) => {
      Promise.resolve(knex.raw(`SELECT * from events e WHERE e.start_datetime BETWEEN '${todayStart}' AND '${todayEnd}' AND e.city='${city}'`)).then( (results) => {
        resolve(results);
      }).catch((err) => {
        console.log('Error occurred gravbbing todays events from DB ');
        reject(err);
      });
    });
  },

  getWeekendEvents: () => {
    // console.log('day of week testing: ', moment().day(3))
    // Promise.resolve( () => {
    //   knex.raw(`SELECT * from events e WHERE e.start_datetime BETWEEN '${todayStart}' AND '${todayEnd}'`).catch( (err) => {
    //     console.log('Error occurred adding events: ', err);
    //   });
    // })
  },

  // addD3Event: (obj) => {

  // }

  // search for events in table
  // categories will always be a list of category
  searchAllEvents: (date, categories, price, city) => {
    const dayStart = moment(date).startOf('day').format();
    const dayEnd = moment(date).endOf('day').format();
    const priceVal = price !== 'all' ? `('${price}')` : `('paid', 'free')`;
    let query;
    if ( categories.length > 0 ) {   
      let categoryList = categories.join('\',\'');
      categoryList = "'" + categoryList + "'";
      query = `SELECT e.*, c.name AS category_name FROM events AS e JOIN categories AS c ON e.category_id = c.id WHERE e.price IN ${priceVal} AND e.start_datetime BETWEEN '${dayStart}' AND '${dayEnd}' AND c.shortname IN (${categoryList})`;
    } else {
      query = `SELECT e.*, c.name AS category_name FROM events AS e JOIN categories AS c ON e.category_id = c.id WHERE e.price IN ${priceVal} AND e.start_datetime BETWEEN '${dayStart}' AND '${dayEnd}'`;
    }
    if (city !== undefined) {
      query += ` AND e.city = '${city}'`;
    }
    return new Promise((resolve, reject) => {
      resolve(knex.raw(query).catch((err) => {
        console.log('Error occurred finding events: ');
      })
      );
    }).catch((err) => {
      throw err;
    });
  },

  searchEventsByCity: (city)=>{
    let query;
    query = `SELECT * FROM events where events.city='${city}'`;
    return new Promise((resolve, reject) => {
      resolve(knex.raw(query).catch((err) => {
        console.log('Error occurred finding events: ');
      })
      );
    });
  },

  insertStateData: (eventList) => {
    return new Promise((resolve, reject) => {
      eventsList.forEach((event) => {
        Promise.resolve(knex.raw(`INSERT INTO events (id, name, description, venue_id, price, url, city, image_url, start_datetime, end_datetime, category_id) SELECT '${event.id}', ${event.name}, ${event.description}, '${event.venue_id}', '${event.price}', '${event.url}', '${event.city}', '${event.image_url}', '${event.start_datetime}', '${event.end_datetime}', '${event.category_id}' WHERE NOT EXISTS (SELECT 1 from events WHERE id='${event.id}')`)).then( (results) => {
          resolve(results);
        }).catch((err) => {
          console.log('Error occurred adding events to DB: ');
          reject(err);
        });
      });
    });
  }

};


//==========================================================================================
//                    Categories Table
//==========================================================================================

let Category = bookshelf.Model.extend({
  tableName: 'categories',
});


// add categories to table
const addCategories = (categoryList) => {
  categoryList.categories.map((category) => {
    knex.raw(`INSERT INTO categories (id, shortname, name) VALUES (${category.id}, '${category.shortname}', '${category.name}')`).catch( (err) => {
      console.log('Error occurred adding categories: ', err);
    });
  });
};

