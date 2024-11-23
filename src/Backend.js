const express = require('express');
const cors = require('cors')
const app = express();
const { Product, Vendor, Customer, Cart, Transaction} = require('./models');

const port = 3001;

const dataInit = require('./dataInit');

app.use(cors())
app.use(express.json())

const home = require('./scripts/home');
const cart = require('./scripts/cart');

app.use('/', home);
app.use('/', cart);

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Vendor,
                attributes: ['Vid', 'Vname', 'Vdesc']
            }]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = await Product.create({
            Pid: req.body.Pid,
            Pname: req.body.Pname,
            Pdesc: req.body.Pdesc,
            Pcat: req.body.Pcat,
            Pimg: req.body.Pimg || '',
            Pprice: req.body.Pprice,
            Pstock: req.body.Pstock
        });
        
        if (req.body.VendorId) {
            const vendor = await Vendor.findByPk(req.body.VendorId);
            if (vendor) {
                await newProduct.setVendor(vendor);
            }
        }
        
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Vendor,
                attributes: ['Vid', 'Vname', 'Vdesc']
            }]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vendor Routes
app.get('/api/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            include: [{
                model: Product,
                attributes: ['Pid', 'Pname', 'Pprice']
            }]
        });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vendors', async (req, res) => {
    try {
        const newVendor = await Vendor.create({
            Vid: req.body.Vid,
            Vname: req.body.Vname,
            Vdesc: req.body.Vdesc,
            Vaddress: req.body.Vaddress
        });
        res.json(newVendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vendors/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['Pid', 'Pname', 'Pprice']
            }]
        });
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Customer Routes
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.findAll({
            attributes: ['Cid', 'Cname', 'Cphone', 'Caddress']
        });
        res.json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const newCustomer = await Customer.create({
            Cname: req.body.Cname,
            Cemail: req.body.Cemail,
            Cphone: req.body.Cphone,
            Caddress: req.body.Caddress
        });
        res.json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{
                model: Cart,
                include: [Product]
            }]
        });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add sample customer data route (for testing)
app.post('/api/customers/init', async (req, res) => {
    try {
        const sampleCustomers = [
            {
                Cid: 1,
                Cname: "John Doe",
                Cphone: "12345678",
                Caddress: "123 Main St",
                Cpass: "password123"
            },
            {
                Cid: 2,
                Cname: "Jane Smith",
                Cphone: "87654321",
                Caddress: "456 Oak Ave",
                Cpass: "password456"
            }
        ];

        await Customer.bulkCreate(sampleCustomers);
        res.json({ message: 'Sample customers created successfully' });
    } catch (err) {
        console.error('Error creating sample customers:', err);
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, function(){
    console.log(`Express app listening on port ${port}!`);
});