'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
      },

      win: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      loss: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('users');

  }
};

