'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ship_positions', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      room_id: {
        type: Sequelize.INTEGER,
      },

      player: Sequelize.STRING,

      ship_position: Sequelize.INTEGER,

      ship_type: Sequelize.STRING,

      hit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }

    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('ship_positions');
  }
};

