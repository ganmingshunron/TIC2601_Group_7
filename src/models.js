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
        unique: true
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
        unique: true
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
        unique: true
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
        type: DataTypes.STRING(255),    //need to check again on how to do this
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

const Cart = sequelize.define('Cart',{},
    {
    freezeTableName: true
});

Customer.hasOne(Cart);
Cart.belongsTo(Customer);

Vendor.hasMany(Product);
Product.belongsTo(Vendor);

// sequelize.sync();

module.exports = { sequelize, Customer, Vendor, Product, Cart};
