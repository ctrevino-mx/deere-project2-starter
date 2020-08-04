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

// FILTER ROUTE - FILTER THE EXPENSES BASED ON DEFINED CRITERIA
// router.get("/filter/?", async (req, res) => {
router.get("/filter/:id/?", async (req, res) => {
  let isThereWhere = false;
  let query = "";
  console.log(
    "######################################################",
    req.params.id
  );
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
    'INNER JOIN "Statuses" ON ("Expenses"."statusId" = "Statuses"."id")' +
    'WHERE "Expenses"."userId" = ' +
    req.params.id;

  isThereWhere = true;
  if (req.query.accountId > 0) {
    if (isThereWhere) {
      query += ' AND "Expenses"."accountId" = ' + req.query.accountId;
    } else {
      query += ' WHERE "Expenses"."accountId" = ' + req.query.accountId;
      isThereWhere = true;
    }
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
  if (req.query.startDate && req.query.endDate) {
    if (isThereWhere) {
      query +=
        ' AND ("Expenses"."date" >= ' +
        "'" +
        req.query.startDate +
        "'" +
        ' AND "Expenses"."date" <= ' +
        "'" +
        req.query.endDate +
        "')";
    } else {
      query +=
        ' WHERE ("Expenses"."date" >= ' +
        "'" +
        req.query.startDate +
        "'" +
        ' AND "Expenses"."date" <= ' +
        "'" +
        req.query.endDate +
        "')";
      isThereWhere = true;
    }
  } else if (req.query.startDate) {
    if (isThereWhere) {
      query += ' AND "Expenses"."date" >= ' + "'" + req.query.startDate + "'";
    } else {
      query += ' WHERE "Expenses"."date" >= ' + "'" + req.query.startDate + "'";
      isThereWhere = true;
    }
  } else if (req.query.endDate) {
    if (isThereWhere) {
      query += ' AND "Expenses"."date" <= ' + "'" + req.query.endDate + "'";
    } else {
      query += ' WHERE "Expenses"."date" <= ' + "'" + req.query.endDate + "'";
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

  res.render("expenses/index.ejs", {
    expense: filteredExpenses,
    account: allAccounts,
    subaccount: allSubaccounts,
    paymentType: allPaymentTypes,
    status: allStatuses,
    currentAccountId: parseInt(req.query.accountId),
    currentSubaccountId: parseInt(req.query.subaccountId),
    currentPaymentTypeId: parseInt(req.query.paymentTypeId),
    currentStatusId: parseInt(req.query.statusId),
    currentStartDate: req.query.startDate,
    currentEndDate: req.query.endDate,
    currentUserId: req.params.id,
  });
});

// ADD THE ROUTES HERE
// INDEX ROUTE - GET ALL THE EXPENSES
router.get("/:id", async (req, res) => {
  const allExpenses = await ExpenseModel.findAll({
    where: { userId: req.params.id },
    include: [
      AccountModel,
      SubaccountModel,
      PaymentTypeModel,
      StatusModel,
      UserModel,
    ],
    order: [["date", "DESC"]],
  });
  //   const allExpenses = await ExpenseModel.findAll();
  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  console.log("ooooooooooo USER ID ooooooooooooo", req.params.id);
  console.log("ooooooooooo USER ID ooooooooooooo", allExpenses);
  console.log("=================================", allExpenses[0].accountId);
  console.log("==================", allExpenses[0].Account.description);
  console.log("==================", allExpenses[0].PaymentType.description);
  console.log("====================", allExpenses[0].Status.description);
  console.log("====================", allExpenses[0].User.username);

  res.render("expenses/index.ejs", {
    expense: allExpenses,
    account: allAccounts,
    subaccount: allSubaccounts,
    paymentType: allPaymentTypes,
    status: allStatuses,
    currentAccountId: 0,
    currentSubaccountId: 0,
    currentPaymentTypeId: 0,
    currentStatusId: 0,
    currentStartDate: "",
    currentEndDate: "",
    currentUserId: req.params.id,
  });
});

module.exports = router;
