const { Sequelize, DataTypes } = require ('sequelize');

const sequelize = new Sequelize(
    '','','',
    {
        dialect: 'sqlite',
        storage: './db/database.db',
        logging: false
    }
);

const Customer = sequelize.define('Customer', {

    Cid:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    Cname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Caddress:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Cphone:{
        type: DataTypes.STRING(8),
        allowNull: false
    },
    Cpass:{
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {
    freezeTableName: true
});

const Vendor = sequelize.define('Vendor',{
    Vid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },

    Vname:{
        type: DataTypes.STRING(100),
        allowNull: false
    },

    Vdesc:{
        type: DataTypes.TEXT,
        allowNull: false
    },

    Vaddress:{
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    freezeTableName: true
});

const Product = sequelize.define('Product',{
    Pid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },

    Pname:{
        type: DataTypes.STRING(100),
        allowNull: false
    },

    Pdesc:{
        type: DataTypes.TEXT,
        allowNull: false
    },

    Pcat:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    Pimg:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    Pprice:{
        type: DataTypes.REAL,
        allowNull: false,
        validate:{
            isGreaterThanZero(value){
                if (parseInt(value)<=0){
                    throw new Error('Pprice must be greater than zero.');
                }
            }
        }
    },

    Pstock:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNotNegative(value){
                if (parseInt(value)<0){
                    throw new Error('Pstock cannot be negative.');
                }
            }
        }
    },

}, {
    freezeTableName: true
});

const Cart = sequelize.define('Cart',{
    Quantity:{
        type:DataTypes.INTEGER,
        allowNull: false
    }
},
    {
    freezeTableName: true
});

const Transaction = sequelize.define('Transaction',{
    Tid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },

    Tstatus:{
        type: DataTypes.STRING(20),
        allowNull: false
    },

    Tdate:{
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            customValidator(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("Date is in the future!");
                }
            }
        }
    },

    Tamount:{
        type: DataTypes.REAL
    }
},{
    freezeTableName: true
});

const Logistics = sequelize.define('Logistics',{
    Lid:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true
    },

    LshipmentDate:{
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            customValidator(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("Date is in the future!");
                }
            }
        }
    },

    Courier:{
        type: DataTypes.STRING(50),
        allowNull: false
    },

    DeliveryStatus:{
        type: DataTypes.STRING(20),
        allowNull: false
    }

},{
    freezeTableName: true
});



Customer.hasOne(Cart);
Cart.belongsTo(Customer);

Cart.belongsTo(Product, { foreignKey: 'ProductPid' });
Product.hasMany(Cart, { foreignKey: 'ProductPid' });

Transaction.hasOne(Customer);

Vendor.hasMany(Product);
Product.belongsTo(Vendor);

Logistics.belongsTo(Vendor, {foreignKey: 'DeliverFrom'})
Logistics.belongsTo(Customer, {foreignKey: 'DeliverTo'})

// sequelize.sync();

module.exports = { sequelize, Customer, Vendor, Product, Cart, Transaction, Logistics};
