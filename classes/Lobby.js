let db = require('../db');

class Lobby{

  constructor(){}

  createRoom(){
    return db.any("INSERT INTO game_room(player1) VALUES(NULL)");
  }

  deleteRoom(roomNumber){
    return db.any('DELETE FROM game_room WHERE id = $1', roomNumber);
  }

  getRooms(){
    return db.any('SELECT game_room.id, game_room.player1, game_room.player2 FROM game_room ORDER BY id');
  }

  getLastRoom(){
    return db.any('SELECT id FROM game_room ORDER BY id DESC');
  }

  player1Join(playerName, roomNumber){
    return db.any('UPDATE game_room SET player1 = $1 WHERE id = $2', [playerName, roomNumber]);
  }

  player2Join(playerName, roomNumber){
    return db.any('UPDATE game_room SET player2 = $1 WHERE id = $2', [playerName, roomNumber]);
  }

  getPlayer1Name(roomNumber){
    return db.any('SELECT player1 FROM game_room WHERE id = $1', [roomNumber]);
  }

  getPlayer2Name(roomNumber){
    return db.any('SELECT player2 FROM game_room WHERE id = $1', [roomNumber]);
  }

  getPlayersName(roomNumber){
    return db.any('SELECT player1, player2 FROM game_room WHERE id = $1', [roomNumber]);
  }
}

module.exports = Lobby;
