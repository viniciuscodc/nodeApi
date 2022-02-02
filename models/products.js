const Sequelize = require('sequelize')
const database = require('../database')

const Products = database.define('products', {
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    }
})

// Products.create({
//     title: 'the title',
//     content: 'the content'
// })

module.exports = Products;