const express = require('express');
const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const router = express.Router();
const models = require('../models');
const {sequelize, Customer, Vendor, Product, Cart, Transaction} = require('../models');


router.route('/')
    .get(async (req, res) => {
        try {
            const searchQuery = req.query.q || ''; // Default empty string
            const currentPage = parseInt(req.query.page) || 1;  // Default page 1
            const limit = parseInt(req.query.limit) || 8;  // Specify number of products per page, tally with HomeLayout
            const offset = (currentPage - 1) * limit; //Formula for skipping items

            const sortBy = req.query.sortBy || 'Pname'; // Default sort: product name
            const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';  // Default: ascending order

            // Fetch products from the database with settings
            const products = await models.Product.findAll({
                where: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('Pname')),
                    {
                        [Op.like]: `%${searchQuery.toLowerCase()}%` // Case-insensitive search
                    }
                ),
                include: [{
                    model: models.Vendor,
                    as: 'Vendor',
                    attributes: ['Vname'],
                }],
                limit: limit,
                offset: offset,
                order: [
                    [Sequelize.col(sortBy), sortOrder]
                ]
            });

            // Format data that was retrieved
            const updatedProducts = products.map(product => {
                const productData = product.toJSON();
                productData.Vname = productData.Vendor.Vname; 
                delete productData.Vendor; // Remove unnecessary data
                delete productData.VendorVid; // Remove unnecessary data

                return productData;
            });

            //Total no. products from search
            const totalProducts = await models.Product.count({
                where: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('Pname')),
                    {
                        [Op.like]: `%${searchQuery.toLowerCase()}%`
                    }
                )
            });

            // Calculate total no. pages for pagination
            const totalPages = Math.ceil(totalProducts / limit);

            // Send the response with the calculated data and info retrieved.
            res.json({
                items: updatedProducts,
                totalPages: totalPages,
                currentPage: currentPage,
                totalItems: totalProducts
            });

            console.log(`Retrieved ${totalProducts} products`);

        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
});

router.post("/login", async (req, res) => {
    const { Cid, Cpass } = req.body;
    console.log("Received: ",Cid,Cpass);

  try {
    const customer = await models.Customer.findOne({ where: { Cid } });

    if (!customer) {
      return res.status(401).json({ success: false, message: "Customer not found" });
    }

    // Compare the Cpass (req) with Cpass (db)
    if (customer.Cpass !== Cpass) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
  

router.post('/checkout', async (req, res) => {
    const { Cid, cartItems } = req.body;

    // Transaction: Ensure atomicity between stock update and cart clearing
    const t = await sequelize.transaction();

    try {
        // Calculate totalAmount based on info from cart
        let totalAmount = 0;
        for (const item of cartItems) {
            totalAmount += item.Pprice * item.Quantity; 
        }

        // Create new transaction entry
        const transaction = await models.Transaction.create({
            Tstatus: 'Completed',
            Tdate: new Date(),
            Tamount: totalAmount,
            CustomerCid: Cid
        }, { transaction: t });

        // Update product stock
        for (const item of cartItems) {
            const product = await models.Product.findByPk(item.Pid, { transaction: t });

            if (product) {
                console.log(product.Pstock)

                if (product.Pstock >= item.Quantity) {
                    product.Pstock -= item.Quantity;
                    await product.save({ transaction: t });
                    
                } else {
                    throw new Error(`Insufficient stock for product: ${product.Pname}`);
                }
            }
        }

        // Clear cart that belongs to customer
        await models.Cart.destroy({
            where: { CustomerCid: Cid },
            transaction: t
        });

        await t.commit();

        res.status(200).json({
            success: true,
            message: 'Transaction completed successfully!',
            transaction: transaction
        });

    } catch (error) {

        await t.rollback();
        console.error('Error processing transaction:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });

    }
});


router.post('/register', async (req, res) => {
    const { Cname, Cpass, Caddress, Cphone } = req.body;
    if (!Cname || !Cpass|| !Caddress || !Cphone) {
        return res.status(400).json({ success: false, message: 'Missing fields.' });
    }

    try {
        // Create new customer entry
        const newCustomer = await Customer.create({
            Cname,
            Cpass,
            Caddress,
            Cphone
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            customer: {
                Cid: newCustomer.Cid,
                Cname: newCustomer.Cname
            }
        });

    } catch (error) {
    
        console.error('Error processing registration:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
        
    }
    });



module.exports = router;