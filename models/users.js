const Sequelize = require('sequelize')
const database = require('../database')

const Users = database.define('users', {
    name: {
        type: Sequelize.STRING
    },
    surname: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
})

// Users.create({
//     name: 'my name',
//     surname: 'my surname',
//     email: 'my email'
// })

module.exports = Users;