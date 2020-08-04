"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.Account, { foreignKey: "accountId" });
      Expense.belongsTo(models.Subaccount, { foreignKey: "subaccountId" });
      Expense.belongsTo(models.PaymentType, { foreignKey: "paymentTypeId" });
      Expense.belongsTo(models.Status, { foreignKey: "statusId" });
      Expense.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Expense.init(
    {
      date: DataTypes.DATE,
      description: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      comment: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      accountId: DataTypes.INTEGER,
      subaccountId: DataTypes.INTEGER,
      paymentTypeId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Expense",
    }
  );
  return Expense;
};
