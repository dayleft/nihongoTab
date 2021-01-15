'use strict';
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


//data built to return off of callback
const API_DATA = {statusCode: null,body: [],};
const tag = null; //NEED TO ADD RECIEVING PARAM HERE

module.exports.getVocab = async (event) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), getVocab, tag);
  });
  API_DATA.statusCode = 200;
  API_DATA.body = JSON.stringify(API_DATA.body); //Currently showing just an empty [] meaning that the Google sheets API is erroring
  return API_DATA;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// ====================== Google Sheets API boiler plate ==============================================================

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback, arguments[2]); //to take tag if there is one
    oAuth2Client.setCredentials(JSON.parse(token)); 
    callback(oAuth2Client, arguments[2]); //to take tag if there is one
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client,arguments[2]);
    });
  });
}

/**
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getVocab(auth,tag=null) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1MnjxTb54c94-6j1rDHZOWIbL8Qzf9_PN0lcp90vDr_E',
    range: 'Sheet1!C2:F',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
        rows.map((row) => {
          if (tag) {
            if (`${row[3]}`.trim().toLowerCase()==tag.trim().toLowerCase()) {
              API_DATA.body.push({english:`${row[0]}`,hiragana:`${row[1]}`,kanji:`${row[2]}`,tag:`${row[3]}`});
            }
          }
          else {
            API_DATA.body.push({english:`${row[0]}`,hiragana:`${row[1]}`,kanji:`${row[2]}`,tag:`${row[3]}`});
          }
        });
    }
    else {
      console.log('No data found.');
    }
  });
}