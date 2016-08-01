#!/usr/bin/env node

'use strict';

const axios = require('axios');
const argv = require('yargs').argv;
const R = require('ramda');


function requestUsage(apiKey) {
  return axios({
    method: 'get',
    url: 'https://api.teksavvy.com/web/Usage/UsageSummaryRecords?$filter=IsCurrent%20eq%20true',
    headers: {
      'TekSavvy-APIKey': argv.apiKey
    }
  });
}

function leftPad(number) {
  let str = number.toString();

  return str.length < 2 ? `0${str}` : str;
}

function parseAndformatDate(raw_date) {
  return raw_date.substr(0, 10);
}

function displayResults(data) {
  console.log(`for the period from ${parseAndformatDate(data.StartDate)} to ${parseAndformatDate(data.EndDate)}`);
  console.log(`you consumed: ${data.OnPeakDownload}go`);
}

function displayError(e) {
  console.log(e, e.stack);
  console.log('Impossible to get your data usage check your api key')
  displayUsage();
}

function displayUsage() {
  const doc = `
  teksavvy-usage

  Usage:
    teksavvy-usage --api-key=<apiKey>

  Options:
    -h --help          Show this screen.
    --api-key=<apiKey> TekSavvy Api Key
  `;
  console.log(doc);
}

const parseResult = R.compose(R.last, R.path(['data', 'value']));

if (argv.apiKey) {
  requestUsage(argv.apiKey)
    .then(parseResult)
    .then(displayResults)
    .catch(displayError);
} else {
  displayUsage();
}

