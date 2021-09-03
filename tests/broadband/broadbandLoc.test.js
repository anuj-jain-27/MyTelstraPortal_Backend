const Broadband = require("../../models/broadband")
const BroadbandLocation = require("../../models/broadbandLocation")
const User = require("../../models/user")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestBLocTestDB",
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

    ///////////////////////Testing Create Broadband Location////////////////////////
    test("POST /api/addBroadBandLocation/:userId", async () => {
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        const loc = {
            "suburb":"Melbourne",
            "city":"Sydney",
            "state":"Victoria",
            "postalcode":4201
        }
        await supertest(app)
          .post("/api/addBroadBandLocation/" + user._id) 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(loc)
          .expect(200)
          .then(async (response) => {
            expect(response.body._id).toBeTruthy();
            expect(response.body.suburb).toBe(loc.suburb);
            expect(response.body.city).toBe(loc.city);
            expect(response.body.state).toBe(loc.state);
            expect(response.body.postalcode).toBe(loc.postalcode);

            const res = await BroadbandLocation.findOne({ _id: response.body._id });
                expect(res).toBeTruthy();
                expect(res.suburb).toBe(loc.suburb);
                expect(res.city).toBe(loc.city);
                expect(res.state).toBe(loc.state);
                expect(res.postalcode).toBe(loc.postalcode);
          })
    })

    ////////////////////////Testing Update Broadband Location//////////////////////////

    test("PUT /updatebroadlocation/:broadbandLocId/:userId", async ()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        const loc = await BroadbandLocation.create({
            "suburb":"Melbourne",
            "city":"Sydney",
            "state":"Victoria",
            "postalcode":4201
        })
        const body ={
            postalcode : 5012
        }
        await supertest(app)
        .put("/api/updatebroadlocation/"+ loc._id +"/"+ user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(200)
          .then(async (response) => {
              expect(response.body.postalcode).toBe(body.postalcode)
          })

    })


    ////////////////////////Testing Add plan to Location//////////////////////

    test("POST /api/addplantolocation/:broadbandLocId/:userId", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        const loc = await BroadbandLocation.create({
            "suburb":"Melbourne",
            "city":"Sydney",
            "state":"Victoria",
            "postalcode":4201
        })
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
            "plans" : [{
                 "_id" : broadband._id
            }]
        }
        await supertest(app)
        .post("/api/addplantolocation/"+ loc._id +"/"+ user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(200)
          .then(async (response) => {
              expect(response.body).toBeTruthy();
              expect(Array.isArray(response.body.availableplans)).toBeTruthy();
              expect(response.body.availableplans.length).toEqual(1);
          })
    })


    /////////////////////// Delete Broadband Location /////////////////

    test("DELETE /api/deletebroadlocation/:broadbandLocId/:userId" , async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        const loc = await BroadbandLocation.create({
            "suburb":"Melbourne",
            "city":"Sydney",
            "state":"Victoria",
            "postalcode":4201
        })
        await supertest(app)
        .delete("/api/deletebroadlocation/"+ loc._id +"/"+ user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
          .then(async (response) => {
            expect(await BroadbandLocation.findOne({ _id: loc._id })).toBeFalsy();
          })
    })

    ///////////////////////////Get BroadbandLocations ////////////////////////////

    test("GET api/broadbandlocation", async ()=>{
        const loc = await BroadbandLocation.create({
            "suburb":"Melbourne",
            "city":"Sydney",
            "state":"Victoria",
            "postalcode":4201
        })
        await supertest(app)
        .get("/api/broadbandlocation") 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
          .then(async (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
            // console.log(response.body)
            expect(await BroadbandLocation.findOne({ _id: response.body[0]._id })).toBeTruthy();
          })
    })

})