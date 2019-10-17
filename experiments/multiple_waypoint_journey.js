#!/usr/bin/env node

const request = require('request-promise-native');
const _ = require('lodash');

const HOST = 'http://127.0.0.1:5000';

const locations = [
  // UAlbany
  { lat: 42.688188, lon: -73.823153 },
  // Pho Yum
  { lat: 42.715296, lon: -73.830533 },
  // Hannaford
  { lat: 42.71651, lon: -73.812453 },
  // Rensselaer Walmart
  { lat: 42.641411, lon: -73.699788 }
]
  .map(({ lat, lon }) => `${lon},${lat}`)
  .join(';');

const options = {
  method: 'GET',
  uri: `${HOST}/route/v1/driving/${locations}?continue_straight=true&steps=true`,
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

(async () => {
  const response = await request(options);
  const {
    routes: [{ legs }]
  } = response;

  const way_ids = _.flatten(
    legs.map(leg => leg.steps.map(({ name }) => name))
  ).reduce((acc, way_id, i, arr) => {
    if (way_id !== arr[i - 1]) {
      acc.push(way_id);
    }

    return acc;
  }, []);

  const qgis_filter = `"osm_id" IN (${way_ids.map(w => `'${w}'`)})`;
  console.log(qgis_filter);

  // console.log(JSON.stringify(response, null, 4));
})();
