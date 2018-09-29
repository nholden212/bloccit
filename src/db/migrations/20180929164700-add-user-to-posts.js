'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Posts",
      "userId",
      {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Posts", "userId");
  }
};
