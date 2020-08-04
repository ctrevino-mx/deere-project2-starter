"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subaccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subaccount.hasMany(models.Expense, { foreignKey: "subaccountId" });
    }
  }
  Subaccount.init(
    {
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Subaccount",
    }
  );
  return Subaccount;
};
