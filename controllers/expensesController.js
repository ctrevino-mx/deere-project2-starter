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
router.get("/filter/?", async (req, res) => {
  let whereClause = {};
  let isThereWhere = false;
  let query = "";

  // CREATE DINAMICALLY A QUERY BASED ON THE USER INPUTS
  // THESE INPUTS IMPACT THE WHERE CLAUSE
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
  });
});

// INDEX ROUTE - GET ALL THE EXPENSES
router.get("/", async (req, res) => {
  let query = "";

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

  const completeExpenses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

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
  });
});

//////////////////////////////////////////////////////////////////////////////////
// NEW ROUTE - SEND EMPTY FORM TO THE USER TO CREATE A NEW EXPENSE
// Get the last 10 expenses created for that specific user
// Get the info to populate the drop boxes
// Render the new form to create the expenses displaying the 5 last expenses
//////////////////////////////////////////////////////////////////////////////////
router.get("/new", async (req, res) => {
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
  });
});

// CREATE A NEW EXPENSE
// After creating the expense display renders the new page to keep creating expenses
router.post("/", (req, res) => {
  req.body.userId = req.user.id;
  ExpenseModel.create(req.body).then((newExpense) => {
    res.redirect("/expenses/new/");
  });
});

// EDIT ROUTE - DISPLAY THE FORM TO EDIT A EXPENSE
router.get("/:id/page/:pagename/edit", async (req, res) => {
  const allAccounts = await AccountModel.findAll();
  const allSubaccounts = await SubaccountModel.findAll();
  const allPaymentTypes = await PaymentTypeModel.findAll();
  const allStatuses = await StatusModel.findAll();

  ExpenseModel.findByPk(req.params.id).then((foundExpense) => {
    res.render("expenses/edit.ejs", {
      expense: foundExpense,
      account: allAccounts,
      subaccount: allSubaccounts,
      paymentType: allPaymentTypes,
      status: allStatuses,
      triggerPage: req.params.pagename,
    });
  });
});

// PUT ROUTE - UPDATE THE SPECIFIC EXPENSE
router.put("/:id/page/:pagename", (req, res) => {
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
  ExpenseModel.destroy({ where: { id: req.params.id } }).then(() => {
    if (req.params.pagename === "display") {
      res.redirect("/expenses/");
    }
    if (req.params.pagename === "new") {
      res.redirect("/expenses/new/");
    }
  });
});

// BOARD ROUTE - SELECT THE INFORMATION FOR THE GRAPH AND RENDER
router.get("/board", (req, res) => {
  const dataOption = [
    [1, "Account"],
    [2, "Subaccount"],
    [3, "Payment Type"],
    [4, "Status"],
  ];
  let graphType = "";
  // RENDERING THE EMPTY FORM TO CONFIGURE GRAPH
  res.render("expenses/graph.ejs", {
    dataOption: dataOption,
    dataSeries: [],
    graphType: "",
  });
});

// GRAPH ROUTE - SELECT THE INFORMATION FOR THE GRAPH AND RENDER
router.get("/graph", async (req, res) => {
  let query = "";
  let groupBy = "";
  let orderBy = "";
  let graphData = [];
  let dataElement = [];
  let graphType = "Pie";
  const dataOption = [
    [1, "Account"],
    [2, "Subaccount"],
    [3, "Payment Type"],
    [4, "Status"],
  ];

  // CREATE DINAMICALLY THE QUERY BASED ON USER SELECTIONS
  query =
    'SELECT SUM("Expenses"."amount") AS "totalAmount",' + '"Expenses"."userId"';
  groupBy = 'GROUP BY "Expenses"."userId"';

  if (parseInt(req.query.optionId) === 1) {
    query +=
      ',"Expenses"."accountId", "Accounts"."description" AS "description"';
    groupBy += ', "Expenses"."accountId", "Accounts"."description"';
    orderBy = ' ORDER BY "Accounts"."description" ASC';
  }
  if (parseInt(req.query.optionId) === 2) {
    query +=
      ',"Expenses"."subaccountId", "Subaccounts"."description" AS "description"';
    groupBy += ', "Expenses"."subaccountId", "Subaccounts"."description"';
    orderBy = ' ORDER BY "Subaccounts"."description" ASC';
  }
  if (parseInt(req.query.optionId) === 3) {
    query +=
      ',"Expenses"."paymentTypeId", "PaymentTypes"."description" AS "description"';
    groupBy += ', "Expenses"."paymentTypeId", "PaymentTypes"."description"';
    orderBy = ' ORDER BY "PaymentTypes"."description" ASC';
  }
  if (parseInt(req.query.optionId) === 4) {
    query +=
      ',"Expenses"."statusId", "Statuses"."description" AS "description"';
    groupBy += ', "Expenses"."statusId", "Statuses"."description"';
    orderBy = ' ORDER BY "Statuses"."description" ASC';
  }
  if (parseInt(req.query.optionId) === 0) {
    query += ',"Expenses"."date" AS "description"';
    groupBy += ', "Expenses"."date"';
    orderBy = ' ORDER BY "Expenses"."date" ASC';
    graphType = "Line";
  }

  query +=
    ' FROM "Expenses" ' +
    'INNER JOIN "Users" ON ("Expenses"."userId" = "Users"."id") ' +
    'INNER JOIN "Accounts" ON ("Expenses"."accountId" = "Accounts"."id") ' +
    'INNER JOIN "Subaccounts" ON ("Expenses"."subaccountId" = "Subaccounts"."id") ' +
    'INNER JOIN "PaymentTypes" ON ("Expenses"."paymentTypeId" = "PaymentTypes"."id") ' +
    'INNER JOIN "Statuses" ON ("Expenses"."statusId" = "Statuses"."id") ' +
    'WHERE "Expenses"."userId" = ' +
    req.user.id;

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

  query += " " + groupBy;
  query += " " + orderBy;

  // EXECUTING THE QUERY DINAMICALLY BUILD
  const filteredExpenses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  // PROCESS TO CONVERT THE DATA OBJECT INTO A TABLE
  // Adding headers
  dataElement[0] = "Concept";
  dataElement[1] = "Amount";
  graphData.push(dataElement);
  dataElement = [];
  // Adding rows
  filteredExpenses.forEach((item) => {
    dataElement[0] = item.description;
    dataElement[1] = parseInt(item.totalAmount);
    graphData.push(dataElement);
    dataElement = [];
  });
  // Rendering graph.ejs with the data table, options to populate drop box and type of graph
  res.render("expenses/graph.ejs", {
    dataOption: dataOption,
    dataSeries: graphData,
    graphType: graphType,
  });
});

module.exports = router;
