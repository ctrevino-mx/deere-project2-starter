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
const Op = require("../models").Sequelize.Op;

// FILTER ROUTE - FILTER THE EXPENSES BASED ON DEFINED CRITERIA
// router.get("/filter/?", async (req, res) => {
router.get("/filter/?", async (req, res) => {
  let whereClause = {};
  let isThereWhere = false;
  let query = "";
  console.log(
    "###################### HITTING FILTER ################################",
    req.user.id
  );

  query =
    'SELECT "Expenses"."id", "Expenses"."date","Expenses"."description","Expenses"."amount",' +
    '"Expenses"."comment","Expenses"."userId",' +
    '"Expenses"."accountId", "Accounts"."description" AS "accountDescription",' +
    '"Expenses"."subaccountId", "Subaccounts"."description" AS "subaccountDescription",' +
    '"Expenses"."paymentTypeId", "PaymentTypes"."description" AS "paymentTypeDescription",' +
    '"Expenses"."statusId", "Statuses"."description" AS "statusDescription"' +
    'FROM "Expenses" ' +
    'INNER JOIN "Users" ON ("Expenses"."userId" = "Users"."id")' +
    'INNER JOIN "Accounts" ON ("Expenses"."accountId" = "Accounts"."id")' +
    'INNER JOIN "Subaccounts" ON ("Expenses"."subaccountId" = "Subaccounts"."id")' +
    'INNER JOIN "PaymentTypes" ON ("Expenses"."paymentTypeId" = "PaymentTypes"."id")' +
    'INNER JOIN "Statuses" ON ("Expenses"."statusId" = "Statuses"."id")' +
    'WHERE "Expenses"."userId" = ' +
    req.user.id;

  isThereWhere = true;
  if (req.query.accountId > 0) {
    query += ' AND "Expenses"."accountId" = ' + req.query.accountId;
  }

  if (req.query.subaccountId > 0) {
    query += ' AND "Expenses"."subaccountId" = ' + req.query.subaccountId;
  }

  if (req.query.paymentTypeId > 0) {
    query += ' AND "Expenses"."paymentTypeId" = ' + req.query.paymentTypeId;
  }
  if (req.query.statusId > 0) {
    query += ' AND "Expenses"."statusId" = ' + req.query.statusId;
  }
  if (req.query.startDate && req.query.endDate) {
    query +=
      ' AND ("Expenses"."date" >= ' +
      "'" +
      req.query.startDate +
      "'" +
      ' AND "Expenses"."date" <= ' +
      "'" +
      req.query.endDate +
      "')";
  } else if (req.query.startDate) {
    query += ' AND "Expenses"."date" >= ' + "'" + req.query.startDate + "'";
  } else if (req.query.endDate) {
    query += ' AND "Expenses"."date" <= ' + "'" + req.query.endDate + "'";
  }

  query += ' ORDER BY "Expenses"."date" DESC, "Expenses"."id" DESC';

  console.log(
    "====================== Hello there ========================",
    query
  );

  const filteredExpenses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  console.log(
    "====================== FILTERED EXPENSES ===============================",
    filteredExpenses
  );

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
    // currentUserId: req.user.id,
  });
});

// ADD THE ROUTES HERE
// INDEX ROUTE - GET ALL THE EXPENSES
router.get("/", async (req, res) => {
  let query = "";
  console.log(
    "###################### HITTING GET/ID ################################",
    req.user.id
  );

  query =
    'SELECT "Expenses"."id", "Expenses"."date","Expenses"."description","Expenses"."amount",' +
    '"Expenses"."comment","Expenses"."userId",' +
    '"Expenses"."accountId", "Accounts"."description" AS "accountDescription",' +
    '"Expenses"."subaccountId", "Subaccounts"."description" AS "subaccountDescription",' +
    '"Expenses"."paymentTypeId", "PaymentTypes"."description" AS "paymentTypeDescription",' +
    '"Expenses"."statusId", "Statuses"."description" AS "statusDescription"' +
    'FROM "Expenses" ' +
    'INNER JOIN "Users" ON ("Expenses"."userId" = "Users"."id")' +
    'INNER JOIN "Accounts" ON ("Expenses"."accountId" = "Accounts"."id")' +
    'INNER JOIN "Subaccounts" ON ("Expenses"."subaccountId" = "Subaccounts"."id")' +
    'INNER JOIN "PaymentTypes" ON ("Expenses"."paymentTypeId" = "PaymentTypes"."id")' +
    'INNER JOIN "Statuses" ON ("Expenses"."statusId" = "Statuses"."id")' +
    'WHERE "Expenses"."userId" = ' +
    req.user.id;
  query += ' ORDER BY "Expenses"."date" DESC, "Expenses"."id" DESC';
  console.log("======================== QUERY ========================", query);
  const completeExpenses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  console.log(
    "======================== FILTERED EXPENSES ========================",
    completeExpenses
  );

  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  res.render("expenses/index.ejs", {
    expense: completeExpenses,
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
    // currentUserId: req.user.id,
  });
});

//////////////////////////////////////////////////////////////////////////////////
// NEW ROUTE - SEND EMPTY FORM TO THE USER TO CREATE A NEW EXPENSE
// Get the last 5 expenses created for that specific user
// Get the info to populate the drop boxes
// Render the new form to create the expenses displaying the 5 last expenses
//////////////////////////////////////////////////////////////////////////////////
router.get("/new", async (req, res) => {
  console.log(
    "###################### HITTING NEW/ID ################################",
    req.user.id
  );

  const todayExpenses = await ExpenseModel.findAll({
    where: {
      userId: req.user.id,
    },
    limit: 10,
    include: [
      AccountModel,
      SubaccountModel,
      PaymentTypeModel,
      StatusModel,
      UserModel,
    ],
    order: [
      ["date", "DESC"],
      ["id", "DESC"],
    ],
  });

  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  res.render("expenses/new.ejs", {
    expense: todayExpenses,
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
    // currentUserId: req.user.id,
  });
});

// CREATE A NEW EXPENSE
// After creating the expense display renders the new page to keep creating expenses
router.post("/", (req, res) => {
  console.log(
    "###################### HITTING POST/ID ################################",
    req.user.id
  );
  req.body.userId = req.user.id;
  ExpenseModel.create(req.body).then((newExpense) => {
    res.redirect("/expenses/new/");
  });
});

// EDIT ROUTE
// router.get("/:id/user/:userid/page/:pagename/edit", async (req, res) => {
router.get("/:id/page/:pagename/edit", async (req, res) => {
  console.log(
    "###################### HITTING GET/ID/EDIT ################################",
    req.params.id,
    // req.params.userid,
    req.params.pagename,
    req.user.id
  );
  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  ExpenseModel.findByPk(req.params.id).then((foundExpense) => {
    res.render("expenses/edit.ejs", {
      expense: foundExpense,
      // currentUserId: 0,
      account: allAccounts,
      subaccount: allSubaccounts,
      paymentType: allPaymentTypes,
      status: allStatuses,
      // currentUserId: req.params.userid,
      // currentUserId: req.user.id,
      triggerPage: req.params.pagename,
    });
  });
});

// PUT ROUTE - UPDATE THE SPECIFIC EXPENSE
// router.put("/:id/page/:pagename/user/:userid", (req, res) => {
router.put("/:id/page/:pagename", (req, res) => {
  console.log(
    "###################### HITTING PUT/ID ################################",
    req.params.id,
    req.params.pagename,
    req.user.userid
  );

  ExpenseModel.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  }).then((updatedExpense) => {
    if (req.params.pagename === "index") {
      res.redirect("/expenses/");
    }
    if (req.params.pagename === "new") {
      res.redirect("/expenses/new/");
    }
  });
});

// DELETE ROUTE - DELETE AN EXPENSE
router.delete("/:id/page/:pagename", (req, res) => {
  console.log(
    "###################### HITTING DELETE ################################",
    req.params.pagename,
    req.user.id
  );
  ExpenseModel.destroy({ where: { id: req.params.id } }).then(() => {
    if (req.params.pagename === "display") {
      res.redirect("/expenses/");
    }
    if (req.params.pagename === "new") {
      res.redirect("/expenses/new/");
    }
  });
});

// GRAPH ROUTE - DELETE AN EXPENSE
router.get("/graph", (req, res) => {
  console.log(
    "###################### HITTING GRAPH ################################",
    req.user.userid
  );
  myData = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];
  console.log(myData);
  res.render("expenses/graph.ejs", {
    dataSeries: myData,
  });
});

module.exports = router;
