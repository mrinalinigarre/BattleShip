let db = require('../db');

class Game{

  constructor(){}

  getShipPositions(roomId, username){
    return db.any('SELECT ship_position, ship_type FROM ship_positions WHERE room_id = $1 and player = $2', [roomId, username]);
  }

  getShipName(roomId, username, position){
    return db.any('SELECT ship_type FROM ship_positions WHERE room_id = $1 and player = $2 and ship_position = $3', [roomId, username, position]);
  }

  deleteGameRoom(roomId){
    return db.any('DELETE FROM game_room WHERE id = $1', [roomId]);
  }

  deleteAllRooms(){
    return db.any('TRUNCATE game_room, ship_positions RESTART IDENTITY');
  }

  deleteShipPositions(roomId){
    return db.any('DELETE FROM ship_positions WHERE room_id = $1', [roomId]);
  }

}

module.exports = Game;
