const Broadband = require("../../models/broadband")
const BroadbandLocation = require("../../models/broadbandLocation")
const BroadbandPayHistory = require("../../models/broadbandpayhistory")
const Card  = require("../../models/paymentcards")
const User = require("../../models/user")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");



beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestBOpsTestDB",
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

describe('admin broadband test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";
    test("POST /api/buynewbroadband/:broadbandId/:cardId/:userId", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        
        const card = await Card.create({
              userId :"115560636549278411291",
              cardtype : "Credit",
              cardnumber : 123456789122,
              expirydate : "05/21"
         });
         const broadband  = await Broadband.create({
            "name" : "Premium",
            "monthlyprice" : 499,
            "plantype" : "Prepaid",
            "validity" : 28,
            "data" : 56,
            "uploadspeed" : 500,
            "downloadspeed" : 400,
            "speed" : 400,
            "installationcharges" : 99
        })
        const body ={
            address : "Next to Kangaroo",
            cvv : 123
        }

        await supertest(app)
          .post("/api/buynewbroadband/"+ broadband._id+"/"+card._id+"/"+user._id) 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
            expect(response.body._id).toBeTruthy();
            expect(response.body.address).toBe(body.address)
            expect(response.body.amount).toBe(broadband.monthlyprice+broadband.installationcharges)
          })
    })


    ///////////////////////Check for renew Broadband Plans///////////////
    test("POST /api/renewupgradebroadband/:cardId/:userId", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        const broadband  = await Broadband.create({
            "name" : "Premium",
            "monthlyprice" : 499,
            "plantype" : "Prepaid",
            "validity" : 28,
            "data" : 56,
            "uploadspeed" : 500,
            "downloadspeed" : 400,
            "speed" : 400,
            "installationcharges" : 99
        })
        const card = await Card.create({
              userId :"115560636549278411291",
              cardtype : "Credit",
              cardnumber : 123456789122,
              expirydate : "05/21"
         });
        const broadbandhis = await BroadbandPayHistory.create({
            userId:user._id,
            productId:broadband._id,
            plantype:"Prepaid",
            planfrom:"2021-08-29T16:10:14.748+00:00",
            plantill:"2021-09-26T16:10:14.748+00:00",
            referenceno:"7c683960-6389-4337-a993-6d6efe398248",
            paymentstatus:"Paid",
            amount:698,
            status:"active",
            cardId:card._id,
            usage:"56|"
        })
        const body = {
            currentplan : broadbandhis,
            address : "Beside to Kangaroo",
            cvv : 123
        }
        await supertest(app)
        .post("/api/renewupgradebroadband/"+card._id+"/"+user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(200)
        .then(async (response) => {
            expect(response.body._id).toBeTruthy();
            expect(response.body.address).toBe(body.address)
            expect(response.body.amount).toBe(broadband.monthlyprice)
        })

    })

})