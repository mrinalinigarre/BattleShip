let express = require('express');
let router = express.Router();
let Users = require('../classes/Users');
let Lobby = require('../classes/Lobby');
let format = require('pg-format');
let db = require('../db');

router.get('/', function(req,res){

  res.render('index');

})

router.get('/login', function(req,res){

  res.render('login');

})

router.post('/login', function(req,res){

  let username = req.body.username;
  let password = req.body.password;
  let user = new Users();

  user.login(username, password).then( result => {
    if(result){
      res.locals.session.username = username;
      res.redirect('/lobby');
    } else {
      res.render('login');
    }
  })

})

router.get('/register', function(req,res){

  res.render('register');

})

router.post('/register', function(req,res){

  let username = req.body.username;
  let email = req.body.email;
  let createPassword = req.body.createPassword;
  let confirmPassword = req.body.confirmPassword;

  let user = new Users();
  user.register(username, confirmPassword, email)
    .then( () => {
      res.locals.session.username = username;
      res.render('success');
    });

})

router.get('/profile', function(req,res){

  if(!res.locals.session.username){
    res.redirect('/login');
  }

  let user = new Users();

  user.getProfile(res.locals.session.username).then( data =>{
    res.render('profile', {
      username: data[0].username,
      email: data[0].email,
      win: data[0].win,
      loss: data[0].loss,
    })

  })

})

router.get('/signout', function(req,res){

  res.locals.session.destroy( ()=> {
    res.redirect('/');
  });

})

router.get('/lobby', function(req,res){

  if(!res.locals.session.username){
    res.redirect('/login');
  }

  let lobby = new Lobby();

  lobby.getRooms().then( result => {
    res.render('lobby', {
    lobby: result,

    });

  });

})

router.post('/lobby/createRoom', (req, res)=>{

  let lobby = new Lobby();
  lobby.createRoom();
  res.sendStatus(200);

})


router.post('/lobby/deleteRoom/:roomNumber', (req,res)=>{
  var roomNumber = req.params.roomNumber;

  var lobby = new Lobby();
  lobby.deleteRoom(roomNumber).then(()=>{
    res.sendStatus(200);
  });

})

router.post('/lobby/player1Join/:roomNumber', (req,res)=>{
  let username = res.locals.session.username;
  let roomNumber = req.params.roomNumber;

  let lobby = new Lobby();
  lobby.player1Join(username, roomNumber).then(()=>{
    res.sendStatus(200);
  });

})

router.post('/lobby/player2Join/:roomNumber', (req,res)=>{
  let username = res.locals.session.username;
  let roomNumber = req.params.roomNumber;

  let lobby = new Lobby();
  lobby.player2Join(username, roomNumber).then(()=>{
    res.sendStatus(200);
  })

})


router.get('/game/:gameId', (req,res)=>{
  let gameId = req.params.gameId;
  let lobby = new Lobby();

  lobby.getPlayersName(gameId).then((result)=>{
    let player1 = result[0].player1;
    let player2 = result[0].player2;

    res.render('game', {
      gameId: gameId,
      player1: player1,
      player2: player2,
    });

  })
})

router.post('/game/setPositions', (req,res)=>{

  let playerName = req.body.username;
  let gameId = req.body.gameId;
  let ships = req.body.ships;
  let allRows = []

  ships.forEach(ship =>{

    ship.positions.forEach( position => {
      let row = [];
      row.push(gameId);
      row.push(playerName);
      row.push(position);
      row.push(ship.shipType);
      allRows.push(row);
    });

  })

  let query = format('INSERT INTO ship_positions(room_id, player, ship_position, ship_type) VALUES %L', allRows);

  db.any(query).then( ()=>{
    res.sendStatus(200);
  });

})


module.exports = router;
