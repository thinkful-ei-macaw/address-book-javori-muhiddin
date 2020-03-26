'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const uuid = require('uuid/v4');  

const app = express();


const morganOption = (NODE_ENV === 'production')
  ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

const people = [
  {
    id: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    address2: 'Apt 11',
    city: 'Chicago',
    state: 'IL',
    zip: '60007'
  },
  {
    id: uuid(),
    firstName: 'Jane',
    lastName: 'Sue',
    address1: '134 Main Ave',
    address2: 'Apt 12',
    city: 'Aurora',
    state: 'KS',
    zip: '80001'
  }
];

app.get('/address', (req, res) => {
  res.json(people);
});

app.post('/address', (req, res) => {
  
  const {id, firstName, lastName, address1, address2 = '', city, state, zip} = req.body;
  
  if(!firstName) {
    return res
      .status(400)
      .send('First name is required');
  }
  
  if(!lastName) {
    return res
      .status(400)
      .send('Last Name is required');
  }

  if(!address1) {
    return res
      .status(400)
      .send('Address 1 is required');
  }

  if(!city) {
    return res
      .status(400)
      .send('City is required');
  }

  if(!state) {
    return res
      .status(400)
      .send('State is required');
  }

  if(!zip) {
    return res
      .status(400)
      .send('Zip code is required');
  }
  if(state.length !== 2) {
    return res
      .status(400)
      .send('State must be 2 characters');
  }
  if(zip.length !== 5) {
    return res
      .status(400)
      .send('Zip code must be 5 digits');
  }
  
  const newUser = {id, firstName, lastName, address1, address2, city, state, zip};  
  newUser.id = uuid();
  people.push(newUser);
  res
    .status(201)
    .location(`http://localhost:8000/address/${id}`)
    .json(newUser); 
});


app.delete('/address/:userId', (req, res) => {
  const { userId } = req.params;
  const index = people.findIndex(u => u.id === userId);
  if (index === -1) {
    return res
      .status(404)
      .send('Address not found');
  }
  people.splice(index, 1);
  res.send('Deleted');
});


module.exports = app;
