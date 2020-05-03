const { Sequelize, Model, DataTypes } = require('sequelize');

class User extends Model { }
User.init({
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, { modelName: 'user' });

exports.User = User;