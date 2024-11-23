const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();
const models = require('../models');

router.route('/cart')
    .get(async (req, res) => {
        try {
            const Cid = req.query.Cid;

            if (!Cid) {
                return res.status(400).json({ message: "Customer ID is required." });
            }

            // Fetch cart info
            const cartItems = await models.Cart.findAll({
                where: { CustomerCid: Cid }, // Match Cid (state) to Cid (table)
                include: [{
                        model: models.Product,
                        attributes: ['Pid', 'Pname', 'Pprice'],
                    },
                    {
                    model: models.Customer,
                    attributes: ['Cname'], // Include customer name; aesthetics purpose
                    }           
                ]
                
            });

            // console.log('Cart Items:', JSON.stringify(cartItems, null, 2));

            if (cartItems.length === 0) {
                return res.status(404).json({ message: "No items found in the cart for this customer." });
            }

            // Formatting result
            const resultCart = cartItems.map(cartItem => {
                const product = cartItem.Product || {};
                const customer = cartItem.Customer || {};
                
                return {
                    Cname: customer.Cname,
                    Pid: product.Pid,
                    Pname: product.Pname,
                    Pprice: product.Pprice,
                    Quantity: cartItem.Quantity
                };
            });

            res.status(200).json({resultCart});

        } catch (error) {
            console.error('Error fetching cart details:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

module.exports = router;
