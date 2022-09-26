'use strict';

import { v4 as uuidV4 } from 'uuid';
import bCrypt from 'bcryptjs';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Bidder', 'Driver'),
    status: DataTypes.ENUM('Active', 'Inactive'),
    isVerified: DataTypes.BOOLEAN,
    picture: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    freezeTableName: true
  });

  //  Before the Records will be created, let's d the following.
  User.beforeCreate((user) => {
    user.id = uuidV4();
  });
  User.beforeCreate((user) => {
    user.password = bCrypt.hashSync(user.password, 10);
  });
  User.beforeUpdate((user) => {
    user.password = bCrypt.hashSync(user.password, 10);
  });

  //  After the record is persisted and before the persisted data are returned, let's remove the "password".
  User.afterCreate((user) => {
    delete user.dataValues.password
  });
  return User;
};