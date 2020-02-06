'use strict'
const bcrypt = require('bcrypt')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hash = await bcrypt.hash('linger-admin', 10)
        return queryInterface.bulkInsert('administrators', [{
            username: 'linger-admin',
            password: hash,
            nickname: 'Linger',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {})
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
}
