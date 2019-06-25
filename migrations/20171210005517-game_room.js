'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('game_room', {
      id : {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      player1 : {
        type:Sequelize.STRING,
      },

      player2 : {
        type:Sequelize.STRING,
      },
    });

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('game_room');
  }

};
