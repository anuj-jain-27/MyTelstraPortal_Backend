const Card  = require("../../models/paymentcards")
const User = require("../../models/user")
const Plan = require("../../models/planMessage")
const Post = require("../../models/postMessage")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestMobiPostTestDB",
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

  describe('admin mobile test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";
    test("POST /api/post/create/:userId", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });

        const post = {
            plan : 199,
            validity : 28,
            data : 50,
            SMS : 100,
            cost : 199
          }
        await supertest(app)
        .post("/api/post/create/" +user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(post)
        .expect(200)
        .then(async (response) => {
            console.log(response.body)
            expect(response.body.newpostmessage._id).toBeTruthy();
            expect(response.body.newpostmessage.plan).toBe(post.plan)
            expect(response.body.newpostmessage.validity).toBe(post.validity)
            expect(response.body.newpostmessage.data).toBe(post.data)
            expect(response.body.newpostmessage.cost).toBe(post.cost)
            expect(response.body.newpostmessage.SMS).toBe(post.SMS)

            const res = await Post.findOne({ _id: response.body.newpostmessage._id });
            expect(res).toBeTruthy();
            expect(res.plan).toBe(post.plan)
            expect(res.validity).toBe(post.validity)
            expect(res.data).toBe(post.data)
            expect(res.cost).toBe(post.cost)
            expect(res.SMS).toBe(post.SMS)
        })

    })

    test("GET api/posts", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });

        const post = await Post.create({
            plan : 199,
            validity : 28,
            data : 50,
            SMS : 100,
            cost : 199
          })

          await supertest(app)
          .get("/api/posts") 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
      
            // Check data
            expect(response.body[0]._id).toBe(post.id);
          })
    })

    test("GET /api/post/:postid", async () => {
        const post = await Post.create(
            { 
                plan : 499,
                validity : 90,
                data : 75,
                SMS : 600,
                cost : 200
            });
        await supertest(app).get("/api/post/" + post.id)
          .expect(200)
          .then((response) => {
            // Check data
            expect(response.body.plan).toBe(post.plan);
            expect(response.body.validity).toBe(post.validity);
            expect(response.body.data).toBe(post.data);
            expect(response.body.SMS).toBe(post.SMS);
            expect(response.body.cost).toBe(post.cost)
          })
      });

      test("PUT api/post/:postid/:userId" , async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });

        const post = await Post.create({
            plan : 199,
            validity : 28,
            data : 50,
            sms : 100,
            cost : 199
          })
        const body ={
            plan : 199,
            validity : 28,
            data : 50,
            sms : 100,
            cost : 299
          }
        
          await supertest(app)
          .put("/api/post/"+ post._id +"/" +user._id) 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => { 
            console.log(response.body)
            expect(response.body._id).toBeTruthy();
            expect(response.body.plan).toBe(body.plan)
            expect(response.body.validity).toBe(body.validity)
            expect(response.body.data).toBe(body.data)
            expect(response.body.SMS).toBe(body.SMS)
            expect(response.body.cost).toBe(body.cost)
          })
      })

    test("DELETE api/post/:postid/:userId", async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });

        const post = await Post.create({
            plan : 199,
            validity : 28,
            data : 50,
            sms : 100,
            cost : 199
          })

          await supertest(app)
          .delete("/api/post/"+ post._id +"/" +user._id) 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {  
            expect(await Post.findOne({ _id: post._id })).toBeFalsy();
          })
    })
})
