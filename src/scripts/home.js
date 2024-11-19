const sqlite3 = require('sqlite3')

const express = require('express')
const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const router = express.Router()

const models = require('../models');

router.route('/')
    .get(async (req, res) => {
        try {
            console.log('GET: /home'); 
            const products = await models.Product.findAll({
                include: [{
                    model: models.Vendor,
                    as: 'Vendor',
                    attributes: ['Vname'],  // Only include the 'name' field from Vendor
                  }]
            });

            const updatedProducts = products.map(product => {
                const productData = product.toJSON(); // Convert to plain JSON object
                productData.Vname = productData.Vendor.Vname; // Add Vendor name to product data
                delete productData.Vendor; // Remove unnecessary data
                delete productData.VendorVid; // Remove unnecessary data

                return productData;
              });

            console.log(updatedProducts);
 
            res.send(updatedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    });

module.exports = router