const models = require('./models');

async function loadData(){
    models.Customer.findByPk(1).then((cust1)=>{
        if(cust1 === null){
            Promise.all([
                models.Customer.create({Cid:1, Cname:'Alice Wonderland',Caddress:'123 Clementi Ave 3 S123123',Cphone:'98911122',Cpass:'Alice123!'}),
                models.Customer.create({Cid:2, Cname:'Bob The Builder',Caddress:'234 Dover Rd 6 S123234',Cphone:'89126394',Cpass:'Bob567#'}),
                models.Customer.create({Cid:3, Cname:'Cat In A Hat',Caddress:'32 Yishun St 21 S750032',Cphone:'97642369',Cpass:'Cat911$'}),
                
            ])
            
            
            Promise.all([
                models.Vendor.create({Vid:1 , Vname:'Alexandra Knits',Vaddress:'625 Alexandra Rd S529612', Vdesc:'Alexendra Knits is a store that provides locally knitted apparel!'}),
                models.Vendor.create({Vid:2 , Vname:'Belatrix Wands',Vaddress:'728 Woodlands Circle S730728', Vdesc:'Belatrix Wands provides a wide variety of wands for people of all ages!'}),
                models.Vendor.create({Vid:3 , Vname:'Caving Experts',Vaddress:'1 Ang Mo Kio Dr 7 S001001', Vdesc:'Caving Experts is a one-stop shop for all your caving needs!'}),
                models.Product.create({Pid: 1, Pname: 'Red Knitted Sweater', Pdesc:'Red Knitted Sweater for all humans', Pcat: 'Apparel', Pimg: ' ', Pprice:12.34, Pstock: 7}),
                models.Product.create({Pid: 2, Pname: 'Elder Wand', Pdesc:'Wand made for elders', Pcat: 'Apparel', Pimg: ' ', Pprice:31.74, Pstock: 5}),
                models.Product.create({Pid: 3, Pname: 'Diving Suit', Pdesc:'Suit for diving', Pcat: 'Apparel', Pimg: ' ', Pprice:250.42, Pstock: 10}),
            ]).then((valArray)=>{
                vendor1 = valArray[0];
                vendor2 = valArray[1];
                vendor3 = valArray[2];
                product1 = valArray[3];
                product2 = valArray[4];
                product3 = valArray[5];
                product1.setVendor(vendor1);
                product2.setVendor(vendor2);
                product3.setVendor(vendor3);
                })
            }
    })
}

models.sequelize.sync().then(() => {
    console.log('models loaded');

    loadData().then(() => {
        console.log('test data loaded...');
    });
})