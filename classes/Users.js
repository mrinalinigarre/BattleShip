let db = require('../db');
let bcrypt = require('bcrypt');
const saltRounds = 10;

class Users{

  constructor(){
  }

  register(username, password, email){

    return new Promise( (resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash){
        if(err){
          reject(err);
        }

        db.any('INSERT INTO users(username, password, email) VALUES($1, $2, $3)', [username, hash, email]);
        resolve('success');

      })

    })

  }

  login(username, password){

    return new Promise( (resolve,reject) => {

      this.validateUser(username)
        .then( result => {
           if(result === false){
             resolve(false);
             return;
           }

           this.isPasswordMatch(password, result[0].password, response => {
             resolve(response);
           })
        })

    })

  }

  isPasswordMatch(inputPassword, hashedPassword, cb){
    bcrypt.compare(inputPassword, hashedPassword, function(err, response){
      cb(response);
    })
  }

  validateUser(username){

    return new Promise( (resolve,reject) => {

      db.any('SELECT * FROM users WHERE username = $1', username)
        .then(result =>{
          if(result[0] === undefined){
            resolve(false);
            return;
          }

          resolve(result);
        })
    })
  }

  getProfile(username){
    return db.any('SELECT username, email, win, loss FROM users WHERE username = $1', [username]);
  }

  getWinLoss(username){
    return db.any('SELECT  win, loss FROM users WHERE username = $1', [username]);
  }

  addWin(username){
    return db.any('UPDATE users set win = win + 1 WHERE username = $1', [username]);
  }

  addLoss(username){
    return db.any('UPDATE users set loss = loss + 1 WHERE username = $1', [username]);
  }

  getName(username){
    return db.any('SELECT username FROM users WHERE username = $1', [username]);
  }

  createGuest(){

    while(loop){
      let loop = true;
      let guestName = 'guest';
      let randomNum = Math.floor( Math.random() * 10000);
      guestName += randomNum;

      this.getName(guestName).then(result=>{
        if( !(guestName === result[0].username) ){
          loop = false;
        }
      })
    }

    return guestName;
  }
}

module.exports = Users;


