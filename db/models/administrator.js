'use strict'
module.exports = (sequelize, DataTypes) => {
    const administrator = sequelize.define('administrator', {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {})
    administrator.associate = function (models) {
        // associations can be defined here
    }
    return administrator
}
