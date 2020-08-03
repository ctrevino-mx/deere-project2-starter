const express = require("express");
const { sequelize } = require("../models");
const router = express.Router();
const { QueryTypes } = require("sequelize");

// Adding the required models
const ExpenseModel = require("../models").Expense;
const UserModel = require("../models").User;
const AccountModel = require("../models").Account;
const SubaccountModel = require("../models").Subaccount;
const PaymentTypeModel = require("../models").PaymentType;
const StatusModel = require("../models").Status;

// ADD THE ROUTES HERE
// INDEX ROUTE - GET ALL THE EXPENSES
router.get("/", async (req, res) => {
  const allExpenses = await ExpenseModel.findAll();
  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  res.render("expenses/index.ejs", {
    expense: allExpenses,
    account: allAccounts,
    subaccount: allSubaccounts,
    paymentType: allPaymentTypes,
    status: allStatuses,
  });
});

// FILTER ROUTE - FILTER THE EXPENSES BASED ON DEFINED CRITERIA
router.get("/filter/?", async (req, res) => {
  let isThereWhere = false;
  let query = "";
  query =
    'SELECT "Expenses"."id", "Expenses"."date","Expenses"."description","Expenses"."amount",' +
    '"Expenses"."comment",' +
    '"Expenses"."accountId", "Accounts"."description" AS "accountDescription",' +
    '"Expenses"."subaccountId", "Subaccounts"."description" AS "subaccountDescription",' +
    '"Expenses"."paymentTypeId", "PaymentTypes"."description" AS "paymentTypeDescription",' +
    '"Expenses"."statusId", "Statuses"."description" AS "statusDescription"' +
    'FROM "Expenses" ' +
    'INNER JOIN "Accounts" ON ("Expenses"."accountId" = "Accounts"."id")' +
    'INNER JOIN "Subaccounts" ON ("Expenses"."subaccountId" = "Subaccounts"."id")' +
    'INNER JOIN "PaymentTypes" ON ("Expenses"."paymentTypeId" = "PaymentTypes"."id")' +
    'INNER JOIN "Statuses" ON ("Expenses"."statusId" = "Statuses"."id")';

  if (req.query.accountId > 0) {
    query += ' WHERE "Expenses"."accountId" = ' + req.query.accountId;
    isThereWhere = true;
  }
  if (req.query.subaccountId > 0) {
    if (isThereWhere) {
      query += ' AND "Expenses"."subaccountId" = ' + req.query.subaccountId;
    } else {
      query += ' WHERE "Expenses"."subaccountId" = ' + req.query.subaccountId;
      isThereWhere = true;
    }
  }
  if (req.query.paymentTypeId > 0) {
    if (isThereWhere) {
      query += ' AND "Expenses"."paymentTypeId" = ' + req.query.paymentTypeId;
    } else {
      query += ' WHERE "Expenses"."paymentTypeId" = ' + req.query.paymentTypeId;
      isThereWhere = true;
    }
  }
  if (req.query.statusId > 0) {
    if (isThereWhere) {
      query += ' AND "Expenses"."statusId" = ' + req.query.statusId;
    } else {
      query += ' WHERE "Expenses"."statusId" = ' + req.query.statusId;
      isThereWhere = true;
    }
  }

  query += ' ORDER BY "Expenses"."date" DESC';

  console.log(
    "====================== Hello there ========================",
    query
  );
  const filteredExpenses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  //   console.log(filteredExpenses);

  res.render("expenses/index.ejs", {
    expense: filteredExpenses,
    account: allAccounts,
    subaccount: allSubaccounts,
    paymentType: allPaymentTypes,
    status: allStatuses,
  });
});

module.exports = router;
