#!/usr/bin/env node

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

function displayResults(data) {
  console.log(`for the period from ${data.StartDate} to ${data.EndDate}`);
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
    .then(console.log)
    .then(displayResults)
    .catch(displayError);
} else {
  displayUsage();
}

