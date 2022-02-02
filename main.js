const express = require('express');
const database = require('./database')
const Product = require('./models/products')
const Users = require('./models/users')
const app = express()

database.sync().then(() => console.log('db is ready'))

app.use(express.json())

app.listen(8081, function() {
    console.log('Server running on: http://localhost:8081')
})

app.post('/', async function(req, res) {
    Users.create(req.body).then(() => {
        res.send('User inserted')
    })
})

app.get('/', async function(req, res) {
    const products = await Users.findAll();

    res.send(products)
})



