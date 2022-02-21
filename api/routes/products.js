const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const Product = require('../models/product')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    
    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'post request',
            createdProduct: result
        })
    }).catch(err => {
        console.log('t')
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const updateOps = { }
    console.log(req.body)
    for(const ops in req.body) {
        updateOps[ops] = req.body[ops]
    }
    console.log(updateOps)
    Product.updateOne({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: 'Product updated'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

// products/id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id).exec()
    .then(doc => {
        console.log(doc)
        if(doc){
            res.status(200).json(doc)
        } else {
            res.status(404).json({message: 'Not found'})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.delete('/:productId', checkAuth,  (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted'
        })
        console.log('Deleted: ' + result)    
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = router