"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "PaymentTypes",
      [
        {
          description: "Cash",
        },
        {
          description: "Credit card",
        },
        {
          description: "Bank transfer",
        },
        {
          description: "Prepaid card",
        },
        {
          description: "Other",
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
