"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Statuses",
      [
        {
          description: "Complete",
          fontColor: "#000000",
          backgroundColor: "#F4F4F4",
        },
        {
          description: "Pending",
          fontColor: "#FFFFFF",
          backgroundColor: "#FF2600",
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
