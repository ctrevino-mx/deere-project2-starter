"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Expenses",
      [
        {
          date: "2020-07-15",
          description: "Restaurante meal",
          amount: 120.0,
          comment: "Red Lobster",
          userId: 1,
          accountId: 1,
          subaccountId: 2,
          paymentTypeId: 2,
          statusId: 1,
        },
        {
          date: "2020-07-16",
          description: "Cinema",
          amount: 20.0,
          comment: "",
          userId: 1,
          accountId: 3,
          subaccountId: 2,
          paymentTypeId: 1,
          statusId: 1,
        },
        {
          date: "2020-07-16",
          description: "Dentist",
          amount: 40.0,
          comment: "",
          userId: 1,
          accountId: 2,
          subaccountId: 6,
          paymentTypeId: 2,
          statusId: 1,
        },
        {
          date: "2020-07-20",
          description: "Taxes",
          amount: 150.0,
          comment: "",
          userId: 1,
          accountId: 1,
          subaccountId: 8,
          paymentTypeId: 3,
          statusId: 2,
        },
        {
          date: "2020-07-20",
          description: "Car wash",
          amount: 20.0,
          comment: "",
          userId: 1,
          accountId: 3,
          subaccountId: 8,
          paymentTypeId: 1,
          statusId: 1,
        },
        {
          date: "2020-07-20",
          description: "Tennis shoes",
          amount: 80.5,
          comment: "Amazon",
          userId: 1,
          accountId: 2,
          subaccountId: 5,
          paymentTypeId: 4,
          statusId: 1,
        },
        {
          date: "2020-07-31",
          description: "New laptop",
          amount: 500,
          comment: "Best Buy",
          userId: 1,
          accountId: 4,
          subaccountId: 1,
          paymentTypeId: 2,
          statusId: 1,
        },
        {
          date: "2020-08-01",
          description: "New smartphone",
          amount: 300.55,
          comment: "Best Buy",
          userId: 1,
          accountId: 3,
          subaccountId: 8,
          paymentTypeId: 2,
          statusId: 1,
        },
        {
          date: "2020-08-01",
          description: "Flight tickets",
          amount: 800.0,
          comment: "American Airlines",
          userId: 1,
          accountId: 1,
          subaccountId: 4,
          paymentTypeId: 2,
          statusId: 1,
        },
        {
          date: "2020-08-02",
          description: "Suitcases set",
          amount: 120.0,
          comment: "",
          userId: 1,
          accountId: 1,
          subaccountId: 4,
          paymentTypeId: 2,
          statusId: 2,
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
