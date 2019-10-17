#!/usr/bin/env node

/* eslint no-param-reassign: 0, consistent-return: 0 */

const { pipe, through } = require('mississippi');
const split = require('split2');

const turf = require('@turf/turf');
const turf_helpers = require('@turf/helpers');

const request = require('request-promise-native');

const _ = require('lodash');

const HOST = 'http://localhost:5000';
const MILES = { units: 'miles' };

const FEET_PER_MILE = 5280;

const interestingFeatures = [];

pipe(
  process.stdin,
  split(JSON.parse),
  through.obj(
    async function matchWay(osm_feature, $, cb) {
      try {
        const {
          properties: { osm_id },
          // geometry: { coordinates }
        } = osm_feature;

        const wayLengthFeet = turf.length(osm_feature, MILES) * FEET_PER_MILE;

        if (wayLengthFeet < 20) {
          return cb();
        }

        const {
          geometry: { coordinates: internal_line }
        } = turf.lineSliceAlong(
          osm_feature,
          10 / FEET_PER_MILE,
          (wayLengthFeet - 10) / FEET_PER_MILE,
          MILES
        );

        // const coords = coordinates.map(([x, y]) => [y, x]);
        const [startLon, startLat] = _.first(internal_line);
        const [endLon, endLat] = _.last(internal_line);

        const routingOptions = {
          method: 'GET',
          uri: `${HOST}/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?continue_straight=true`,
          headers: {
            'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
        };

        const route = await request(routingOptions);

        const route_way_ids = route.waypoints.map(({ name }) => name);

        this.push(`${JSON.stringify({ osm_id, route_way_ids })}\n`);

      } catch (err) {
        // console.error(err);
      } finally {
        cb();
      }
    },
    function flush(cb) {
      this.push(
        JSON.stringify(turf_helpers.featureCollection(interestingFeatures))
      );
      cb();
    }
  ),
  process.stdout
);
