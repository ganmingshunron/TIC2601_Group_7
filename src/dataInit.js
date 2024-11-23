const models = require('./models');

/* Function to delete current DB and load new data*/
async function loadData(){
    models.Customer.findByPk(1).then((cust1)=>{

        if(cust1 !== null){ /*Delete existing data*/
            const modelsToTruncate = Object.values(models);

            Promise.all(
                modelsToTruncate.map((model) => {
                    if (model.truncate) {
                        return model.truncate({ cascade: true, restartIdentity: true })
                            .then(() => console.log(`All data from ${model.name} deleted`))
                            .catch((error) => console.error(`Error truncating ${model.name}:`, error));
                    }
                })
            ).then(() => {
                console.log('Data from all tables have been deleted');
                return populateData();
            }).catch((error) => {
                console.error('Error during truncating tables:', error);
            });
        }
        else{
            populateData();
        }
    })
}

/* Initialise all data */
function populateData(){
    console.log('Creating new database...')

            Promise.all([
                models.Customer.create({Cid:1, Cname:'Alice Wonderland',Caddress:'123 Clementi Ave 3 S123123',Cphone:'98911122',Cpass:'Alice123!'}),
                models.Customer.create({Cid:2, Cname:'Bob The Builder',Caddress:'234 Dover Rd 6 S123234',Cphone:'89126394',Cpass:'Bob567#'}),
                models.Customer.create({Cid:3, Cname:'Cat In A Hat',Caddress:'32 Yishun St 21 S750032',Cphone:'97642369',Cpass:'Cat911$'})
            ])
            
            Promise.all([
                models.Vendor.create({Vid:1 , Vname:'Alexandra Knits',Vaddress:'625 Alexandra Rd S529612', Vdesc:'Alexendra Knits is a store that provides locally knitted apparel!'}),
                models.Vendor.create({Vid:2 , Vname:'Belatrix Wands',Vaddress:'728 Woodlands Circle S730728', Vdesc:'Belatrix Wands provides a wide variety of wands for people of all ages!'}),
                models.Vendor.create({Vid:3 , Vname:'Caving Experts',Vaddress:'1 Ang Mo Kio Dr 7 S001001', Vdesc:'Caving Experts is a one-stop shop for all your caving needs!'}),
                models.Vendor.create({Vid:4 , Vname:'Disease Centre',Vaddress:'63 Bukit Batok Avenue 2 S420201', Vdesc:'Disease Centre provides all cures for all diseases'}),
                models.Vendor.create({Vid:5 , Vname:'Elephant Party',Vaddress:'7 Goodwill Rd S213007', Vdesc:"Elephant Party is not about elephants. It's about parties"}),
                models.Product.create({Pid: 1, Pname: 'Red Knitted Sweater', Pdesc:'Red Knitted Sweater for all humans', Pcat: 'Apparel', Pimg: './imgs/redsweater.jpg', Pprice:12.34, Pstock: 7}),
                models.Product.create({Pid: 2, Pname: 'Elder Wand', Pdesc:'Wand made for elders', Pcat: 'Apparel', Pimg: './imgs/elderwand.png', Pprice:200.74, Pstock: 8}),
                models.Product.create({Pid: 3, Pname: 'Diving Suit', Pdesc:'Suit for diving', Pcat: 'Apparel', Pimg: './imgs/divingsuit.jpg', Pprice:250.42, Pstock: 10}),
                models.Product.create({Pid: 4, Pname: 'Blue Knitted Sweater', Pdesc:'Blue Knitted Sweater for all humans', Pcat: 'Apparel', Pimg: './imgs/bluesweater.jpg', Pprice:20.34, Pstock: 10}),
                models.Product.create({Pid: 5, Pname: 'Diving Mask', Pdesc:'Mask for diving', Pcat: 'Apparel', Pimg: './imgs/divingmask.jpg', Pprice:100.21, Pstock: 8}),
                models.Product.create({Pid: 6, Pname: 'Green Knitted Sweater', Pdesc:'Blue Knitted Sweater for all humans', Pcat: 'Apparel', Pimg: './imgs/greensweater.jpg', Pprice:38.34, Pstock: 10}),
                models.Product.create({Pid: 7, Pname: "Harry's Wand", Pdesc:'Wand made for Harry', Pcat: 'Apparel', Pimg: './imgs/harryswand.jpg', Pprice:16.86, Pstock: 10}),
                models.Product.create({Pid: 8, Pname: "Hermione's Wand", Pdesc:'Wand made for Her', Pcat: 'Apparel', Pimg: './imgs/hermionewand.png', Pprice:37.99, Pstock: 10}),
                models.Product.create({Pid: 9, Pname: "Hagrids' Wand", Pdesc:'Wand made for Giant', Pcat: 'Apparel', Pimg: './imgs/hagridswand.jpg', Pprice:69.96, Pstock: 3}),
                models.Product.create({Pid: 10, Pname: "Panadol", Pdesc:'Quick fever solution', Pcat: 'Healthcare', Pimg: './imgs/panadol.jpg', Pprice:1.99, Pstock: 99}),
                models.Product.create({Pid: 11, Pname: "Tramadol", Pdesc:'Quick trauma solution', Pcat: 'Healthcare', Pimg: './imgs/tramadol.jpg', Pprice:29.99, Pstock: 2}),
                models.Product.create({Pid: 12, Pname: "Numbered Balloons", Pdesc:'Literally numbered balloons', Pcat: 'Party', Pimg: './imgs/numberballoon.jpg', Pprice:5.28, Pstock: 10}),
                models.Product.create({Pid: 13, Pname: "Long Balloons", Pdesc:'Balloons that are long', Pcat: 'Party', Pimg: './imgs/longballoon.jpg', Pprice:21.29, Pstock: 15}),
                models.Transaction.create({Tid: 1, Tstatus: 'Processing', Tdate:new Date('2024-11-12'), Tamount:(1*12.34)}),
                models.Transaction.create({Tid: 2, Tstatus: 'Processing', Tdate:new Date('2024-11-12'),Tamount:(2*31.74)}),
                models.Transaction.create({Tid: 3, Tstatus: 'Processing', Tdate:new Date('2024-11-13'),Tamount:(3*250.42)})
            
            ]).then((valArray)=>{
                vendor1 = valArray[0];
                vendor2 = valArray[1];
                vendor3 = valArray[2];
                vendor4 = valArray[3];
                vendor5 = valArray[4];
                product1 = valArray[5];
                product2 = valArray[6];
                product3 = valArray[7];
                product4 = valArray[8];
                product5 = valArray[9];
                product6 = valArray[10];
                product7 = valArray[11];
                product8 = valArray[12];
                product9 = valArray[13];
                product10 = valArray[14];
                product11 = valArray[15];
                product12 = valArray[16];
                product13 = valArray[17];

                product1.setVendor(vendor1);
                product2.setVendor(vendor2);
                product3.setVendor(vendor3);
                product4.setVendor(vendor1);
                product5.setVendor(vendor3);
                product6.setVendor(vendor1);
                product7.setVendor(vendor2);
                product8.setVendor(vendor2); 
                product9.setVendor(vendor2);
                product10.setVendor(vendor4);
                product11.setVendor(vendor4);
                product12.setVendor(vendor5);
                product13.setVendor(vendor5);

                models.Cart.create({CustomerCid:1, ProductPid: 1, Quantity: 1});
                models.Cart.create({CustomerCid:1, ProductPid: 2, Quantity: 1});
                models.Cart.create({CustomerCid:2, ProductPid: 2, Quantity: 2});
                models.Cart.create({CustomerCid:3, ProductPid: 3, Quantity: 3});
                models.Cart.create({CustomerCid:3, ProductPid: 2, Quantity: 2});

                models.Logistics.create({Lid: 1, LshipmentDate: new Date('2024-11-11'),Courier: 'NinjaVan', DeliveryStatus:'Pending Pick Up', DeliverFrom:1, DeliverTo:1}),
                models.Logistics.create({Lid: 2, LshipmentDate: new Date('2024-11-10'),Courier: 'Qexpress', DeliveryStatus:'Enroute', DeliverFrom:2, DeliverTo:2}),
                models.Logistics.create({Lid: 3, LshipmentDate: new Date('2024-11-9'),Courier: 'NinjaVan', DeliveryStatus:'Delivered', DeliverFrom:3, DeliverTo:3})

            })
    }

models.sequelize.sync().then(() => {
    console.log('models loaded');

    loadData().then(() => {
        console.log('test data loaded...');
    });
})