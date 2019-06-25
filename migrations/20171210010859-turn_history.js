'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('turn_history', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        room_id: {
          type: Sequelize.INTEGER,
        },

        player: Sequelize.STRING,

        position: Sequelize.INTEGER,

      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('turn_history');
  }
};
