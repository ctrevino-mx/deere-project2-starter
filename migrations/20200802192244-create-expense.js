"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Expenses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "Pending expense description",
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      comment: {
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // name of table name
          key: "id", // key in Target model that we're referencing
        },
      },
      accountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Accounts", // name of table name
          key: "id", // key in Target model that we're referencing
        },
      },
      subaccountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Subaccounts", // name of table name
          key: "id", // key in Target model that we're referencing
        },
      },
      paymentTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "PaymentTypes", // name of table name
          key: "id", // key in Target model that we're referencing
        },
      },
      statusId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Statuses", // name of table name
          key: "id", // key in Target model that we're referencing
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Expenses");
  },
};
