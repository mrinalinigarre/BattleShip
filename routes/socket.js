module.exports = function(io){

  let express = require('express');
  let router = express.Router();
  let Lobby = require('../classes/Lobby');
  let Game = require('../classes/Game');
  let Users = require('../classes/Users');

  //Array to keep a list of all users connected
  let users = [];


  io.on('connection', (socket)=>{

    //  A user connects to the lobby
    //  Get their username and socket.id and push it into users array
    //  Make all clients update their list of users
    socket.on('lobby-connect', (data)=>{
      let user = {
        username: data.username,
        id: socket.id,
      }

      users.push(user);

      io.emit('load-users', {
        users: users,
      })

    })

    //  A user disconnects from lobby
    //  Find user with matching socket.id and remove from array
    //  Make all users reload their list of users
    socket.on('disconnect', ()=>{
      users.forEach((user, index)=>{
        if(user.id === socket.id){
          users.splice(index,1);
        }
      })

      io.emit('load-users', {
        users: users,
      })

    })

    //  A user sends a message on lobby chat
    //  Let all client see the message in lobby chat
    socket.on('message-send', (data)=>{
      io.emit('message-sent',data);
    });


    //  A user clicks 'create room' button
    //  Retrieve the last room created on database
    //  Send to all users the roomId that was created
    //  Create a socket namespace with the roomId
    socket.on('create-room', ()=>{
      let lobby = new Lobby();

      lobby.getLastRoom().then( result =>{
        let roomId = result[0].id;

        createNamespace(roomId);

        io.emit('created-room', {
          id: roomId,
        })
      })

    })

    //  A user clicks join button on player1
    //  Send to all users data of the playername of who clicked and the roomId 
    socket.on('player1-click-join', (data)=>{
      let lobby = new Lobby();
      let roomId = data.roomId;

      lobby.getPlayer1Name(roomId).then((result)=>{
        io.emit('player1-join', {
          roomId: roomId,
          player1name: result[0].player1,
        })
      });

    })

    //  A user clicks join button on player2
    //  Send to all users data of playername of who clicked and roomId
    socket.on('player2-click-join', (data)=>{
      let lobby = new Lobby();
      let roomId = data.roomId;

      lobby.getPlayer2Name(roomId).then((result)=>{
        io.emit('player2-join', {
          roomId: roomId,
          player2name: result[0].player2,
        })
      });

    })


  })  // io.on(connection) end

  //Private socket for each individual game room
  function createNamespace(roomId){
    let room = io.of('/game/' + roomId);
    let ready = 0;
    let player1 = '';
    let player2 = '';
    let player1positions = [];
    let player2positions = [];
    let ship1obj = {};
    let ship2obj = {};
    let turn;
    let game = new Game();
    let lobby = new Lobby();
    let user = new Users();

    //  A user connects to room
    //  Set players as player1 and player2
    //  Send to both users name of players connected
    room.on('connection', (socket)=>{
      lobby.getPlayersName(roomId).then( result =>{

        player1 = result[0].player1;
        player2 = result[0].player2;

        room.emit('player-connected', {
          player1: result[0].player1,
          player2: result[0].player2,
        })

      });

    //  A user sends a message on room chat
    //  Send to all users the message and username that was sent
    socket.on('message-send', data => {
      room.emit('message-sent', {
        message: data.message,
        username: data.username
      })

     });

    //  A user clicks on ready
    //  If 1 user clicks ready, notify all users the player is ready to play
    //  If 2 users clicks ready,
    //  Get ship positions from DB and store them as arrays
    //  Randomly select a user to have the first turn
    //  Start game
    socket.on('player-ready', (data)=>{
      ready++;

      if(ready === 1){
        room.emit('message-sent', {
          username: '<span style="color:green"><strong>SERVER</strong></span>',
          message: '<span style="color:green;"><strong>' + data.username.toUpperCase() + ' IS READY</strong></span>',
        })
      }

      if(ready === 2){
        game.getShipPositions(roomId, player1).then( results =>{

          results.forEach( result =>{
            player1positions.push(result.ship_position);
          })

        }).then(()=>{

        game.getShipPositions(roomId, player2).then( results =>{

          results.forEach( result =>{
              player2positions.push(result.ship_position);
          })

        }).then(()=>{

          if( (Math.floor(Math.random() * 2) + 1) === 1){
            turn = player1;
          } else {
            turn = player2;
          }

          room.emit('start-game', {
            player1positions : player1positions,
            player2positions : player2positions,
            turn,
          });

          ready = 0;

          })

        })

      }

    })  // socket.on('ready-player') end

    //  User clicks end turn
    //  Check if selected position corresponds with a position the opponent has
    //  If yes, emit 'hit' and remove the positon from the array, else emit 'miss'
    //  If a player's position array is empty, the other player wins
    socket.on('check-position', (data)=>{
      let shotPosition = data.position;
      let boardPosition = getBoardPosition(data.position);

      //If shot is from player1
      if(player1 == data.playerName){

        //If player1 hits an enemey ship
        if(player2positions.includes(data.position)){
          let index = player2positions.indexOf(data.position);

          player2positions.splice(index, 1);

          game.getShipName(roomId, player2, data.position).then( data =>{
            let shipName = data[0].ship_type;
            shipName.toUpperCase();

            let message = boardPosition + ' - ' +  player1 + ' hits a ' + shipName + '.';

            room.emit('hit', {
              playerName: player1,
              position: shotPosition,
              message: message,
            });

            room.emit('message-sent', {
              username: '<span style="color:red;"><strong>GAME</strong></span>',
              message: message,
            });

          })

        } else {
          /* Player 1 hits water */
          let message = boardPosition + ' - ' + player1 + ' hits water.';

          room.emit('miss', {
            playerName : player1,
            position: shotPosition,
            message: message,
          });

          room.emit('message-sent', {
              username: '<span style="color:red"><strong>GAME</strong></span>',
              message: message,
          })

        }

        if(player2positions.length == 0){

          game.deleteGameRoom(roomId).then(()=>{

            game.deleteShipPositions(roomId);
            user.addWin(player1);
            user.addLoss(player2);
            room.emit('game-over', {
              winner: player1,
            })

          })

          return;
        }

        room.emit('end-turn', {
          turn: player2,
        });

        //If shot is from player2
        } else {

          if(player1positions.includes(data.position)){
            let index = player1positions.indexOf(data.position);

            player1positions.splice(index, 1);

            game.getShipName(roomId, player1, data.position).then( data =>{
              let shipName = data[0].ship_type;
              shipName.toUpperCase();

              let message = boardPosition + ' - ' +player2 + ' hits a ' + shipName + '.';

              room.emit('hit', {
                playerName: player2,
                position: shotPosition,
                message: message,
              });

              room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message: message ,
              })

            })

          } else {
            /* Player 2 hits water */

            let message = boardPosition + ' - ' + player2 + ' hits water.';
            room.emit('miss', {
              playerName: player2,
              position: shotPosition,
              message: message,
            });

            room.emit('message-sent', {
                username: '<span style="color:red"><strong>GAME</strong></span>',
                message:  message,
             })
          }

          if(player1positions.length == 0){

            game.deleteGameRoom(roomId).then(()=>{

              game.deleteShipPositions(roomId);
              user.addWin(player2);
              user.addLoss(player1);
              room.emit('game-over', {
                winner: player2,
              })

            })

            return;
          }

          room.emit('end-turn', {
            turn: player1,
          });

        }

    })

    /*
    socket.on('opponent-mouseover', (data)=>{
      room.emit('highlight-opponent-mouseover', {
        playerName: data.playerName,
        position: data.position,
      })
    })

    socket.on('opponent-mouseleave', (data)=>{
      room.emit('highlight-opponent-mouseleave', {
        playerName: data.playerName,
        position: data.position,
      })
    })*/

  }) //Individual Room Socket end

  }

  return router;
}

function getBoardPosition(num){
  let lastDigit = num % 10;

  switch(true){
    case(num > -1 && num < 10):
      return 'A' + (lastDigit + 1);
      break;

    case(num > 9 && num < 20):
      return 'B' + (lastDigit + 1);
      break;

    case(num > 19 && num < 30):
      return 'C' + (lastDigit + 1);
      break;

    case(num > 29 && num < 40):
      return 'D' + (lastDigit + 1);
      break;

    case(num > 39 && num < 50):
      return 'E' + (lastDigit + 1);
      break;

    case(num > 49 && num < 60):
      return 'F' + (lastDigit + 1);
      break;

    case(num > 59 && num < 70):
      return 'G' + (lastDigit + 1);
      break;

    case(num > 69 && num < 80):
      return 'H' + (lastDigit + 1);
      break;

    case(num > 79 && num < 90):
      return 'I' + (lastDigit + 1);
      break;

    case(num > 89 && num < 100):
      return 'J' + (lastDigit + 1);
      break;

    default:
      return 'none';
      break;
  }
}

