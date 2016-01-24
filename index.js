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

function displayError() {
  console.log('Impossible to get your data usage check your api key')
  displayUsage();
}

function displayUsage() {
  console.log('teksavvy-usage --api-key=MY_API_KEY');
}

if (argv.apiKey) {
  requestUsage(argv.apiKey)
    .then(R.path(['data', 'value']))
    .then(R.last)
    .then(displayResults)
    .catch(displayError);
} else {
  displayUsage();
}

