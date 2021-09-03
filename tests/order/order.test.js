const Product = require("../../models/product")
const Category = require("../../models/category")
const User = require("../../models/user")
const {Order,ProductCart} = require("../../models/order")
const Card = require("../../models/paymentcards")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestOTestDB",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    },() => done());
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

describe('order test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";

    ///////////////////////Testing Create Order////////////////////////
    test("POST /api/order/create/:cardId/:userId", async () => {
    const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        });
        const product = await Product.create({ 
            name: "Iphone 12 Pro max", 
            description: "Iphone description",
            price :  130000,
            stock :  500,
            sold : 0,
            category : "612b813e0cc9fa8cb0f416f7"
        });
        const card = await Card.create({
            userId :"115560636549278411291",
            cardtype : "Credit",
            cardnumber : 123456789122,
            expirydate : "05/21" });

        const body = {
            order :  {
                products :[
                {
                    "_id":product._id,
                    "count":1,
                    "name":"Apple Iphone 12",
                    "description":"M1 Chip Overpriced thing",
                    "price":123456,
                    "category":"612b813e0cc9fa8cb0f416f7"
                }
                ],
                amount:71999,
                address : "Melbourne Opposite To Walmart streer 2012"
            },
            cvv : 124
        }    
        //const header = {'Authorization': `Bearer `+ token, 'Content-Type': 'application/json'}; 
        await supertest(app)
          .post("/api/order/create/" + card._id + "/" + user._id) 
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Order///////////////////////
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.products[0]._id).toBeTruthy();
            expect(response.body.products[0].count).toBe(body.order.products[0].count);
            expect(response.body.products[0].name).toBe(body.order.products[0].name);
            expect(response.body.products[0].price).toBe(body.order.products[0].price);
            expect(response.body.amount).toBe(body.order.amount);
            expect(response.body.address).toBe(body.order.address);
          })
    })

    test("GET /api/order/all/:userId", async ()=>{
        
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mg",
            lastname : "ji",
            email : "mgji391@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        
        const card = await Card.create({
              userId :"115560636549278411291",
              cardtype : "Credit",
              cardnumber : 123456789122,
              expirydate : "05/21"
         });

        const order = await Order.create({
            status: 'Processing',
            products: [  {
                "_id": "612b83af0cc9fa8cb0f41702",
                "count": 1,
                "name": "Apple Iphone 12",
                "price": 123456
            } ],
            amount: 71999,
            address: 'Melbourne Opposite To Walmart streer 2012',
            user: '115560636549278411291',
            cardId: card._id
          });

         await supertest(app)
          .get("/api/order/all/" + user._id) 
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Order///////////////////////
            // Check the response
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
          })
        
    })

    test("PUT /api/order/:orderId/status/:userId", async ()=>{
        
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mg",
            lastname : "ji",
            email : "mgji391@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        
        const card = await Card.create({
              userId :"115560636549278411291",
              cardtype : "Credit",
              cardnumber : 123456789122,
              expirydate : "05/21"
         });

        const order = await Order.create({
            status: 'Processing',
            products: [  {
                "_id": "612b83af0cc9fa8cb0f41702",
                "count": 1,
                "name": "Apple Iphone 12",
                "price": 123456
            } ],
            amount: 71999,
            address: 'Melbourne Opposite To Walmart streer 2012',
            user: '115560636549278411291',
            cardId: card._id
          });
          const body ={
            "status" : "Shipped"
        }

         await supertest(app)
          .put("/api/order/"+ order._id +"/status/" + user._id) 
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Order///////////////////////
            // Check the response
            console.log(response.body)
            expect(response.body.status).toBe(body.status)
          })
        
    })
})