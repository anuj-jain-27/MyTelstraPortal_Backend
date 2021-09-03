const Broadband = require("../../models/broadband")
const BroadbandLocation = require("../../models/broadbandLocation")
const User = require("../../models/user")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestBroadbandTestDB",
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

    ///////////////////////Testing Create Broadband////////////////////////
    test("POST /api/addbroadband/:userId", async () => {
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
          const broadband  ={
                "name" : "Premium",
                "monthlyprice" : 499,
                "plantype" : "Prepaid",
                "validity" : 28,
                "data" : 56,
                "uploadspeed" : 500,
                "downloadspeed" : 400,
                "speed" : 400,
                "installationcharges" : 99
          }
          await supertest(app)
          .post("/api/addbroadband/" + "115560636549278411291") 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(broadband)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Broadband///////////////////////
            // Check the response
                expect(response.body._id).toBeTruthy();
                expect(response.body.name).toBe(broadband.name);
                expect(response.body.monthlyprice).toBe(broadband.monthlyprice);
                expect(response.body.plantype).toBe(broadband.plantype);
                expect(response.body.validity).toBe(broadband.validity);
                expect(response.body.data).toBe(broadband.data);
                expect(response.body.uploadspeed).toBe(broadband.uploadspeed);
                expect(response.body.downloadspeed).toBe(broadband.downloadspeed);
                expect(response.body.speed).toBe(broadband.speed);
                expect(response.body.installationcharges).toBe(broadband.installationcharges);
        
                // Check data in the database
                const res = await Broadband.findOne({ _id: response.body._id });
                expect(res).toBeTruthy();
                expect(res.name).toBe(broadband.name);
                expect(res.monthlyprice).toBe(broadband.monthlyprice);
                expect(res.plantype).toBe(broadband.plantype);
                expect(res.validity).toBe(broadband.validity);
                expect(res.data).toBe(broadband.data);
                expect(res.uploadspeed).toBe(broadband.uploadspeed);
                expect(res.downloadspeed).toBe(broadband.downloadspeed);
                expect(res.speed).toBe(broadband.speed);
                expect(res.installationcharges).toBe(broadband.installationcharges);
            })
    })


    ///////////////////////Testing Update Broadband////////////////////////
    test("PUT /api/product/:productId/:userId", async () => {
        const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mayur",
          lastname : "patil",
          email : "mayurpatil@gmail.com",
          googleId : "115560636549278411291",
          role:1
        }); ///////////////////////Admin Request/////////////////////////
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
            monthlyprice : 599
        }
        await supertest(app).put("/api/updateBroadbandPlan/" + broadband._id +"/"+  user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
            // Check the response
            expect(response.body.monthlyprice).toBe(body.monthlyprice)
          });
      });


      //////////////////////Delete Broadband/////////////////////////
    test("DELETE /api/deletebroadplan/:broadbandId/:userId" , async ()=>{
      const user =  await User.create({ 
        _id: "115560636549278411291", 
        name : "mayur",
        lastname : "patil",
        email : "mayurpatil@gmail.com",
        googleId : "115560636549278411291",
        role:1
      }); ///////////////////////Admin Request/////////////////////////
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

      await supertest(app).delete("/api/deletebroadplan/" + broadband._id +"/"+  user._id)
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          // Check the response
            expect(await Broadband.findOne({ _id: broadband._id })).toBeFalsy();
        });
      })

      //////////////////////////Get Broadband Plan /////////////////////////////
    test("GET /api/broadband", async ()=>{
      const user =  await User.create({ 
        _id: "115560636549278411291", 
        name : "mayur",
        lastname : "patil",
        email : "mayurpatil@gmail.com",
        googleId : "115560636549278411291",
        role:1
      }); ///////////////////////Admin Request/////////////////////////
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

      await supertest(app).get("/api/broadband")
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(1);
          // console.log(response.body)
          expect(await Broadband.findOne({ _id: response.body[0]._id })).toBeTruthy();
        })
    })

    ///////////////////////////Get Broadband Plan by Location////////////////// 
    test("GET /api/broadbandbylocation/:broadbandLocId" ,async ()=>{
      const user =  await User.create({ 
        _id: "115560636549278411291", 
        name : "mayur",
        lastname : "patil",
        email : "mayur@gmail.com",
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
    const loc = await BroadbandLocation.create({
        "suburb":"Melbourne",
        "availableplans" : [broadband._id],
        "city":"Sydney",
        "state":"Victoria",
        "postalcode":4201
      })

    await supertest(app).get("/api/broadbandbylocation/" + loc._id)
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(1);
        })
      })

    //////////////////////////////Get Broadband Plan by ID ////////////////////
    test("GET /api/broadband/:broadbandId", async ()=>{
      const user =  await User.create({ 
        _id: "115560636549278411291", 
        name : "mayur",
        lastname : "patil",
        email : "mayurpatil@gmail.com",
        googleId : "115560636549278411291",
        role:1
      }); ///////////////////////Admin Request/////////////////////////
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

      await supertest(app).get("/api/broadband/" + broadband._id)
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toBe(broadband.name);
          expect(response.body.monthlyprice).toBe(broadband.monthlyprice);
          expect(response.body.plantype).toBe(broadband.plantype);
          expect(response.body.validity).toBe(broadband.validity);
          expect(response.body.data).toBe(broadband.data);
          expect(response.body.uploadspeed).toBe(broadband.uploadspeed);
          expect(response.body.downloadspeed).toBe(broadband.downloadspeed);
          expect(response.body.speed).toBe(broadband.speed);
          expect(response.body.installationcharges).toBe(broadband.installationcharges);
  
          // Check data in the database
          const res = await Broadband.findOne({ _id: response.body._id });
          expect(res).toBeTruthy();
          expect(res.name).toBe(broadband.name);
          expect(res.monthlyprice).toBe(broadband.monthlyprice);
          expect(res.plantype).toBe(broadband.plantype);
          expect(res.validity).toBe(broadband.validity);
          expect(res.data).toBe(broadband.data);
          expect(res.uploadspeed).toBe(broadband.uploadspeed);
          expect(res.downloadspeed).toBe(broadband.downloadspeed);
          expect(res.speed).toBe(broadband.speed);
          expect(res.installationcharges).toBe(broadband.installationcharges);
  
        })
    })
})