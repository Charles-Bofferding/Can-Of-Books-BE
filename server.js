'use strict';

//Importing library things
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

//Setting up running env
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

//Next two things come from "the docs" except they const instead of var
// jsonwebtoken doc - https://www.npmjs.com/package/jsonwebtoken
const client = jwksClient({
  jwksUri: 'https://grandvizier.us.auth0.com/.well-known/jwks.json',
});
// grandvizier.us.auth0.com

function getKey(header, callback) {
  // console.log(header);
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}


// TODO: 
// STEP 1: get the jwt from the headers
// STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
// jsonwebtoken doc - https://www.npmjs.com/package/jsonwebtoken
// STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
app.get('/test', (request, response) => {

  // console.log(request);
  // console.log(request.headers);
  console.log(request.header.name);

  //From the request get the json web token from where we hope it is
  const token = request.headers.authorization.split(' ')[1];
    console.log(token);
  // Verify the token, use the getKey from the docs
  // gets an error or user back
  jwt.verify(token, getKey, {}, (err, user) => {

    //Check for an error
    if (err) {
      response.send('This threw an error: ' + err);
    }

    //Sending user back instead of token because we need the user info in the app
    response.send(user);
  });

})

//proof of life check
app.get('/helloWorld', (request, response) => {
  response.send('Hello World!');
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
