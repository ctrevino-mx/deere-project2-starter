"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Accounts",
      [
        {
          name: "Father",
        },
        {
          name: "Mother",
        },
        {
          name: "Son",
        },
        {
          name: "Daughter",
        },
        {
          name: "Family",
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
