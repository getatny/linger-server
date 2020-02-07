const database= require('../../../db/models')
const admin = database.administrator

const model = {
    findAdminById(userId) {
        return admin.findOne({ where: { id: userId } })
    },
    findAdminByUsername(username) {
        return admin.findOne({ where: { username } })
    },
    getAdmins(page, pageSize) {
        return admin.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt ASC')
        })
    }
}

module.exports = model
