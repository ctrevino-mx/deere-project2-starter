"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Subaccounts",
      [
        {
          description: "Education",
        },
        {
          description: "Entertainment",
        },
        {
          description: "Food",
        },
        {
          description: "Vacations",
        },
        {
          description: "Clothing",
        },
        {
          description: "Health Care",
        },
        {
          description: "Transportation",
        },
        {
          description: "Other necessities",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
