'use strict'
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        openid: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {})
    user.associate = function (models) {

    }
    return user
}
