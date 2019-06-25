let db = require('./db')
let GameRoom = require('../models/GameRoom')
let gameroom = new GameRoom();

gameroom.getRooms()
  .then( result => {
    console.log(result);
  })

