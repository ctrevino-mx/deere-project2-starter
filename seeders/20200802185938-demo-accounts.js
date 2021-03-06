"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Accounts",
      [
        {
          description: "Family",
        },
        {
          description: "Father",
        },
        {
          description: "Mother",
        },
        {
          description: "Son",
        },
        {
          description: "Daughter",
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
